/**
 * Reads JSON with comments and trailing commas, which is what Wrangler's
 * configuration is. A scanner rather than a pair of regular expressions: a
 * `//` inside a string is not a comment.
 */
export function parseJsonc(text: string): unknown {
  let out = '';
  let index = 0;
  while (index < text.length) {
    const char = text[index] ?? '';
    const next = text[index + 1] ?? '';
    if (char === '"') {
      const start = index;
      index += 1;
      while (index < text.length && text[index] !== '"') index += text[index] === '\\' ? 2 : 1;
      index += 1;
      out += text.slice(start, index);
    } else if (char === '/' && next === '/') {
      while (index < text.length && text[index] !== '\n') index += 1;
    } else if (char === '/' && next === '*') {
      const end = text.indexOf('*/', index + 2);
      index = end === -1 ? text.length : end + 2;
    } else {
      out += char;
      index += 1;
    }
  }
  return JSON.parse(out.replace(/,(\s*[}\]])/g, '$1'));
}
