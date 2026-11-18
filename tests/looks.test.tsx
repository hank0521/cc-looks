import type { On, ThemeSetArgs } from 'claude-code'
import { expect, mock, test } from 'claude-code/testing'

// Stands in for the engine beneath the mod, and records each theme the mod sets.
function engine(on: On) {
  const sets: ThemeSetArgs[] = []
  let clears = 0
  on('command.register', (_, e) => ({ value: { command: e.name } }))
  on('theme.set', (_, e) => {
    sets.push(e as ThemeSetArgs)
    return { value: { isDrawn: true, requestId: 'look' } }
  })
  on('theme.clear', () => {
    clears += 1
    return { value: { isDrawn: false, reason: 'cleared' } }
  })
  on('session.start', (_, e) => ({ cwd: e.cwd }))

  return { sets, clears: () => clears }
}

const START = { cwd: '/', surface: 'desktop', isInteractive: true } as const

// `/look <args>` as the person types it at the prompt.
const look = (args: string) => ({
  command: 'look',
  args,
  origin: { kind: 'composer' } as const,
  presentation: { isFullscreen: false, columns: 80 },
})

test('a new session starts on the eclipse scene, with its colours', async ($, on) => {
  mock.store(on)
  const { sets } = engine(on)

  await $.session.start(START)

  expect(sets.length).toBe(1)
  expect(sets[0]?.backdrop).toEqual({ scene: 'eclipse' })
  expect(sets[0]?.colors?.label).toBe('Total eclipse')
})

test('a saved look comes back, and off stays off', async ($, on) => {
  mock.store(on, { look: 'sakura' })
  const { sets } = engine(on)
  await $.session.start(START)
  expect(sets[0]?.backdrop).toEqual({ scene: 'sakura' })

  await $.command.run(look('off'))
  await $.session.start(START)
  expect(sets.length).toBe(1)
})

test('/look switches, lists, and refuses a name it lacks', async ($, on) => {
  mock.store(on)
  const { sets, clears } = engine(on)
  await $.session.start(START)

  const jade = await $.command.run(look('Jade'))
  expect(jade.text).toBe('Look: Jade tea house')
  expect(sets.at(-1)?.backdrop).toEqual({ scene: 'jade' })

  const eclipse = await $.command.run(look('eclipse'))
  expect(eclipse.text).toBe('Look: Total eclipse')
  expect(sets.at(-1)?.backdrop).toEqual({ scene: 'eclipse' })

  const deepsea = await $.command.run(look('deepsea'))
  expect(deepsea.text).toBe('Look: Deep sea glow')
  expect(sets.at(-1)?.backdrop).toEqual({ scene: 'deepsea' })

  const survey = await $.command.run(look('survey'))
  expect(survey.text).toBe('Look: Contour survey')
  expect(sets.at(-1)?.backdrop).toEqual({ scene: 'survey' })

  const dots = await $.command.run(look('dots'))
  expect(dots.text).toBe('Look: Dotted notebook')
  expect(sets.at(-1)?.backdrop).toHaveProperty('vector')

  const list = await $.command.run(look('list'))
  expect(list.text).toMatch(/● dots/)
  expect(list.text).toMatch(/phosphor .*\(animated\)/)
  expect(list.text).toMatch(/blush .*\(still\)/)

  const nope = await $.command.run(look('neon'))
  expect(nope.text).toMatch(/no look named "neon"/)

  await $.command.run(look('off'))
  expect(clears()).toBe(1)
})

test('every scene draws as an Svg on desktop and mobile', async $ => {
  for (const scene of ['paper', 'ocean', 'jade', 'sakura', 'eclipse', 'deepsea', 'survey', 'phosphor']) {
    for (const surface of ['desktop', 'mobile'] as const) {
      const ui = await $.ui.mount({
        plugin: 'cc-looks',
        surface,
        component: 'Backdrop',
        props: { scene, plugin: 'cc-looks', glass: { blur: 16, opacity: 0.6 } },
      })
      const svg = await ui.find({ type: 'Svg' })
      expect(svg).toBeDefined()
      expect(String(svg?.props.source)).toMatch(/^<svg /)
      await ui.unmount()
    }
  }
})

test("another mod's backdrop is left alone", async $ => {
  const ui = await $.ui.mount({
    plugin: 'cc-looks',
    surface: 'desktop',
    component: 'Backdrop',
    props: { scene: 'ocean', plugin: 'someone-else', glass: false },
  })
  expect(await ui.find({ type: 'Svg' })).toBeUndefined()
  await ui.unmount()
})
