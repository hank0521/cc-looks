import type { ThemeBackdrop } from 'claude-code'

import { makeColors } from './make-colors.js'

type Palette = Parameters<typeof makeColors>[0]

export type Look = {
  /** The name /look shows. */
  label: string
  /** What the background shows, for a reader who can't see it. */
  alt: string
  /** The app's colours: surfaces, text and the five roles. */
  palette: Palette
  /**
   * What sits behind the conversation. `{ scene }` names an SVG in scenes/ (it
   * moves); `{ color }`, `{ gradient }` and `{ vector }` are still grounds that
   * need no SVG at all.
   */
  backdrop: ThemeBackdrop
}

// ---------- palettes (each checked with makeColors; none stops Desktop painting) ----------

const PAPER: Palette = {
  label: 'Paper notebook',
  roles: { accent: '#2f5d8c', danger: '#b3392f', success: '#4e7d3a', warning: '#a86f14', pro: '#6d4f94' },
  light: { gray: { anchors: { 'surface-0': '#efe6d3', 'surface-1': '#f4ecdc', 'surface-2': '#faf5e9', 'text-primary': '#2a241d', 'text-secondary': '#544a3d', 'text-muted': '#6a5f50' } } },
  dark: { gray: { anchors: { 'surface-0': '#1f1a15', 'surface-1': '#28221b', 'surface-2': '#312a22', 'surface-3': '#3a3229', 'text-primary': '#f0e7d7', 'text-secondary': '#cfc4b2', 'text-muted': '#aca08d' } } },
}

const OCEAN: Palette = {
  label: 'Midnight ocean',
  roles: { accent: '#3a8fd9', danger: '#d0473f', success: '#3f9a6b', warning: '#c98a1c', pro: '#8a63d2' },
  light: { gray: { anchors: { 'surface-0': '#e6edf3', 'surface-1': '#edf2f7', 'surface-2': '#f5f8fb', 'text-primary': '#13202d', 'text-secondary': '#3a4a5a', 'text-muted': '#56677a' } } },
  dark: { gray: { anchors: { 'surface-0': '#0b1622', 'surface-1': '#111e2c', 'surface-2': '#172636', 'surface-3': '#1d2e40', 'text-primary': '#e4edf6', 'text-secondary': '#b4c3d3', 'text-muted': '#8a9cb0' } } },
}

const JADE: Palette = {
  label: 'Jade tea house',
  roles: { accent: '#2e8b6e', danger: '#b8432f', success: '#4f8a2e', warning: '#b07a1a', pro: '#7a5a9a' },
  light: { gray: { anchors: { 'surface-0': '#e3ebe4', 'surface-1': '#eaf1ea', 'surface-2': '#f3f7f2', 'text-primary': '#1a2620', 'text-secondary': '#3e4f45', 'text-muted': '#5a6b60' } } },
  dark: { gray: { anchors: { 'surface-0': '#111a16', 'surface-1': '#17221d', 'surface-2': '#1e2b25', 'surface-3': '#24332c', 'text-primary': '#e3ede6', 'text-secondary': '#b9c9be', 'text-muted': '#91a398' } } },
}

const SAKURA: Palette = {
  label: 'Sakura',
  roles: { accent: '#c2477a', danger: '#c43a3a', success: '#4e8a4a', warning: '#b5781c', pro: '#7d55b0' },
  light: { gray: { anchors: { 'surface-0': '#f3e6ea', 'surface-1': '#f7edf0', 'surface-2': '#fbf5f7', 'text-primary': '#2b1d23', 'text-secondary': '#56404a', 'text-muted': '#6e5762' } } },
  dark: { gray: { anchors: { 'surface-0': '#1c1418', 'surface-1': '#251b20', 'surface-2': '#2e2228', 'surface-3': '#372930', 'text-primary': '#f3e6eb', 'text-secondary': '#d2bfc7', 'text-muted': '#ad97a1' } } },
}

const PHOSPHOR: Palette = {
  label: 'Phosphor terminal',
  only: 'dark',
  roles: { accent: '#33cc66', danger: '#e5534b', success: '#57d364', warning: '#e0b23a', pro: '#5fb3d9' },
  dark: { gray: { anchors: { 'surface-0': '#07100a', 'surface-1': '#0b1710', 'surface-2': '#0f1e15', 'surface-3': '#13251a', 'text-primary': '#c8f5d2', 'text-secondary': '#8fd6a2', 'text-muted': '#6fb383' } } },
}

// Mineral survey paper by day, slate at night; the accent is map-revision purple.
const SURVEY: Palette = {
  label: 'Contour survey',
  roles: { accent: '#8a3fa0', danger: '#c2413a', success: '#43a067', warning: '#b7811c', pro: '#3f7fb0' },
  light: { gray: { anchors: { 'surface-0': '#e2e8e5', 'surface-1': '#e9eeeb', 'surface-2': '#f3f6f4', 'text-primary': '#1b2622', 'text-secondary': '#3f4f49', 'text-muted': '#5b6b65' } } },
  dark: { gray: { anchors: { 'surface-0': '#0f1b22', 'surface-1': '#14222a', 'surface-2': '#182730', 'surface-3': '#1b2b34', 'text-primary': '#e1eaee', 'text-secondary': '#b3c3ca', 'text-muted': '#8a9ea6' } } },
}

