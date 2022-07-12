import 'graphiql/graphiql.css';
import './graphiql-overrides.css';
import { useCallback, useRef, useState, useEffect } from 'react';
import GraphiQL from 'graphiql';
import { useExecutionContext } from '@graphiql/react';
import GraphiQLExplorer from 'graphiql-explorer';
import {
  type GraphQLSchema,
  buildClientSchema,
  getIntrospectionQuery,
  parse,
} from 'graphql';
import type { TGraphQLTargets } from '@commercetools-frontend/constants';
import {
  actions,
  useAsyncDispatch,
  type TSdkActionPostForUri,
} from '@commercetools-frontend/sdk';

type TEditorProps = {
  target: TGraphQLTargets;
  // Note: Used in getter function.
  // eslint-disable-next-line react/no-unused-prop-types
  initialQuery: string;
};
type TUseFetcherOptions = {
  target: TEditorProps['target'];
};
type TGraphQlIntrospectionResult = {
  data: Record<string, unknown>;
};

const useFetcher = ({ target }: TUseFetcherOptions) => {
  const dispatch = useAsyncDispatch<
    TSdkActionPostForUri,
    TGraphQlIntrospectionResult
  >();
  return useCallback(
    (params) =>
      dispatch(
        actions.post({
          uri: '/graphql',
          payload: JSON.stringify(params),
          headers: {
            'X-Graphql-Target': target,
          },
        })
      ).catch((error) => error.body || error),
    // Do not use `dispatch` otherwise we end up in an infinite loop.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [target]
  );
};

const getHydratedQuery = (props: TEditorProps) => {
  const value = window.localStorage.getItem(`graphiql:query:${props.target}`);
  if (!value) {
    window.localStorage.removeItem(`graphiql:query:${props.target}`);
    return props.initialQuery;
  }
  return value;
};

const Editor = (props: TEditorProps) => {
  const graphiqlRef = useRef<GraphiQL>(null);
  const [schema, setSchema] = useState<GraphQLSchema>();
  const [query, setQuery] = useState<string>();
  const [explorerIsOpen, setExplorerIsOpen] = useState(true);
  const fetcher = useFetcher({ target: props.target });
  // Set things up on first render
  useEffect(() => {
    setQuery(getHydratedQuery(props));
    const exec = async () => {
      const result = await fetcher({ query: getIntrospectionQuery() });
      setSchema(buildClientSchema(result.data));
    };
    exec();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.target, fetcher]);
  // From https://github.com/OneGraph/graphiql-explorer-example/blob/3f51a36ca1a891cd32561ab25581c5630be3446e/src/App.js#L104-L160
  const handleInspectOperation = useCallback(
    (cm, mousePos) => {
      const parsedQuery = parse(query || '');

      if (!parsedQuery) {
        console.error("Couldn't parse query document");
        return;
      }

      const token = cm.getTokenAt(mousePos);
      const start = { line: mousePos.line, ch: token.start };
      const end = { line: mousePos.line, ch: token.end };
      const relevantMousePos = {
        start: cm.indexFromPos(start),
        end: cm.indexFromPos(end),
      };

      const position = relevantMousePos;

      const def = parsedQuery.definitions.find((definition) => {
        if (!definition.loc) {
          console.warn('Missing location information for definition');
          return false;
        }
        return (
          definition.loc.start <= position.start &&
          definition.loc.end >= position.end
        );
      });

      if (!def) {
        console.error(
          'Unable to find definition corresponding to mouse position'
        );
        return;
      }

      let operationKind;
      let operationName;
      switch (def.kind) {
        case 'OperationDefinition':
          operationKind = def.operation;
          if (def.name) {
            operationName = def.name.value;
          }
          break;
        case 'FragmentDefinition':
          operationKind = 'fragment';
          if (def.name) {
            operationName = def.name.value;
          }
          break;

        default:
          operationKind = 'unknown';
          operationName = 'unknown';
          break;
      }

      const selector = `.graphiql-explorer-root #${operationKind}-${operationName}`;

      const el = document.querySelector(selector);
      el && el.scrollIntoView();
    },
    [query]
  );
  // Extra configuration for editor
  useEffect(() => {
    const editor = graphiqlRef.current?.getQueryEditor();
    editor?.setOption('extraKeys', {
      ...(editor.options.extraKeys || {}),
      'Shift-Alt-LeftClick': handleInspectOperation,
    });
  }, [graphiqlRef, handleInspectOperation]);

  const handleToggleExplorer = useCallback(() => {
    setExplorerIsOpen((prevState) => !prevState);
  }, []);

  const executionContext = useExecutionContext();

  return (
    <div>
      <div className="graphiql-container">
        <GraphiQLExplorer
          schema={schema}
          query={query ?? ''}
          onEdit={setQuery}
          onRunOperation={(operationName) =>
            executionContext?.run(operationName)
          }
          explorerIsOpen={explorerIsOpen}
          onToggleExplorer={handleToggleExplorer}
        />
        <GraphiQL
          ref={graphiqlRef}
          fetcher={fetcher}
          schema={schema}
          query={query}
          onEditQuery={setQuery}
          storage={{
            ...window.localStorage,
            getItem: (key) =>
              window.localStorage.getItem(`${key}:${props.target}`),
            setItem: (key, value) =>
              window.localStorage.setItem(`${key}:${props.target}`, value),
            removeItem: (key) =>
              window.localStorage.removeItem(`${key}:${props.target}`),
          }}
        >
          <GraphiQL.Toolbar>
            <GraphiQL.Button
              onClick={() => {
                graphiqlRef.current?.ref?.props.prettify();
              }}
              label="Prettify"
              title="Prettify Query (Shift-Ctrl-P)"
            />
            <GraphiQL.Button
              onClick={() => {
                graphiqlRef.current?.ref?.props.historyContext?.toggle();
              }}
              label="History"
              title="Show History"
            />
            <GraphiQL.Button
              onClick={handleToggleExplorer}
              label="Explorer"
              title="Toggle Explorer"
            />
          </GraphiQL.Toolbar>
        </GraphiQL>
      </div>
    </div>
  );
};
Editor.displayName = 'Editor';

export default Editor;
