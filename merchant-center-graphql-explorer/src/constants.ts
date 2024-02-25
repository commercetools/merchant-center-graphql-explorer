// Make sure to import the helper functions from the `ssr` entry point.
import { entryPointUriPathToPermissionKeys } from '@commercetools-frontend/application-shell/ssr';

declare const window: Window &
  typeof globalThis & {
    app: { entryPointUriPath: string };
  };

export const entryPointUriPath =
  typeof window === 'undefined'
    ? process.env.ENTRY_POINT_URI_PATH !== undefined &&
      process.env.ENTRY_POINT_URI_PATH.length > 0
      ? process.env.ENTRY_POINT_URI_PATH
      : 'graphql-explorer-commercetools'
    : window.app.entryPointUriPath;
export const PERMISSIONS = entryPointUriPathToPermissionKeys(entryPointUriPath);
