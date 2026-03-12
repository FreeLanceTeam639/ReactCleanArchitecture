import HomePage from '../pages/home/HomePage.jsx';
import LoginPage from '../pages/login/LoginPage.jsx';
import TaskDetailPage from '../pages/task-detail/TaskDetailPage.jsx';
import { isTaskDetailRoute, ROUTES } from '../shared/constants/routes.js';
import { usePathname } from '../shared/hooks/usePathname.js';
import RegisterPage from '../pages/register/RegisterPage.jsx';

function App() {
  const [pathname, navigate] = usePathname();

  if (pathname === ROUTES.login) {
    return <LoginPage navigate={navigate} />;
  }

  if (pathname === ROUTES.register) {
    return <RegisterPage navigate={navigate} />;
  }

  if (isTaskDetailRoute(pathname)) {
    return <TaskDetailPage navigate={navigate} pathname={pathname} />;
  }

  return <HomePage navigate={navigate} />;
}

export default App;
