import { useEffect, useState } from 'react';

function getCurrentPathname() {
  return window.location.pathname || '/';
}

function notifyPathnameChange() {
  window.dispatchEvent(new PopStateEvent('popstate'));
}

export function usePathname() {
  const [pathname, setPathname] = useState(getCurrentPathname);

  useEffect(() => {
    const syncPathname = () => setPathname(getCurrentPathname());

    window.addEventListener('popstate', syncPathname);

    return () => {
      window.removeEventListener('popstate', syncPathname);
    };
  }, []);

  const navigate = (nextPathname, options = {}) => {
    if (nextPathname === pathname) {
      return;
    }

    if (options.replace) {
      window.history.replaceState({}, '', nextPathname);
    } else {
      window.history.pushState({}, '', nextPathname);
    }

    setPathname(nextPathname);
    notifyPathnameChange();
  };

  return [pathname, navigate];
}
