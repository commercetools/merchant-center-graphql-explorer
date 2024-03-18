// Make sure to import the helper functions from the `ssr` entry point.
import { entryPointUriPathToPermissionKeys } from '@commercetools-frontend/application-shell/ssr';

export const entryPointUriPath =
  process.env.ENTRY_POINT_URL_PATH || 'graphql-explorer-commercetools';
export const PERMISSIONS = entryPointUriPathToPermissionKeys(entryPointUriPath);
