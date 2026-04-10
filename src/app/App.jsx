import { useAuthSessionState } from '../shared/hooks/useAuthSessionState.js';
import { usePathname } from '../shared/hooks/usePathname.js';
import BackgroundPaths from '../components/ui/background-paths.jsx';
import { isAuthenticationRoute, renderAppRoute } from './routes/routeRegistry.jsx';
import { useAppNavigationEffects } from './hooks/useAppNavigationEffects.js';

function App() {
  const authSession = useAuthSessionState();
  const [pathname, navigate] = usePathname();
  useAppNavigationEffects({ authSession, pathname, navigate });
  const isAuthRoute = isAuthenticationRoute(pathname);

  if (authSession && isAuthRoute) {
    return null;
  }

  return (
    <div className={isAuthRoute ? 'appShell authRouteShell' : 'appShell'}>
      {isAuthRoute ? null : <BackgroundPaths decorative className="appShellBackground" />}
      <div className="appShellContent">{renderAppRoute(pathname, navigate)}</div>
    </div>
  );
}

export default App;
