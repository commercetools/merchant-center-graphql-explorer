import "graphiql/graphiql.css";
import "./graphiql-overrides.css";
import React from "react";
import GraphiQL from "graphiql";
import GraphiQLExplorer from "graphiql-explorer";
import { buildClientSchema, getIntrospectionQuery, parse } from "graphql";
import { actions, useAsyncDispatch } from "@commercetools-frontend/sdk";

const useFetcher = ({ target }) => {
  const dispatch = useAsyncDispatch();
  return React.useCallback(
    (params) =>
      dispatch(
        actions.post({
          uri: "/graphql",
          payload: JSON.stringify(params),
          headers: {
            "X-Graphql-Target": target,
          },
        })
      ).catch((error) => error.body || error),
    [target]
  );
};

const getHydratedQuery = (props) => {
  const value = window.localStorage.getItem(`graphiql:query:${props.target}`);
  console.log("storage", value);
  if (!value) {
    window.localStorage.removeItem(`graphiql:query:${props.target}`);
    return props.initialQuery;
  }
  return value;
};

const Editor = (props) => {
  const graphiqlRef = React.useRef();
  const [schema, setSchema] = React.useState(null);
  const [query, setQuery] = React.useState(null);
  const [explorerIsOpen, setExplorerIsOpen] = React.useState(true);
  const fetcher = useFetcher({ target: props.target });
  // Set things up on first render
  React.useEffect(() => {
    setQuery(getHydratedQuery(props));
    const exec = async () => {
      const result = await fetcher({ query: getIntrospectionQuery() });
      setSchema(buildClientSchema(result.data));
    };
    exec();
  }, [props.target]);
  // From https://github.com/OneGraph/graphiql-explorer-example/blob/3f51a36ca1a891cd32561ab25581c5630be3446e/src/App.js#L104-L160
  const handleInspectOperation = React.useCallback((cm, mousePos) => {
    const parsedQuery = parse(query || "");

    if (!parsedQuery) {
      console.error("Couldn't parse query document");
      return null;
    }

    var token = cm.getTokenAt(mousePos);
    var start = { line: mousePos.line, ch: token.start };
    var end = { line: mousePos.line, ch: token.end };
    var relevantMousePos = {
      start: cm.indexFromPos(start),
      end: cm.indexFromPos(end),
    };

    var position = relevantMousePos;

    var def = parsedQuery.definitions.find((definition) => {
      if (!definition.loc) {
        console.log("Missing location information for definition");
        return false;
      }

      const { start, end } = definition.loc;
      return start <= position.start && end >= position.end;
    });

    if (!def) {
      console.error(
        "Unable to find definition corresponding to mouse position"
      );
      return null;
    }

    var operationKind =
      def.kind === "OperationDefinition"
        ? def.operation
        : def.kind === "FragmentDefinition"
        ? "fragment"
        : "unknown";

    var operationName =
      def.kind === "OperationDefinition" && !!def.name
        ? def.name.value
        : def.kind === "FragmentDefinition" && !!def.name
        ? def.name.value
        : "unknown";

    var selector = `.graphiql-explorer-root #${operationKind}-${operationName}`;

    var el = document.querySelector(selector);
    el && el.scrollIntoView();
  });
  // Extra configuration for editor
  React.useEffect(() => {
    const editor = graphiqlRef.current.getQueryEditor();
    editor.setOption("extraKeys", {
      ...(editor.options.extraKeys || {}),
      "Shift-Alt-LeftClick": handleInspectOperation,
    });
  }, [graphiqlRef]);

  const handleToggleExplorer = React.useCallback(() => {
    setExplorerIsOpen((prevState) => !prevState);
  });

  return (
    <div className="graphiql-container">
      <GraphiQLExplorer
        schema={schema}
        query={query}
        onEdit={setQuery}
        onRunOperation={(operationName) =>
          graphiqlRef.current.handleRunQuery(operationName)
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
            onClick={() => graphiqlRef.current.handlePrettifyQuery()}
            label="Prettify"
            title="Prettify Query (Shift-Ctrl-P)"
          />
          <GraphiQL.Button
            onClick={() => graphiqlRef.current.handleToggleHistory()}
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
  );
};

export default Editor;
