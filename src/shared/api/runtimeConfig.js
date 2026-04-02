function getBrowserRuntimeConfig() {
  if (typeof window === 'undefined') {
    return {};
  }

  return window.__APP_CONFIG__ || {};
}

export function getRuntimeConfigValue(key) {
  const runtimeConfig = getBrowserRuntimeConfig();
  const value = runtimeConfig[key];

  return typeof value === 'string' ? value.trim() : value;
}
