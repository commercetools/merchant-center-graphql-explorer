import { URL_GRAPHQL_EXPLORER } from '../support/urls';

const testCases = [
  {
    linkName: 'Explore the commercetools platform GraphQL API',
    queryName: 'ProjectInfo',
    urlPath: 'platform',
  },
  {
    linkName: 'Explore the Merchant Center Users GraphQL API',
    queryName: 'AboutMe',
    urlPath: 'users',
  },
  {
    linkName: 'Explore the Merchant Center Settings GraphQL API',
    queryName: 'ProjectExtension',
    urlPath: 'settings',
  },
];

testCases.forEach((testCase) => {
  describe(`rendering graphiql for "${testCase.urlPath}"`, () => {
    it('should render page and execute query', () => {
      cy.login({ redirectToUri: URL_GRAPHQL_EXPLORER });
      cy.findByText(testCase.linkName).click();
      cy.url().should('include', `${URL_GRAPHQL_EXPLORER}/${testCase.urlPath}`);
      cy.findByText(testCase.queryName).should('exist');
      cy.findByTitle(/^Execute Query/).click();
      cy.findByText('"data"').should('exist');
    });
  });
});
