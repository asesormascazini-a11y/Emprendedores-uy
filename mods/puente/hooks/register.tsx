import { atom, read, update } from 'claude-code'
import type { EngineInterface, Register } from 'claude-code'

import type { PuenteArtifact, PuenteSession } from '../types'

const PANE = 'puente'
const TITLE = 'Puente'
const LIST_SESSIONS = 'mcp__claude-code-remote__list_sessions'
const GET_SESSION = 'mcp__claude-code-remote__get_session'
const SEND_MESSAGE = 'mcp__claude-code-remote__send_message'
const MAX = 12

const sessions = atom({ plugin: 'puente', key: 'sessions' } as const, [], {
  shape: 'sessions-1',
})
const artifacts = atom({ plugin: 'puente', key: 'artifacts' } as const, [], {
  shape: 'artifacts-1',
})
const target = atom({ plugin: 'puente', key: 'target' } as const, null)
const attach = atom({ plugin: 'puente', key: 'attach' } as const, null)
const note = atom(
  { plugin: 'puente', key: 'note' } as const,
  'Tocá Actualizar para cargar sesiones y artefactos.',
)

const STATUS: Record<string, string> = {
  WORKING: 'trabajando',
  BLOCKED: 'espera tu respuesta',
  REVIEW_READY: 'lista para revisar',
  COMPLETED: 'terminada',
  FAILED: 'falló',
  RUNNING: 'trabajando',
  IDLE: 'en pausa',
}

type Called = { text?: string; error?: string }

// Runs a tool and reduces its answer to the text it printed, or why it did not.
async function call($: EngineInterface, input: Record<string, unknown>): Promise<Called> {
  try {
    const ran = await $.tool.call(input as Parameters<typeof $.tool.call>[0])

    if (typeof ran.deny === 'string') {
      return { error: ran.deny }
    }

    const text = typeof ran.text === 'string' ? ran.text : JSON.stringify(ran.result ?? '')

    return ran.isError ? { error: text.slice(0, 200) } : { text }
  } catch (error) {
    return { error: error instanceof Error ? error.message : String(error) }
  }
}

// The session tools wrap their JSON in a notice: take the outermost object.
function json(text: string): unknown {
  const from = text.indexOf('{')
  const to = text.lastIndexOf('}')

  if (from < 0 || to <= from) {
    return undefined
  }

  try {
    return JSON.parse(text.slice(from, to + 1))
  } catch {
    return undefined
  }
}

function field(value: unknown, key: string): unknown {
  return typeof value === 'object' && value !== null
    ? (value as Record<string, unknown>)[key]
    : undefined
}

function word(value: unknown): string {
  return typeof value === 'string' ? value : ''
}

function parseSessions(text: string, self: string): PuenteSession[] {
  const parsed = json(text)
  const data = field(field(parsed, 'ccr'), 'data') ?? field(parsed, 'data')

  if (!Array.isArray(data)) {
    return []
  }

  return data
    .map((one: unknown): PuenteSession => {
      const id = word(field(one, 'id'))
      const bucket = word(field(one, 'status_bucket')).replace('SESSION_STATUS_BUCKET_', '')
      const plain = word(field(one, 'session_status')).replace('SESSION_STATUS_', '')

      return {
        id,
        title: (word(field(one, 'title')) || 'Sin título').slice(0, 60),
        status: STATUS[bucket] ?? STATUS[plain] ?? '',
        updated: word(field(one, 'updated_at')).slice(0, 10),
        isSelf: id === self,
      }
    })
    .filter(one => one.id !== '')
    .slice(0, MAX)
}

function parseArtifacts(text: string): PuenteArtifact[] {
  const found: PuenteArtifact[] = []

  for (const line of text.split('\n')) {
    const match = /^- (?:\([^)]*\) )?(.+?) — (https:\/\/claude\.ai\/\S+)(?: — updated (\S+))?/.exec(line)

    if (match) {
      found.push({
        title: (match[1] ?? '').slice(0, 60),
        url: match[2] ?? '',
        updated: match[3] ?? '',
      })
    }
  }

  return found.slice(0, MAX)
}

async function refresh($: EngineInterface): Promise<string> {
  await update($, note, () => 'Actualizando…')

  const [own, listed, published] = await Promise.all([
    call($, { tool: GET_SESSION }),
    call($, { tool: LIST_SESSIONS, limit: MAX }),
    call($, { tool: 'Artifact', action: 'list', limit: MAX }),
  ])
  const self = word(field(json(own.text ?? ''), 'id'))
  const problems: string[] = []

  if (listed.text === undefined) {
    problems.push(`sesiones: ${listed.error ?? 'sin respuesta'}`)
  } else {
    const list = parseSessions(listed.text, self)
    await update($, sessions, () => list)
  }

  if (published.text === undefined) {
    problems.push(`artefactos: ${published.error ?? 'sin respuesta'}`)
  } else {
    const list = parseArtifacts(published.text)
    await update($, artifacts, () => list)
  }

  const said =
    problems.length > 0
      ? `No pude leer ${problems.join(' · ')}`
      : `${(await read($, sessions)).length} sesiones y ${(await read($, artifacts)).length} artefactos.`
  await update($, note, () => said)

  return said
}

