import type { HackathonSponsorMcp } from '@/lib/types'

export function cursorMcpInstallHref(mcp: Pick<HackathonSponsorMcp, 'name' | 'config'>): string {
  const params = new URLSearchParams({
    name: mcp.name,
    config: btoa(JSON.stringify(mcp.config)),
  })

  return `https://cursor.com/en/install-mcp?${params.toString()}`
}
