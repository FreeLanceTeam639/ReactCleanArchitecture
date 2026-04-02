import { useAuthSessionState } from '../shared/hooks/useAuthSessionState.js';
import { usePathname } from '../shared/hooks/usePathname.js';
import { isAuthenticationRoute, renderAppRoute } from './routes/routeRegistry.jsx';
import { useAppNavigationEffects } from './hooks/useAppNavigationEffects.js';

function App() {
  const authSession = useAuthSessionState();
  const [pathname, navigate] = usePathname();
  useAppNavigationEffects({ authSession, pathname, navigate });

  if (authSession && isAuthenticationRoute(pathname)) {
    return null;
  }

  return renderAppRoute(pathname, navigate);
}

export default App;