async function send($: EngineInterface, typed: string): Promise<string> {
  const text = typed.trim()
  const id = await read($, target)
  const session = (await read($, sessions)).find(one => one.id === id)
  let said: string

  if (session === undefined) {
    said = 'Primero elegí la sesión de destino.'
  } else if (text === '') {
    said = 'El mensaje está vacío.'
  } else {
    const url = await read($, attach)
    const artifact = (await read($, artifacts)).find(one => one.url === url)
    const message =
      artifact === undefined ? text : `${text}\n\nArtefacto: ${artifact.title} — ${artifact.url}`
    const sent = await call($, { tool: SEND_MESSAGE, session_id: session.id, message })

    said =
      sent.text === undefined
        ? `No se envió: ${sent.error ?? 'sin respuesta'}`
        : `Enviado a «${session.title}»${artifact === undefined ? '' : ` con «${artifact.title}»`}.`
    $.ui.toast(said)
  }

  await update($, note, () => said)

  return said
}

const HELP = [
  '/puente — abre el panel y actualiza',
  '/puente <n> <mensaje> — manda el mensaje a la sesión número n',
  '/puente adjuntar <n> — adjunta el artefacto número n al próximo mensaje (0 lo quita)',
].join('\n')

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    await $.command.register({
      name: 'puente',
      description: 'Panel que conecta sesiones y artefactos',
      argumentHint: '[n mensaje | adjuntar n | ayuda]',
    })
    void $.ui.open({ id: PANE, title: TITLE })
    $.clock.after(0, () => void refresh($))

    return next(e)
  })

  on('command.run', { command: 'puente' }, async ($, e) => {
    const args = e.args.trim()

    if (args === 'ayuda') {
      return { text: HELP }
    }

    await $.ui.open({ id: PANE, title: TITLE })

    if (args === '') {
      return { text: `Puente: ${await refresh($)}` }
    }

    const pick = /^adjuntar\s+(\d+)$/.exec(args)

    if (pick) {
      const artifact = (await read($, artifacts))[Number(pick[1]) - 1]
      await update($, attach, () => artifact?.url ?? null)

      return {
        text: artifact ? `Adjunto: «${artifact.title}».` : 'Sin artefacto adjunto.',
      }
    }

    const message = /^(\d+)\s+([\s\S]+)$/.exec(args)

    if (message) {
      const session = (await read($, sessions))[Number(message[1]) - 1]

      if (session === undefined || session.isSelf) {
        return { text: 'Ese número no es una sesión de destino. Corré /puente para ver la lista.' }
      }

      await update($, target, () => session.id)

      return { text: await send($, message[2] ?? '') }
    }

    return { text: HELP }
  })

  on('ui.render', { component: 'Pane', requestId: PANE }, async ($, e) => {
    const { Box, Button, Input, Link, Text } = $.ui.resolve(e)
    const list = await read($, sessions)
    const published = await read($, artifacts)
    const to = await read($, target)
    const attached = await read($, attach)
    const chosen = list.find(one => one.id === to)

    return (
      <Box flexDirection="column">
        <Box>
          <Button key="refresh" label="Actualizar" onPress={() => void refresh($)} />
        </Box>
        <Text dimColor>{await read($, note)}</Text>

        <Text bold>Sesiones · tocá una para elegir destino</Text>
        {list.length === 0 && <Text dimColor>Ninguna cargada.</Text>}
        {list.map((one, index) =>
          one.isSelf ? (
            <Text dimColor>
              {'  '}
              {index + 1}. {one.title} (esta sesión)
            </Text>
          ) : (
            <Button
              key={`s-${one.id}`}
              plain
              onPress={() => void update($, target, () => one.id)}
            >
              {one.id === to ? '● ' : '○ '}
              {index + 1}. {one.title} <Text dimColor>{one.status}</Text>
            </Button>
          ),
        )}

        <Text bold>Artefactos · tocá uno para adjuntarlo</Text>
        {published.length === 0 && <Text dimColor>Ninguno cargado.</Text>}
        {published.map((one, index) => (
          <Box>
            <Button
              key={`a-${one.url}`}
              plain
              onPress={() =>
                void update($, attach, now => (now === one.url ? null : one.url))
              }
            >
              {one.url === attached ? '● ' : '○ '}
              {index + 1}. {one.title}
            </Button>
            <Text> </Text>
            <Link href={one.url} label="abrir" />
          </Box>
        ))}

        <Text bold>
          {chosen ? `Mensaje para «${chosen.title}»` : 'Mensaje (elegí una sesión arriba)'}
        </Text>
        <Input
          key="message"
          placeholder="Escribí y Enter para enviar"
          submitLabel="enviar"
          onSubmit={value => void send($, value)}
        />
        <Text dimColor>Sin teclado en el panel: /puente n mensaje</Text>
      </Box>
    )
  })
}
