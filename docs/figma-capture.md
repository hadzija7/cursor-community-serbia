# Create a new Figma file from this site (HTML → Design)

Figma’s MCP **does not create an empty canvas**. A “new file” is created by **capturing** a URL (your running site) into Figma via [html-to-design](https://www.figma.com/developers/html-to-design).

## Prerequisites

- Figma MCP connected in Cursor (same account that should own the file).
- This repo’s dev server.

## One-time setup (already in the codebase)

`app/layout.tsx` loads the capture script only when:

```bash
NEXT_PUBLIC_FIGMA_CAPTURE=1 pnpm dev
```

Do not commit `NEXT_PUBLIC_FIGMA_CAPTURE=1` in `.env.local` long term—use it only for capture sessions.

## Steps

1. **Start dev with capture enabled**

   ```bash
   NEXT_PUBLIC_FIGMA_CAPTURE=1 pnpm dev
   ```

2. **Request a new file from the agent** (or Figma MCP `generate_figma_design` with `outputMode: newFile` and a `fileName`). You get a **capture ID** and a URL pattern.

3. **Open the capture URL** in Chrome/Edge (must match the host where the script runs, usually):

   `http://localhost:3000/#figmacapture=<CAPTURE_ID>&figmaendpoint=<ENCODED_ENDPOINT>&figmadelay=1000`

   The agent or MCP response includes the exact link. Wait for the page to finish loading so the capture can run.

4. **Poll until complete** — the MCP returns a Figma **file URL** / `file_key` when status is `completed`.

5. **Turn off capture** — stop using `NEXT_PUBLIC_FIGMA_CAPTURE=1` for normal development.

## Troubleshooting

- **Poll stays `pending` forever** — The capture script is not on the page. Restart `next dev` with `NEXT_PUBLIC_FIGMA_CAPTURE=1`, then open the capture URL again (hard refresh). Only one `next dev` instance should hold the `.next/dev/lock`.
- **Wrong port** — If Next prints “using port 3002”, use `http://localhost:3002/...` in the capture URL instead of `3000`.
- **Stale capture ID** — If a session was abandoned, ask the agent (or MCP) for a **new** `newFile` capture and use the new hash URL.

## Empty file instead?

If you only need a **blank** Figma file: in Figma, **File → New design file**. The MCP flow above is for **importing** the live site as a starting layout.

## Related

- Agent rules: `.cursor/rules/figma-design-system.mdc`
- Tokens & patterns: `docs/design-system.md`
