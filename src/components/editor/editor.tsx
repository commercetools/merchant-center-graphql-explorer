import 'graphiql/graphiql.css';
import './graphiql-overrides.css';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { type FetcherOpts, type FetcherParams } from '@graphiql/toolkit';
import { GraphiQL } from 'graphiql';
import {
  buildApiUrl,
  executeHttpClientRequest,
} from '@commercetools-frontend/application-shell';
import type {
  TGraphQLTargets,
  ApplicationWindow,
} from '@commercetools-frontend/constants';
import createHttpUserAgent from '@commercetools/http-user-agent';
import explorerPlugin from './plugin-explorer';
import QueryContext from './query-context';

declare let window: ApplicationWindow;

type TEditorProps = {
  target: TGraphQLTargets;
  initialQuery: string;
};

const userAgent = createHttpUserAgent({
  name: 'fetch-client',
  libraryName: window.app.applicationName,
});

const graphqlFetcher = async (
  graphQLParams: FetcherParams,
  fetcherOpts?: FetcherOpts
) => {
  const data = await executeHttpClientRequest(
    async (options) => {
      const res = await fetch(buildApiUrl('/graphql'), {
        ...options,
        method: 'POST',
        body: JSON.stringify(graphQLParams),
      });
      const data = res.json();
      return {
        data,
        statusCode: res.status,
        getHeader: (key) => res.headers.get(key),
      };
    },
    {
      userAgent,
      headers: {
        'content-type': 'application/json',
        ...fetcherOpts?.headers,
      },
    }
  );
  return data;
};

const Editor = (props: TEditorProps) => {
  const [query, setQuery] = useState<string>(props.initialQuery);
  const context = useMemo(() => ({ query, setQuery }), [query]);
  const fetcher = useCallback(
    (graphQLParams: FetcherParams, fetcherOpts?: FetcherOpts) =>
      graphqlFetcher(graphQLParams, {
        ...fetcherOpts,
        headers: {
          'X-GraphQL-Target': props.target,
        },
      }),
    [props.target]
  );
  useEffect(() => {
    setQuery(props.initialQuery);
  }, [props.initialQuery]);

  return (
    <div>
      <QueryContext.Provider value={context}>
        <GraphiQL
          fetcher={fetcher}
          query={query}
          onEditQuery={(newQuery) => setQuery(newQuery)}
          plugins={[explorerPlugin]}
        />
      </QueryContext.Provider>
    </div>
  );
};
Editor.displayName = 'Editor';

export default Editor;
