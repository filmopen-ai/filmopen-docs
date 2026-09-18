/**
 * Keeps a placeholder a placeholder.
 *
 * The specifications write `<platform>`, `<last four>`, `<plug-in>` for a
 * value to be filled in — mostly inside code, where Markdown leaves them
 * alone, and a few times in running text, where Markdown reads them as HTML.
 * An element no browser knows renders as nothing, so *Rejected by
 * <platform>* reached the page as *Rejected by*, and said something its
 * authors did not write.
 *
 * A snapshot is never edited, so this is put right where the page is derived
 * from it (`scripts/generate.ts`): outside code, a tag whose name is not an
 * element of HTML is written with `&lt;` and `&gt;`, which is how Markdown
 * says "these characters, as text". Real HTML — a `<br>`, a `<sup>`, a
 * `<details>` — is left to be HTML, and code is left alone entirely — fenced,
 * in backticks, or indented — since there the characters already are text and
 * an entity would show as an entity.
 *
 * Indented code is the one Markdown construct this can only judge, not know:
 * four spaces are a code block after a blank line and a continuation inside a
 * list. So it follows Markdown's own rule as far as a line-by-line reading
 * can — indented, after a blank line, and not in a list — and
 * `test/site.spec.ts` is the backstop on the built pages for both mistakes it
 * could make: an element no browser knows, and an entity shown as itself.
 */

const ELEMENTS = new Set(
  (
    'a abbr address area article aside audio b base bdi bdo blockquote body br button canvas caption cite code col ' +
    'colgroup data datalist dd del details dfn dialog div dl dt em embed fieldset figcaption figure footer form h1 h2 ' +
    'h3 h4 h5 h6 head header hgroup hr html i iframe img input ins kbd label legend li link main map mark menu meta ' +
    'meter nav noscript object ol optgroup option output p picture pre progress q rp rt ruby s samp script search ' +
    'section select slot small source span strong style sub summary sup table tbody td template textarea tfoot th ' +
    'thead time title tr track u ul var video wbr'
  ).split(' '),
);

/** `<name …>`, `</name>` or `<name/>`: what Markdown would take for a tag. */
const TAG = /<(\/?)([A-Za-z][A-Za-z0-9-]*)((?:\s[^<>]*)?)\/?>/g;

function escapeText(text: string): string {
  return text.replace(TAG, (whole, _slash: string, name: string) =>
    ELEMENTS.has(name.toLowerCase()) ? whole : whole.replace('<', '&lt;').replace(/>$/, '&gt;'),
  );
}

/** One line, outside a fence: everything but its code spans. */
function escapeLine(line: string): string {
  let out = '';
  let index = 0;
  while (index < line.length) {
    const tick = line.indexOf('`', index);
    if (tick === -1) break;
    let run = tick;
    while (line[run] === '`') run += 1;
    const fence = line.slice(tick, run);
    // A code span closes at the next run of exactly as many backticks.
    let close = line.indexOf(fence, run);
    while (close !== -1 && (line[close + fence.length] === '`' || line[close - 1] === '`')) {
      close = line.indexOf(fence, close + 1);
    }
    if (close === -1) break;
    out += escapeText(line.slice(index, tick)) + line.slice(tick, close + fence.length);
    index = close + fence.length;
  }
  return out + escapeText(line.slice(index));
}

export function escapePlaceholders(markdown: string): string {
  let fence: string | null = null;
  // For indented code: whether the line before was blank (or itself indented
  // code), and whether a list is open, in which four spaces are a continuation.
  let afterBlank = true;
  let inIndentedCode = false;
  let inList = false;
  return markdown
    .split('\n')
    .map((line) => {
      const opening = /^ {0,3}(`{3,}|~{3,})/.exec(line)?.[1];
      if (fence === null) {
        if (opening !== undefined) {
          fence = opening;
          afterBlank = false;
          inIndentedCode = false;
          return line;
        }
        const blank = line.trim() === '';
        const indented = /^( {4,}|\t)/.test(line);
        if (!blank && !indented) inList = /^ {0,3}([-*+]|\d{1,9}[.)])\s/.test(line);
        inIndentedCode = !blank && indented && !inList && (afterBlank || inIndentedCode);
        afterBlank = blank || (afterBlank && inIndentedCode);
        if (blank) return line;
        if (inIndentedCode) return line;
        afterBlank = false;
        return escapeLine(line);
      }
      // Closed by a run of the same character, at least as long.
      if (opening !== undefined && opening.startsWith(fence.charAt(0)) && opening.length >= fence.length && line.trim() === opening) {
        fence = null;
      }
      return line;
    })
    .join('\n');
}
