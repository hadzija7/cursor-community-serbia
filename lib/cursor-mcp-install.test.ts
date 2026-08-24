import { describe, expect, it } from 'vitest'
import { cursorMcpInstallHref } from '@/lib/cursor-mcp-install'

describe('cursorMcpInstallHref', () => {
  it('uses the official cursor:// MCP install deeplink', () => {
    expect(
      cursorMcpInstallHref({
        name: 'convex',
        config: { command: 'npx -y convex@latest mcp start' },
      })
    ).toBe(
      'cursor://anysphere.cursor-deeplink/mcp/install?name=convex&config=eyJjb21tYW5kIjoibnB4IC15IGNvbnZleEBsYXRlc3QgbWNwIHN0YXJ0In0%3D'
    )
  })

  it('does not use the auto-closing install-mcp bounce page', () => {
    const href = cursorMcpInstallHref({
      name: 'exa',
      config: { url: 'https://mcp.exa.ai/mcp' },
    })

    expect(href.startsWith('cursor://')).toBe(true)
    expect(href.includes('cursor.com/en/install-mcp')).toBe(false)
  })

  it('encodes a hosted MCP URL', () => {
    const href = cursorMcpInstallHref({
      name: 'firecrawl',
      config: { url: 'https://mcp.firecrawl.dev/v2/mcp' },
    })

    expect(href.startsWith('cursor://anysphere.cursor-deeplink/mcp/install?name=firecrawl&config=')).toBe(
      true
    )
    expect(atob(new URL(href).searchParams.get('config') ?? '')).toBe(
      '{"url":"https://mcp.firecrawl.dev/v2/mcp"}'
    )
  })
})
