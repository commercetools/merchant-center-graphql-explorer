import { lazy } from 'react';
import {
  ApplicationShell,
  setupGlobalErrorListener,
} from '@commercetools-frontend/application-shell';
import { Sdk } from '@commercetools-frontend/sdk';
import * as globalActions from '@commercetools-frontend/actions-global';
import { FEATURE_FLAGS } from '../../constants';
import loadMessages from '../../load-messages';

// Here we split up the main (app) bundle with the actual application business logic.
// Splitting by route is usually recommended and you can potentially have a splitting
// point for each route. More info at https://reactjs.org/docs/code-splitting.html
const AsyncApplicationRoutes = lazy(() =>
  import('../../routes' /* webpackChunkName: "app-routes" */)
);

// Ensure to setup the global error listener before any React component renders
// in order to catch possible errors on rendering/mounting.
setupGlobalErrorListener();

const EntryPoint = () => (
  <ApplicationShell
    environment={window.app}
    onRegisterErrorListeners={({ dispatch }) => {
      Sdk.Get.errorHandler = (error) =>
        globalActions.handleActionError(error)(dispatch);
    }}
    applicationMessages={loadMessages}
    featureFlags={FEATURE_FLAGS}
  >
    <AsyncApplicationRoutes />
  </ApplicationShell>
);
EntryPoint.displayName = 'EntryPoint';

export default EntryPoint;
