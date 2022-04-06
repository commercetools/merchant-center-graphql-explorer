declare module 'graphiql-explorer' {
  // https://github.com/OneGraph/graphiql-explorer/blob/master/src/Explorer.js
  declare type GraphiQLExplorerProps = {
    query: string;
    width?: number;
    title?: string;
    schema?: GraphQLSchema;
    onEdit: (value: string) => void;
    getDefaultFieldNames?: (type: GraphQLObjectType) => Array<string>;
    getDefaultScalarArgValue?: GetDefaultScalarArgValue;
    makeDefaultArg?: MakeDefaultArg;
    onToggleExplorer: () => void;
    explorerIsOpen: boolean;
    onRunOperation?: (name?: string) => void;
    colors?: Colors;
    arrowOpen?: React.Node;
    arrowClosed?: React.Node;
    checkboxChecked?: React.Node;
    checkboxUnchecked?: React.Node;
    styles?: {
      explorerActionsStyle?: StyleMap;
      buttonStyle?: StyleMap;
      actionButtonStyle?: StyleMap;
    };
    showAttribution?: boolean;
    hideActions?: boolean;
    externalFragments?: FragmentDefinitionNode[];
  };

  declare const GraphiQLExplorer: {
    (
      props: GraphiQLExplorerProps
    ): import('@emotion/react/jsx-runtime').JSX.Element;
    displayName: string;
    defaultProps: Pick<
      GraphiQLExplorerProps,
      'getDefaultFieldNames' | 'getDefaultScalarArgValue'
    >;
  };

  export default GraphiQLExplorer;
}
