import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { POST } from '@/app/api/hackathon/sponsor/route'
import * as db from '@/lib/db'

const ORIGINAL_ENV = process.env

function buildRequest(body: Record<string, string | undefined>) {
  return new Request('http://localhost/api/hackathon/sponsor', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

describe('POST /api/hackathon/sponsor', () => {
  beforeEach(() => {
    process.env = { ...ORIGINAL_ENV }
    delete process.env.POSTGRES_URL
    delete process.env.DATABASE_URL
    vi.restoreAllMocks()
  })

  afterEach(() => {
    process.env = ORIGINAL_ENV
  })

  it('returns 400 for invalid emails', async () => {
    const response = await POST(
      buildRequest({
        companyName: 'Acme',
        contactName: 'Jane',
        email: 'not-an-email',
      })
    )
    const body = (await response.json()) as { ok: boolean; message: string }

    expect(response.status).toBe(400)
    expect(body.ok).toBe(false)
    expect(body.message).toContain('valid email')
  })

  it('returns 400 when required fields are missing', async () => {
    const response = await POST(
      buildRequest({
        email: 'person@example.com',
      })
    )
    const body = (await response.json()) as { ok: boolean; message: string }

    expect(response.status).toBe(400)
    expect(body.ok).toBe(false)
  })

  it('returns 503 when no backend is configured', async () => {
    delete process.env.HACKATHON_SPONSOR_WEBHOOK_URL
    delete process.env.MAILING_LIST_WEBHOOK_URL

    const response = await POST(
      buildRequest({
        companyName: 'Acme',
        contactName: 'Jane',
        email: 'person@example.com',
      })
    )
    const body = (await response.json()) as { ok: boolean; message: string }

    expect(response.status).toBe(503)
    expect(body.ok).toBe(false)
  })

  it('forwards valid applications to configured webhook', async () => {
    process.env.HACKATHON_SPONSOR_WEBHOOK_URL = 'https://example.com/hackathon-webhook'
    process.env.HACKATHON_SPONSOR_API_KEY = 'secret'

    const fetchSpy = vi.spyOn(global, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
    )

    const response = await POST(
      buildRequest({
        companyName: 'Acme',
        contactName: 'Jane Doe',
        email: 'person@example.com',
        website: 'https://acme.example',
        message: 'Interested in gold tier',
      })
    )
    const body = (await response.json()) as { ok: boolean }

    expect(response.status).toBe(200)
    expect(body.ok).toBe(true)
    expect(fetchSpy).toHaveBeenCalledWith(
      'https://example.com/hackathon-webhook',
      expect.objectContaining({
        method: 'POST',
        redirect: 'manual',
        headers: expect.objectContaining({
          'Content-Type': 'application/json',
          'x-api-key': 'secret',
        }),
      })
    )
  })

  it('falls back to webhook when Postgres insert fails', async () => {
    process.env.HACKATHON_SPONSOR_WEBHOOK_URL = 'https://example.com/hackathon-webhook'

    const failingDb = Object.assign(
      async () => {
        throw new Error('relation "hackathon_sponsor_applications" does not exist')
      },
      { query: async () => undefined, transaction: async () => undefined }
    )
    vi.spyOn(db, 'getDb').mockReturnValue(failingDb as ReturnType<typeof db.getDb>)

    const fetchSpy = vi.spyOn(global, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
    )

    const response = await POST(
      buildRequest({
        companyName: 'Acme',
        contactName: 'Jane',
        email: 'person@example.com',
      })
    )
    const body = (await response.json()) as { ok: boolean }

    expect(response.status).toBe(200)
    expect(body.ok).toBe(true)
    expect(fetchSpy).toHaveBeenCalled()
  })
})
