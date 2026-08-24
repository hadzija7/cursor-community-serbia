import type { HackathonSponsorMcp } from '@/lib/types'

function mcpInstallQuery(mcp: Pick<HackathonSponsorMcp, 'name' | 'config'>): string {
  return new URLSearchParams({
    name: mcp.name,
    config: btoa(JSON.stringify(mcp.config)),
  }).toString()
}

/**
 * Official Cursor MCP deeplink. Do not use https://cursor.com/en/install-mcp —
 * that bounce page opens a tab, fires the protocol, then window.close()s it.
 * @see https://cursor.com/docs/mcp/install-links
 */
export function cursorMcpInstallHref(mcp: Pick<HackathonSponsorMcp, 'name' | 'config'>): string {
  return `cursor://anysphere.cursor-deeplink/mcp/install?${mcpInstallQuery(mcp)}`
}
