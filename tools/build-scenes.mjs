// Checks every scenes/*.svg against the rules Claude Code holds a backdrop to,
// then writes hooks/scenes.ts (what the mod draws) and preview.html (to look at,
// every scene in light and dark mode, in one file that opens in any browser).
//
//   node tools/build-scenes.mjs
//
// Run it again after you edit or add an SVG in scenes/.
import { readFileSync, readdirSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const scenesDir = join(root, 'scenes')

const DARK = '@media (prefers-color-scheme: dark){'

/** What the engine refuses in a Backdrop's Svg, as plain lines. */
function check(svg) {
  const bad = []
  if (svg.length > 131072) bad.push(`is ${svg.length} characters; the limit is 131072`)
  const banned = ['data:', 'base64', '<image', 'feImage', 'foreignObject', '@font-face', '@import',
    'image-set(', 'src(', 'cross-fade(', '<?', '<!DOCTYPE', '<!ENTITY', 'CDATA']
  for (const word of banned) if (svg.includes(word)) bad.push(`holds "${word}"`)
  // href is allowed only as an attribute pointing at a local #fragment
  const outsideHrefs = svg.replace(/\s(?:xlink:)?href="#[\w-]+"/g, '')
  if (outsideHrefs.includes('href')) bad.push('holds an href that is not a local #fragment')
  for (const m of svg.matchAll(/url\(([^)]*)\)/g)) if (!m[1].startsWith('#')) bad.push(`url(${m[1]}) is not a local #fragment`)
  if (svg.includes('\\')) bad.push('holds a backslash')
  for (const m of svg.matchAll(/&(?!amp;|lt;|gt;|quot;|apos;)/g)) bad.push(`bare or unknown character reference at ${m.index}`)
  if (/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/.test(svg)) bad.push('holds a control character')
  for (const m of svg.matchAll(/<!--([\s\S]*?)-->/g)) if (m[1].includes('--') || m[1].includes('<')) bad.push(`comment "${m[1].trim()}" holds -- or <`)
  const styles = [...svg.matchAll(/<style>([\s\S]*?)<\/style>/g)]
  if ((svg.match(/<style/g) ?? []).length !== styles.length) bad.push('a <style> has no end tag')
  for (const [, css] of styles) {
    if (css.includes('<')) bad.push('an element or < inside <style>')
    for (const c of css.matchAll(/\/\*([\s\S]*?)\*\//g)) if (/[(@]/.test(c[1])) bad.push(`CSS comment "${c[1].trim()}" holds ( or @`)
  }
  for (const tag of svg.matchAll(/<[a-zA-Z][^>]*>/g)) {
    const body = tag[0].replace(/^<[\w:-]+/, '').replace(/\/?>$/, '').replace(/\s*[\w:-]+="[^"<>]*"/g, '').trim()
    if (body !== '') bad.push(`tag ${tag[0].slice(0, 40)} has an attribute with no value, or < or > in a value`)
  }
  return bad
}

/** The block of CSS between `@media ... dark{` and its closing brace. */
function darkBlock(svg) {
  const at = svg.indexOf(DARK)
  if (at < 0) return null
  let depth = 1, i = at + DARK.length
  for (; i < svg.length && depth > 0; i++) depth += svg[i] === '{' ? 1 : svg[i] === '}' ? -1 : 0
  return { start: at, end: i, inner: svg.slice(at + DARK.length, i - 1) }
}

const names = readdirSync(scenesDir).filter(n => n.endsWith('.svg')).sort()
const entries = []
let failed = false
for (const file of names) {
  const name = file.replace(/\.svg$/, '')
  const svg = readFileSync(join(scenesDir, file), 'utf8').trim()
  const problems = check(svg)
  if (problems.length > 0) {
    failed = true
    console.log(`${file}: refused`)
    for (const p of problems) console.log(`  - ${p}`)
    continue
  }
  console.log(`${file}: ok (${svg.length} characters)`)
  entries.push([name, svg])
}

if (failed) {
  console.log('\nFix the lines above; hooks/scenes.ts was not written.')
  process.exit(1)
}

const ts = `// Written by tools/build-scenes.mjs from scenes/*.svg. Edit the SVGs, then run it again.\n\n` +
  `export const SCENE_SVG: Record<string, string> = {\n` +
  entries.map(([name, svg]) => `  ${JSON.stringify(name)}: ${JSON.stringify(svg)},`).join('\n') +
  `\n}\n`
writeFileSync(join(root, 'hooks', 'scenes.ts'), ts)
console.log(`\nWrote hooks/scenes.ts with ${entries.length} scenes.`)

// The preview pins each mode: light drops the dark block, dark keeps its rules unconditionally.
const cards = entries.map(([name, svg]) => {
  const block = darkBlock(svg)
  const img = (markup, caption) =>
    `<figure><img src="data:image/svg+xml;charset=utf-8,${encodeURIComponent(markup)}" alt="${name}, ${caption}"><figcaption>${caption}</figcaption></figure>`
  const figures = block
    ? img(svg.slice(0, block.start) + svg.slice(block.end), 'light mode') +
      img(svg.slice(0, block.start) + block.inner + svg.slice(block.end), 'dark mode')
    : img(svg, 'one look for both modes')
  return `<section><h2>${name}</h2><div class="pair">${figures}</div></section>`
}).join('\n')
writeFileSync(join(root, 'preview.html'), `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>cc-looks backgrounds</title>
<style>
:root{color-scheme:light;--bg:#f6f5f2;--fg:#1d1d1b;--muted:#6b6a65}
body{margin:0;padding:24px 16px;background:var(--bg);color:var(--fg);font:15px/1.5 system-ui,sans-serif}
h1{font-size:22px;font-weight:500;margin:0 0 4px}
p{color:var(--muted);margin:0 0 24px}
section{margin:0 0 28px}
h2{font-size:16px;font-weight:500;margin:0 0 8px;text-transform:capitalize}
.pair{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:12px}
figure{margin:0}
img{width:100%;aspect-ratio:16/10;object-fit:cover;border-radius:10px;display:block;border:1px solid #0001}
figcaption{font-size:12px;color:var(--muted);margin-top:4px}
</style></head><body>
<h1>cc-looks backgrounds</h1>
<p>Every scene in scenes/, in light and dark mode. They move here as they will behind the conversation.</p>
${cards}
</body></html>
`)
console.log('Wrote preview.html')
