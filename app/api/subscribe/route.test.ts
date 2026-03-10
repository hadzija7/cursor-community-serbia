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
})
