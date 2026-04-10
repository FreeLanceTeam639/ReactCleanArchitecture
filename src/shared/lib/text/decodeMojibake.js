const MOJIBAKE_PATTERN = /[\u00c3\u00c2\u00d0\u00d1\u00e2\u00c4\u00c5\u00c6\u00c9]/;
const BYTE_DECODE_PATTERN = /[\u00c3\u00c2\u00d0\u00d1\u00e2\u00c4\u00c5\u00c6]/;

const DIRECT_REPLACEMENTS = [
  ['\u00c9\u2122', '\u0259'],
  ['\u00c6\u008f', '\u018f']
];

const CP1252_BYTE_MAP = new Map([
  [0x20ac, 0x80],
  [0x201a, 0x82],
  [0x0192, 0x83],
  [0x201e, 0x84],
  [0x2026, 0x85],
  [0x2020, 0x86],
  [0x2021, 0x87],
  [0x02c6, 0x88],
  [0x2030, 0x89],
  [0x0160, 0x8a],
  [0x2039, 0x8b],
  [0x0152, 0x8c],
  [0x017d, 0x8e],
  [0x2018, 0x91],
  [0x2019, 0x92],
  [0x201c, 0x93],
  [0x201d, 0x94],
  [0x2022, 0x95],
  [0x2013, 0x96],
  [0x2014, 0x97],
  [0x02dc, 0x98],
  [0x2122, 0x99],
  [0x0161, 0x9a],
  [0x203a, 0x9b],
  [0x0153, 0x9c],
  [0x017e, 0x9e],
  [0x0178, 0x9f]
]);

function decodeUtf8Bytes(text) {
  try {
    const bytes = Uint8Array.from(text, (character) => {
      const code = character.charCodeAt(0);
      return code <= 0xff ? code : (CP1252_BYTE_MAP.get(code) ?? (code & 0xff));
    });
    const decoded = new TextDecoder('utf-8').decode(bytes);
    return decoded || text;
  } catch {
    return text;
  }
}

function applyDirectReplacements(text) {
  let output = text;

  for (const [source, target] of DIRECT_REPLACEMENTS) {
    output = output.split(source).join(target);
  }

  return output;
}

export function decodeMojibake(value) {
  let text = String(value ?? '');

  if (!text) {
    return text;
  }

  text = applyDirectReplacements(text);

  for (let index = 0; index < 3; index += 1) {
    if (!BYTE_DECODE_PATTERN.test(text)) {
      break;
    }

    const next = decodeUtf8Bytes(text);

    if (next === text) {
      break;
    }

    text = applyDirectReplacements(next);
  }

  return MOJIBAKE_PATTERN.test(text) ? applyDirectReplacements(text) : text;
}

export function decodeMojibakeList(values) {
  return Array.isArray(values)
    ? values.map((value) => decodeMojibake(value)).filter(Boolean)
    : [];
}
