import { useEffect } from 'react';
import { ROUTES } from '../../shared/constants/routes.js';
import { consumePostLoginRedirect } from '../../shared/lib/storage/authStorage.js';
import {
  clearActiveBillingCheckoutState,
  getBillingCheckoutState
} from '../../shared/lib/storage/billingCheckoutStorage.js';
import { isAuthenticationRoute, resolveAuthenticatedRoute } from '../routes/routeRegistry.jsx';

export function useAppNavigationEffects({ authSession, pathname, navigate }) {
  useEffect(() => {
    if (pathname !== ROUTES.billing) {
      clearActiveBillingCheckoutState();
    }
  }, [pathname]);

  useEffect(() => {
    if (!authSession || !isAuthenticationRoute(pathname)) {
      return;
    }

    const postLoginRedirect = consumePostLoginRedirect();
    const hasBillingCheckoutState = Boolean(getBillingCheckoutState());

    if (
      postLoginRedirect &&
      postLoginRedirect !== ROUTES.login &&
      (postLoginRedirect !== ROUTES.billing || hasBillingCheckoutState)
    ) {
      navigate(postLoginRedirect, { replace: true });
      return;
    }

    navigate(resolveAuthenticatedRoute(authSession), { replace: true });
  }, [authSession, pathname, navigate]);
}
