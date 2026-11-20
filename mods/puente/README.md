# Puente

Mod de Claude Code: un panel lateral que conecta sesiones y artefactos.

- Lista tus sesiones en la nube con su estado (trabajando, en pausa, espera tu respuesta).
- Lista tus artefactos publicados, con enlace para abrirlos.
- Manda un mensaje desde la sesión actual a otra sesión, con un artefacto adjunto si querés.

## Uso

El panel se abre solo al iniciar la sesión. Tocá **Actualizar**, elegí una sesión de destino, opcionalmente un artefacto, escribí el mensaje y Enter.

Donde el panel no muestra campo de texto (por ejemplo en el celular), usá el comando:

| Comando | Qué hace |
| --- | --- |
| `/puente` | Abre el panel y actualiza las listas |
| `/puente <n> <mensaje>` | Manda el mensaje a la sesión número `n` |
| `/puente adjuntar <n>` | Adjunta el artefacto número `n` al próximo mensaje (`0` lo quita) |
| `/puente ayuda` | Muestra esta ayuda |

## Requisitos

Funciona en sesiones que tienen las herramientas de sesiones remotas (`mcp__claude-code-remote__*`) y `Artifact`. Donde falta alguna, el panel lo dice en su línea de estado y sigue mostrando el resto.

Un mensaje enviado despierta a la sesión de destino y le hace correr un turno.

## Instalación

En el prompt de una sesión de terminal:

```
/plugin install puente --marketplace asesormascazini-a11y/Emprendedores-uy
```

Desde una shell:

```
claude plugin install puente --marketplace asesormascazini-a11y/Emprendedores-uy
```

En la app de escritorio: `+` junto al cuadro de texto, Plugins, Add marketplace con `asesormascazini-a11y/Emprendedores-uy`, luego Add plugin.

## Desarrollo

```
claude plugin validate mods/puente
claude plugin test mods/puente
```
