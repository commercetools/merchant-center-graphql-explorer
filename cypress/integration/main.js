import { applicationBaseRoute, entryPointUriPath } from '../support/constants';

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
      cy.loginByOidc({ entryPointUriPath });
      cy.findByText(testCase.linkName).click();
      cy.url().should('include', `${applicationBaseRoute}/${testCase.urlPath}`);
      cy.findByText(testCase.queryName).should('exist');
      cy.findByTitle(/^Execute Query/).click();
      cy.findByText('"data"').should('exist');
    });
  });
});
