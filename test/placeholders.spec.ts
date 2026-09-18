import { describe, expect, it } from 'vitest';

import { escapePlaceholders } from '../src/snapshot/placeholders.ts';

/**
 * A `<placeholder>` in a specification's running text used to reach the page
 * as nothing at all. What is held here: it stays text, real HTML stays HTML,
 * and code is never touched — there the characters already are text, and an
 * entity would show as an entity.
 */
describe('a placeholder in running text', () => {
  it('stays the text it was written as', () => {
    expect(escapePlaceholders('*Rejected by <platform>* or *ends in <last four>*')).toBe(
      '*Rejected by &lt;platform&gt;* or *ends in &lt;last four&gt;*',
    );
    expect(escapePlaceholders('*<plug-in>: rewrite*')).toBe('*&lt;plug-in&gt;: rewrite*');
    expect(escapePlaceholders('between <the left version> and </stem>')).toBe('between &lt;the left version&gt; and &lt;/stem&gt;');
  });

  it('leaves real HTML to be HTML', () => {
    const html = 'one<br>two <sup>1</sup> <details><summary>more</summary>x</details> <a href="/docs/">docs</a>';
    expect(escapePlaceholders(html)).toBe(html);
  });

  it('never touches a code span, of any number of backticks', () => {
    for (const line of ['`https://<site>/docs/platforms/<platform>`', '``a ` and <stem>``', 'open `keys.<owner>.<slot>.*` there']) {
      expect(escapePlaceholders(line), line).toBe(line);
    }
    expect(escapePlaceholders('`<in>` but <out> and `<in again>`')).toBe('`<in>` but &lt;out&gt; and `<in again>`');
  });

  it('never touches a fenced block, and finds the text after it again', () => {
    const text = ['before <one>', '```json', '{"tab": "<the tab open now>"}', '```', 'after <two>', '~~~', '<three>', '~~~', '<four>'].join('\n');
    expect(escapePlaceholders(text).split('\n')).toEqual([
      'before &lt;one&gt;',
      '```json',
      '{"tab": "<the tab open now>"}',
      '```',
      'after &lt;two&gt;',
      '~~~',
      '<three>',
      '~~~',
      '&lt;four&gt;',
    ]);
  });

  it('sees a tag that closes itself', () => {
    expect(escapePlaceholders('the <platform/> of it, and a <br/> after')).toBe('the &lt;platform/&gt; of it, and a <br/> after');
  });

  it('leaves an indented code block alone, where an entity would show as an entity', () => {
    const text = ['A paragraph with <one>.', '', '    rejected by <platform>', '    and <another>', '', 'Text again, with <two>.'].join('\n');
    expect(escapePlaceholders(text).split('\n')).toEqual([
      'A paragraph with &lt;one&gt;.',
      '',
      '    rejected by <platform>',
      '    and <another>',
      '',
      'Text again, with &lt;two&gt;.',
    ]);
  });

  it('knows that four spaces inside a list are a continuation, not code', () => {
    const text = ['- an item', '', '    continued with <stem> here', '', 'A paragraph.', '', '    now <code> indeed'].join('\n');
    expect(escapePlaceholders(text).split('\n')).toEqual([
      '- an item',
      '',
      '    continued with &lt;stem&gt; here',
      '',
      'A paragraph.',
      '',
      '    now <code> indeed',
    ]);
  });

  it('does not take an indented line that follows text for code: that is a lazy continuation', () => {
    expect(escapePlaceholders('A paragraph\n    still the paragraph, with <stem>')).toBe('A paragraph\n    still the paragraph, with &lt;stem&gt;');
  });

  it('is not confused by a lone backtick, a comparison or an arrow', () => {
    for (const line of ["it's a ` alone", 'a < b and c > d', 'x -> y <- z', 'if (a<b) {}', '5 <= 6']) {
      expect(escapePlaceholders(line), line).toBe(line);
    }
  });
});
