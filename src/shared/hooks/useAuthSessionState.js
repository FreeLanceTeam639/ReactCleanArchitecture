import { useEffect, useState } from 'react';
import { getAuthenticatedUser, subscribeToAuthSessionChange } from '../lib/storage/authStorage.js';

export function useAuthSessionState() {
  const [session, setSession] = useState(() => getAuthenticatedUser());

  useEffect(() => subscribeToAuthSessionChange(setSession), []);

  return session;
}
