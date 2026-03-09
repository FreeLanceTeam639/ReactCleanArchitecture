import HomePage from '../pages/home/HomePage.jsx';
import LoginPage from '../pages/login/LoginPage.jsx';
import { ROUTES } from '../shared/constants/routes.js';
import { usePathname } from '../shared/hooks/usePathname.js';

function App() {
  const [pathname, navigate] = usePathname();

  if (pathname === ROUTES.login) {
    return <LoginPage navigate={navigate} />;
  }

  return <HomePage navigate={navigate} />;
}

export default App;
