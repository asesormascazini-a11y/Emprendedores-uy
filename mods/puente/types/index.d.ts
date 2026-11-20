export type PuenteSession = {
  id: string
  title: string
  status: string
  updated: string
  isSelf: boolean
}

export type PuenteArtifact = { title: string; url: string; updated: string }

declare module 'claude-code' {
  interface PluginState {
    puente: {
      sessions: Shaped<PuenteSession[]>
      artifacts: Shaped<PuenteArtifact[]>
      target: string | null
      attach: string | null
      note: string
    }
  }
}
