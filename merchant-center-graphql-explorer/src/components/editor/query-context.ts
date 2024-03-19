import { createContext, type Dispatch, type SetStateAction } from 'react';

type QueryContextType = {
  query: string;
  setQuery: Dispatch<SetStateAction<string>>;
};

const QueryContext = createContext<QueryContextType>({
  query: '',
  setQuery: () => {},
});

export default QueryContext;
