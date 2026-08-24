import { describe, expect, it } from 'vitest'
import { cursorMcpInstallHref } from '@/lib/cursor-mcp-install'

describe('cursorMcpInstallHref', () => {
  it('matches Convex’s published install-mcp link', () => {
    expect(
      cursorMcpInstallHref({
        name: 'convex',
        config: { command: 'npx -y convex@latest mcp start' },
      })
    ).toBe('https://cursor.com/en/install-mcp?name=convex&config=eyJjb21tYW5kIjoibnB4IC15IGNvbnZleEBsYXRlc3QgbWNwIHN0YXJ0In0%3D')
  })

  it('encodes a hosted MCP URL', () => {
    const href = cursorMcpInstallHref({
      name: 'firecrawl',
      config: { url: 'https://mcp.firecrawl.dev/v2/mcp' },
    })

    expect(href.startsWith('https://cursor.com/en/install-mcp?name=firecrawl&config=')).toBe(true)
    expect(atob(new URL(href).searchParams.get('config') ?? '')).toBe(
      '{"url":"https://mcp.firecrawl.dev/v2/mcp"}'
    )
  })
})
