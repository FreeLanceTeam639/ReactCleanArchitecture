import { STORAGE_KEYS } from '../../constants/storageKeys.js';
import { clearPersistentValue, readPersistentValue, writePersistentValue } from './clientPersistence.js';

const INTENT_EXPIRY_MS = 15 * 60 * 1000;
const ACTIVE_EXPIRY_MS = 2 * 60 * 60 * 1000;

function normalizeUserId(user) {
  const value = user?.id ?? user?.Id ?? user?.userId ?? user?.UserId ?? '';
  return typeof value === 'string' ? value.trim() : String(value || '').trim();
}

function normalizeUserName(user) {
  const fullName = [user?.firstName, user?.lastName].filter(Boolean).join(' ').trim();

  return String(
    user?.fullName ||
    user?.name ||
    fullName ||
    user?.userName ||
    user?.username ||
    ''
  ).trim();
}

function normalizeBillingPeriod(value) {
  return String(value || '').toLowerCase() === 'yearly' ? 'yearly' : 'monthly';
}

function normalizePlanKey(value) {
  const normalized = String(value || '').trim().toLowerCase();

  if (normalized === 'starter' || normalized === 'growth' || normalized === 'free') {
    return normalized;
  }

  return 'starter';
}

function normalizeEntryRoute(value) {
  return String(value || '').trim().toLowerCase() === '/register' ? '/register' : '/login';
}

function readCheckoutState() {
  try {
    const rawValue = readPersistentValue(STORAGE_KEYS.billingCheckoutState);
    return rawValue ? JSON.parse(rawValue) : null;
  } catch {
    return null;
  }
}

function resolveCookieLifetimeSeconds(value) {
  const createdAt = Number(value?.createdAt || Date.now());
  const activeTtl = value?.status === 'active' ? ACTIVE_EXPIRY_MS : INTENT_EXPIRY_MS;
  const remainingMs = Math.max(60_000, createdAt + activeTtl - Date.now());

  return Math.ceil(remainingMs / 1000);
}

function writeCheckoutState(value) {
  writePersistentValue(
    STORAGE_KEYS.billingCheckoutState,
    JSON.stringify(value),
    resolveCookieLifetimeSeconds(value)
  );
}

function isExpired(state) {
  if (!state || typeof state !== 'object') {
    return true;
  }

  const referenceTime = Number(state.status === 'active' ? state.activatedAt : state.createdAt) || 0;
  const ttl = state.status === 'active' ? ACTIVE_EXPIRY_MS : INTENT_EXPIRY_MS;

  return !referenceTime || (Date.now() - referenceTime) > ttl;
}

export function beginBillingCheckoutIntent({ planKey, billingPeriod, entryRoute, source } = {}) {
  const nextState = {
    status: 'intent',
    planKey: normalizePlanKey(planKey),
    billingPeriod: normalizeBillingPeriod(billingPeriod),
    entryRoute: normalizeEntryRoute(entryRoute),
    source: String(source || 'pricing').trim() || 'pricing',
    createdAt: Date.now(),
    checkoutToken: `checkout_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`
  };

  writeCheckoutState(nextState);
  return nextState;
}

export function getBillingCheckoutState() {
  const state = readCheckoutState();

  if (!state || isExpired(state)) {
    clearBillingCheckoutState();
    return null;
  }

  return state;
}

export function attachBillingCheckoutToUser(user) {
  const currentState = getBillingCheckoutState();
  const userId = normalizeUserId(user);

  if (!currentState || !userId) {
    return null;
  }

  const nextState = {
    ...currentState,
    userId,
    userName: normalizeUserName(user),
    authenticatedAt: Date.now()
  };

  writeCheckoutState(nextState);
  return nextState;
}

export function billingCheckoutMatchesUser(user) {
  const currentState = getBillingCheckoutState();

  if (!currentState) {
    return false;
  }

  const checkoutUserId = String(currentState.userId || '').trim();
  const currentUserId = normalizeUserId(user);

  if (!checkoutUserId || !currentUserId) {
    return true;
  }

  return checkoutUserId === currentUserId;
}

export function activateBillingCheckoutState(user) {
  const currentState = getBillingCheckoutState();

  if (!currentState) {
    return null;
  }

  if (user && !billingCheckoutMatchesUser(user)) {
    return null;
  }

  const nextState = {
    ...(user ? attachBillingCheckoutToUser(user) || currentState : currentState),
    status: 'active',
    activatedAt: Date.now()
  };

  writeCheckoutState(nextState);
  return nextState;
}

export function clearBillingCheckoutState() {
  clearPersistentValue(STORAGE_KEYS.billingCheckoutState);
}

export function clearActiveBillingCheckoutState() {
  const currentState = getBillingCheckoutState();

  if (currentState?.status === 'active') {
    clearBillingCheckoutState();
  }
}