// Night sky with a gold corona; by day the cool grey of a glass photographic plate.
const ECLIPSE: Palette = {
  label: 'Total eclipse',
  roles: { accent: '#d4a657', danger: '#d64b5a', success: '#46a47a', warning: '#e07a3a', pro: '#7d86e0' },
  light: { gray: { anchors: { 'surface-0': '#e4e8ee', 'surface-1': '#ebeef3', 'surface-2': '#f5f6f9', 'text-primary': '#151a26', 'text-secondary': '#3b4354', 'text-muted': '#596175' } } },
  dark: { gray: { anchors: { 'surface-0': '#070a12', 'surface-1': '#0c111c', 'surface-2': '#111725', 'surface-3': '#141b29', 'text-primary': '#eceff6', 'text-secondary': '#b9c0cf', 'text-muted': '#8b93a5' } } },
}

// Sunlit shallows by day, the abyss at night; cyan and pink from the jellyfish.
const DEEPSEA: Palette = {
  label: 'Deep sea glow',
  roles: { accent: '#3fd6c6', danger: '#e5535b', success: '#4cbf84', warning: '#e0a63e', pro: '#e86bb8' },
  light: { gray: { anchors: { 'surface-0': '#d9eef1', 'surface-1': '#e3f3f5', 'surface-2': '#f1f9fa', 'text-primary': '#0f2a30', 'text-secondary': '#33535a', 'text-muted': '#4e6e75' } } },
  dark: { gray: { anchors: { 'surface-0': '#03121a', 'surface-1': '#061922', 'surface-2': '#09202a', 'surface-3': '#0b2430', 'text-primary': '#e3f4f6', 'text-secondary': '#adcdd3', 'text-muted': '#7fa2aa' } } },
}

// ---------- the looks ----------

export const LOOKS = {
  // Animated scenes: each `scene` is the name of an SVG in scenes/.
  paper: {
    label: 'Paper notebook',
    alt: 'Ruled notebook paper with binder holes, a coffee ring and dust drifting in lamp light',
    palette: PAPER,
    backdrop: { scene: 'paper' },
  },
  ocean: {
    label: 'Midnight ocean',
    alt: 'A calm sea rolling under the moon, with stars at night and a pale sun by day',
    palette: OCEAN,
    backdrop: { scene: 'ocean' },
  },
  jade: {
    label: 'Jade tea house',
    alt: 'Misty green hills with bamboo swaying at both edges',
    palette: JADE,
    backdrop: { scene: 'jade' },
  },
  sakura: {
    label: 'Sakura',
    alt: 'Cherry blossom branches with petals drifting down',
    palette: SAKURA,
    backdrop: { scene: 'sakura' },
  },
  eclipse: {
    label: 'Total eclipse',
    alt: 'A total solar eclipse in the upper right: a soft corona round a dark moon at night, and the same eclipse as a pale photographic plate by day',
    palette: ECLIPSE,
    backdrop: { scene: 'eclipse' },
  },
  deepsea: {
    label: 'Deep sea glow',
    alt: 'Jellyfish drifting at the edges: glowing cyan and pink in the dark deep sea, translucent under sunbeams in the shallows by day',
    palette: DEEPSEA,
    backdrop: { scene: 'deepsea' },
  },
  survey: {
    label: 'Contour survey',
    alt: 'A topographic map of Yushan; a slow pulse spreads from the summit and lights each contour it crosses',
    palette: SURVEY,
    backdrop: { scene: 'survey' },
  },
  phosphor: {
    label: 'Phosphor terminal',
    alt: 'A green-on-black terminal screen with scanlines and a slow sweep',
    palette: PHOSPHOR,
    backdrop: { scene: 'phosphor', glass: { blur: 12, tint: '#07100a', opacity: 0.72 } },
  },

  // Still grounds: drawn by the app itself, no SVG and no animation.
  // Colour names like 'surface-0' follow the palette and the mode.
  dusk: {
    label: 'Dusk gradient',
    alt: 'A soft gradient from the page colour into the accent blue',
    palette: OCEAN,
    backdrop: { gradient: { stops: ['surface-2', 'surface-0', 'bg-accent'], angle: 160 } },
  },
  dots: {
    label: 'Dotted notebook',
    alt: 'A dotted grid, like a bullet journal page',
    palette: PAPER,
    backdrop: {
      vector: {
        viewBox: 24, size: [24, 24], repeat: true, color: 'border-strong',
        paths: ['M10.6 12a1.4 1.4 0 1 0 2.8 0a1.4 1.4 0 1 0 -2.8 0Z'],
      },
    },
  },
  grid: {
    label: 'Graph paper',
    alt: 'Fine square graph-paper lines',
    palette: JADE,
    backdrop: {
      vector: {
        viewBox: 32, size: [32, 32], repeat: true, color: 'border',
        paths: [{ d: 'M0 0.5H32M0.5 0V32', strokeWidth: 1 }],
      },
    },
  },
  blush: {
    label: 'Plain blush',
    alt: 'A single flat blush colour',
    palette: SAKURA,
    backdrop: { color: 'surface-1' },
  },
} satisfies Record<string, Look>

export type LookName = keyof typeof LOOKS
