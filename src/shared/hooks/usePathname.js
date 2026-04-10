import { useCallback, useEffect, useState } from 'react';
import { normalizeAppPathname } from '../constants/routes.js';

function getCurrentPathname() {
  return normalizeAppPathname(window.location.pathname || '/');
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

  const navigate = useCallback((nextPathname, options = {}) => {
    const currentPathname = getCurrentPathname();
    const normalizedNextPathname = normalizeAppPathname(nextPathname);

    if (normalizedNextPathname === currentPathname) {
      return;
    }

    if (options.replace) {
      window.history.replaceState({}, '', normalizedNextPathname);
    } else {
      window.history.pushState({}, '', normalizedNextPathname);
    }

    setPathname(normalizedNextPathname);
    notifyPathnameChange();
  }, []);

  return [pathname, navigate];
}
