declare module 'graphiql-explorer' {
  import type { ReactNode } from 'react';
  import type {
    GraphQLArgument,
    GraphQLEnumType,
    GraphQLField,
    GraphQLInputField,
    GraphQLScalarType,
    GraphQLSchema,
    FragmentDefinitionNode,
    ValueNode,
    GraphQLObjectType,
  } from 'graphql';

  type Field = GraphQLField<unknown, unknown>;

  type GetDefaultScalarArgValue = (
    parentField: Field,
    arg: GraphQLArgument | GraphQLInputField,
    underlyingArgType: GraphQLEnumType | GraphQLScalarType
  ) => ValueNode;

  type MakeDefaultArg = (
    parentField: Field,
    arg: GraphQLArgument | GraphQLInputField
  ) => boolean;

  type Colors = {
    keyword: string;
    def: string;
    property: string;
    qualifier: string;
    attribute: string;
    number: string;
    string: string;
    builtin: string;
    string2: string;
    variable: string;
    atom: string;
  };

  type StyleMap = {
    [key: string]: unknown;
  };

  type Styles = {
    explorerActionsStyle: StyleMap;
    buttonStyle: StyleMap;
    actionButtonStyle: StyleMap;
  };

  type StyleConfig = {
    colors: Colors;
    arrowOpen: ReactNode;
    arrowClosed: ReactNode;
    checkboxChecked: ReactNode;
    checkboxUnchecked: ReactNode;
    styles: Styles;
  };

  // https://github.com/OneGraph/graphiql-explorer/blob/master/src/Explorer.js
  type GraphiQLExplorerProps = {
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
    arrowOpen?: ReactNode;
    arrowClosed?: ReactNode;
    checkboxChecked?: ReactNode;
    checkboxUnchecked?: ReactNode;
    styles?: {
      explorerActionsStyle?: StyleMap;
      buttonStyle?: StyleMap;
      actionButtonStyle?: StyleMap;
    };
    showAttribution?: boolean;
    hideActions?: boolean;
    externalFragments?: FragmentDefinitionNode[];
  };

  const GraphiQLExplorer: {
    (
      props: GraphiQLExplorerProps
    ): import('@emotion/react/jsx-runtime').JSX.Element;
    displayName: string;
    defaultProps: Pick<
      GraphiQLExplorerProps,
      'getDefaultFieldNames' | 'getDefaultScalarArgValue'
    >;
    defaultValue: (arg: GraphQLEnumType | GraphQLScalarType) => ValueNode;
  };

  export default GraphiQLExplorer;
}
