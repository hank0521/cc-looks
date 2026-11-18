import type { EngineInterface, Register, ThemeResult } from 'claude-code'

import { LOOKS, type LookName } from './looks'
import { makeColors } from './make-colors.js'
import { SCENE_SVG } from './scenes'

/** The look a new session starts with until /look picks another. */
const DEFAULT: LookName = 'eclipse'
const STORE_KEY = 'look'

const NAMES = Object.keys(LOOKS) as LookName[]
const isLook = (name: unknown): name is LookName =>
  typeof name === 'string' && Object.hasOwn(LOOKS, name)

async function apply($: EngineInterface, name: LookName): Promise<ThemeResult> {
  const look = LOOKS[name]
  const { theme, problems } = makeColors(look.palette)
  const blocked = problems.find(line => line.startsWith("Desktop won't paint"))
  if (blocked !== undefined) {
    $.ui.toast(blocked)
  }

  return $.theme.set({ colors: theme, backdrop: look.backdrop })
}

function listing(current: string): string {
  const rows = NAMES.map(name => {
    const look = LOOKS[name]
    const kind = 'scene' in look.backdrop ? 'animated' : 'still'
    return `${name === current ? '●' : '○'} ${name.padEnd(9)} ${look.label} (${kind})`
  })
  return [...rows, '', 'Use /look <name>, or /look off for the app’s own look.'].join('\n')
}

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    await $.command.register({
      name: 'look',
      description: 'Switch the background and colours: /look <name>, /look list, /look off',
    })
    const saved = await $.store.get(STORE_KEY)
    if (saved !== 'off') {
      const set = await apply($, isLook(saved) ? saved : DEFAULT)
      if (!set.isDrawn) {
        $.ui.status(`cc-looks: ${set.reason}`)
      }
    }

    return next(e)
  })

  on('command.run', { command: 'look' }, async ($, e) => {
    const arg = e.args.trim().toLowerCase()
    const saved = await $.store.get(STORE_KEY)
    const current = typeof saved === 'string' ? saved : DEFAULT

    if (arg === '' || arg === 'list') {
      return { text: listing(current) }
    }
    if (arg === 'off') {
      await $.theme.clear()
      await $.store.set(STORE_KEY, 'off')
      return { text: 'Back to the app’s own look.' }
    }
    if (!isLook(arg)) {
      return { text: `There's no look named "${arg}". Try one of: ${NAMES.join(', ')}` }
    }

    const set = await apply($, arg)
    await $.store.set(STORE_KEY, arg)
    $.ui.status(undefined)

    return {
      text: set.isDrawn
        ? `Look: ${LOOKS[arg].label}`
        : `Saved ${LOOKS[arg].label}. It shows in the desktop and mobile apps (${set.reason}).`,
    }
  })

  // Draws the animated scenes. Still grounds need no hook: the app draws them.
  on('ui.render', { component: 'Backdrop' }, ($, e, next) => {
    if (e.props.plugin !== $.plugin.name) {
      return next(e)
    }
    if (e.surface !== 'desktop' && e.surface !== 'mobile') {
      return next(e)
    }
    const svg = SCENE_SVG[e.props.scene]
    if (svg === undefined) {
      return next(e)
    }
    const alt = isLook(e.props.scene) ? LOOKS[e.props.scene].alt : 'A background scene'
    const { Svg } = $.ui.resolve(e)

    return <Svg source={svg} alt={alt} isInteractive />
  })
}
