import { expect, mock, test } from 'claude-code/testing'

const PANE = {
  plugin: 'puente',
  component: 'Pane',
  requestId: 'puente',
  props: {
    title: 'Puente',
    isFocused: false,
    bodyColumns: 40,
    placement: 'dock',
    scroll: { offset: 0, bodyRows: 40 },
    view: {},
  },
} as const

const RUN = {
  command: 'puente',
  origin: { kind: 'composer' },
  presentation: { isFullscreen: true, columns: 80 },
} as const

const SESSIONS = `<other-session nonce="x" untrusted="true">
Another Claude session's record (JSON).
    {"ccr":{"data":[{"id":"session_A","title":"Esta","session_status":"SESSION_STATUS_RUNNING","updated_at":"2026-01-02T00:00:00Z","status_bucket":"SESSION_STATUS_BUCKET_WORKING"},{"id":"session_B","title":"Agenda","session_status":"SESSION_STATUS_IDLE","updated_at":"2026-01-01T00:00:00Z","status_bucket":"SESSION_STATUS_BUCKET_BLOCKED"}],"has_more":false}}
</other-session nonce="x">`

const ARTIFACTS = `2 published artifacts (most recently opened or updated first):
- (mine, pinned) Tablero — https://claude.ai/artifact/AAA — updated 2026-01-01
- (mine) Plan de trabajo — https://claude.ai/artifact/BBB — updated 2026-01-02`

test('lists sessions and artifacts, and sends a message with one attached', async ($, on) => {
  const sent: unknown[] = []

  mock.clock(on)

  on('command.register', () => ({ value: { command: 'puente' } }))
  on('ui.open', () => ({ value: { isPlaced: true } }))
  on('ui.toast', () => ({ value: undefined }))
  on('session.start', (_, e) => ({ cwd: e.cwd }))
  on('tool.call', (_, e) => {
    const tool = String(e.tool)

    if (tool.endsWith('get_session')) {
      return { result: {}, text: '{"id":"session_A","title":"Esta"}' }
    }

    if (tool.endsWith('list_sessions')) {
      return { result: {}, text: SESSIONS }
    }

    if (tool === 'Artifact') {
      return { result: {}, text: ARTIFACTS }
    }

    sent.push(e)

    return { result: {}, text: 'delivered' }
  })

  await $.session.start({ cwd: '/', surface: 'desktop', isInteractive: true })
  const ran = await $.command.run({ ...RUN, args: '' })
  expect(ran.text).toBe('Puente: 2 sesiones y 2 artefactos.')

  for (const surface of ['terminal', 'desktop'] as const) {
    const ui = await $.ui.mount({ ...PANE, surface })

    expect(await ui.find({ type: 'Text', text: /esta sesión/ })).toBeDefined()
    await ui.press({ key: 's-session_B' })
    await ui.press({ key: 'a-https://claude.ai/artifact/BBB' })
    await ui.input({ key: 'message', text: 'hola' })
    expect((await ui.find({ type: 'Text', text: /Enviado/ }))?.text).toBe(
      'Enviado a «Agenda» con «Plan de trabajo».',
    )
    // The second press on the same artifact detaches it for the next surface.
    await ui.press({ key: 'a-https://claude.ai/artifact/BBB' })
    await ui.unmount()
  }

  expect(sent.length).toBe(2)
  expect(sent[0]).toMatchObject({
    session_id: 'session_B',
    message: 'hola\n\nArtefacto: Plan de trabajo — https://claude.ai/artifact/BBB',
  })
  expect(sent[1]).toMatchObject({ session_id: 'session_B' })

  const self = await $.command.run({ ...RUN, args: '1 hola' })
  expect(self.text).toMatch(/no es una sesión de destino/)
  const typed = await $.command.run({ ...RUN, args: '2 por comando' })
  expect(typed.text).toBe('Enviado a «Agenda».')
})

test('a refused tool is said, not thrown', async ($, on) => {
  on('command.register', () => ({ value: { command: 'puente' } }))
  on('ui.open', () => ({ value: { isPlaced: true } }))
  on('tool.call', () => ({ deny: 'no' }))

  const ran = await $.command.run({ ...RUN, args: '' })
  expect(ran.text).toMatch(/No pude leer sesiones: no · artefactos: no/)
})
