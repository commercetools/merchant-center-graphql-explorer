import { entryPointUriPath, PERMISSIONS } from './src/constants';
import type { ConfigOptionsForCustomApplication } from '@commercetools-frontend/application-config';

const config: ConfigOptionsForCustomApplication = {
  name: 'GraphQL Explorer',
  entryPointUriPath,
  cloudIdentifier: 'gcp-eu',
  env: {
    development: {
      initialProjectKey: '${env:CTP_INITIAL_PROJECT_KEY}',
    },
    production: {
      applicationId: '${env:APPLICATION_ID}',
      url: '${env:APPLICATION_URL}',
    },
  },
  oAuthScopes: {
    view: [
      'view_api_clients',
      'view_cart_discounts',
      'view_customer_groups',
      'view_customers',
      'view_discount_codes',
      'view_import_containers',
      'view_orders',
      'view_payments',
      'view_products',
      'view_project_settings',
      'view_shipping_methods',
      'view_states',
      'view_stores',
      'view_tax_categories',
      'view_types',
    ],
    manage: [],
  },
  headers: {
    csp: {
      'connect-src': ['${env:HOST_GCP_STAGING}'],
    },
  },
  icon: '${path:@commercetools-frontend/assets/application-icons/rocket.svg}',
  mainMenuLink: {
    permissions: [PERMISSIONS.View],
    defaultLabel: 'Graphql Explorer',
    labelAllLocales: [],
  },
  submenuLinks: [
    {
      uriPath: 'platform',
      permissions: [PERMISSIONS.View],
      defaultLabel: 'commercetools platform',
      labelAllLocales: [],
    },
    {
      uriPath: 'users',
      permissions: [PERMISSIONS.View],
      defaultLabel: 'Users',
      labelAllLocales: [],
    },
    {
      uriPath: 'settings',
      permissions: [PERMISSIONS.View],
      defaultLabel: 'Settings',
      labelAllLocales: [],
    },
  ],
};

export default config;
