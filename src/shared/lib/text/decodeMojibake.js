const MOJIBAKE_PATTERN = /[ÃÅÄâ]/;

export function decodeMojibake(value) {
  const text = String(value ?? '');

  if (!text || !MOJIBAKE_PATTERN.test(text)) {
    return text;
  }

  try {
    const bytes = Uint8Array.from(text, (character) => character.charCodeAt(0) & 0xff);
    const decoded = new TextDecoder('utf-8').decode(bytes);

    return decoded || text;
  } catch {
    return text;
  }
}

export function decodeMojibakeList(values) {
  return Array.isArray(values)
    ? values.map((value) => decodeMojibake(value)).filter(Boolean)
    : [];
}
