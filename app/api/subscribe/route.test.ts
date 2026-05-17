import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { POST } from '@/app/api/subscribe/route'

const ORIGINAL_ENV = process.env

function buildRequest(email: string) {
  return new Request('http://localhost/api/subscribe', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  })
}

describe('POST /api/subscribe', () => {
  beforeEach(() => {
    process.env = { ...ORIGINAL_ENV }
    delete process.env.LUMA_BELGRADE_API_KEY
    delete process.env.LUMA_NOVI_SAD_API_KEY
    delete process.env.LUMA_IMPORT_TAG_NAMES
    vi.restoreAllMocks()
  })

  afterEach(() => {
    process.env = ORIGINAL_ENV
  })

  it('returns 400 for invalid emails', async () => {
    const response = await POST(buildRequest('not-an-email'))
    const body = (await response.json()) as { ok: boolean; message: string }

    expect(response.status).toBe(400)
    expect(body.ok).toBe(false)
    expect(body.message).toContain('valid email')
  })

  it('returns 503 when webhook URL is missing', async () => {
    delete process.env.MAILING_LIST_WEBHOOK_URL

    const response = await POST(buildRequest('person@example.com'))
    const body = (await response.json()) as { ok: boolean; message: string }

    expect(response.status).toBe(503)
    expect(body.ok).toBe(false)
  })

  it('forwards valid subscriptions to configured webhook', async () => {
    process.env.MAILING_LIST_WEBHOOK_URL = 'https://example.com/webhook'
    process.env.MAILING_LIST_API_KEY = 'secret'

    const fetchSpy = vi.spyOn(global, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
    )

    const response = await POST(buildRequest('person@example.com'))
    const body = (await response.json()) as { ok: boolean }

    expect(response.status).toBe(200)
    expect(body.ok).toBe(true)
    expect(fetchSpy).toHaveBeenCalledOnce()
    expect(fetchSpy).toHaveBeenCalledWith(
      'https://example.com/webhook',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          'Content-Type': 'application/json',
          'x-api-key': 'secret',
        }),
      })
    )
  })

  it('calls Luma import-people for both city calendars when keys are set', async () => {
    process.env.MAILING_LIST_WEBHOOK_URL = 'https://example.com/webhook'
    process.env.LUMA_BELGRADE_API_KEY = 'belgrade-secret'
    process.env.LUMA_NOVI_SAD_API_KEY = 'novisad-secret'

    const fetchSpy = vi.spyOn(global, 'fetch').mockImplementation((input) => {
      const url = typeof input === 'string' ? input : input.url
      if (url.includes('example.com/webhook')) {
        return Promise.resolve(new Response(JSON.stringify({ ok: true }), { status: 200 }))
      }
      if (url.includes('luma.com')) {
        return Promise.resolve(new Response('{}', { status: 200 }))
      }
      return Promise.reject(new Error(`unexpected fetch: ${url}`))
    })

    const response = await POST(buildRequest('person@example.com'))
    const body = (await response.json()) as { ok: boolean }

    expect(response.status).toBe(200)
    expect(body.ok).toBe(true)
    expect(fetchSpy).toHaveBeenCalledTimes(3)

    const lumaCalls = fetchSpy.mock.calls.filter((c) =>
      String(c[0]).includes('/v1/calendar/import-people'),
    )
    expect(lumaCalls).toHaveLength(2)

    const apiKeys = lumaCalls.map(
      (call) => (call[1] as RequestInit).headers as Record<string, string>,
    )
    expect(apiKeys.map((h) => h['x-luma-api-key']).sort()).toEqual([
      'belgrade-secret',
      'novisad-secret',
    ])

    for (const call of lumaCalls) {
      expect(JSON.parse((call[1] as RequestInit).body as string)).toEqual({
        infos: [{ email: 'person@example.com' }],
      })
    }
  })
})
