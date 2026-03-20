import { useEffect, useState } from 'react';

function getCurrentPathname() {
  return window.location.pathname || '/';
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

  const navigate = (nextPathname) => {
    if (nextPathname === pathname) {
      return;
    }

    window.history.pushState({}, '', nextPathname);
    setPathname(nextPathname);
  };

  return [pathname, navigate];
}
