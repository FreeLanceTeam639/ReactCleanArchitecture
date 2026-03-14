export function extractEntity(payload, preferredKeys = []) {
  if (payload === null || payload === undefined) {
    return null;
  }

  if (typeof payload !== 'object' || Array.isArray(payload)) {
    return payload;
  }

  for (const key of preferredKeys) {
    if (payload[key] !== undefined && payload[key] !== null) {
      return payload[key];
    }
  }

  for (const key of ['data', 'item', 'result', 'payload']) {
    if (payload[key] !== undefined && payload[key] !== null) {
      return payload[key];
    }
  }

  return payload;
}
