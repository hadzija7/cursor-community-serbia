import { afterEach, describe, expect, it, vi } from 'vitest'
import { isWebhookSuccess, postJsonWebhook } from '@/lib/post-webhook'

describe('postJsonWebhook', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('POSTs JSON and returns the response when there is no redirect', async () => {
    const fetchSpy = vi.spyOn(global, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
    )

    const response = await postJsonWebhook('https://example.com/hook', { a: 1 }, { 'x-api-key': 'k' })

    expect(response.status).toBe(200)
    expect(fetchSpy).toHaveBeenCalledTimes(1)
    expect(fetchSpy).toHaveBeenCalledWith(
      'https://example.com/hook',
      expect.objectContaining({
        method: 'POST',
        redirect: 'manual',
        body: JSON.stringify({ a: 1 }),
      })
    )
  })

  it('GETs Location when Apps Script returns a redirect', async () => {
    const fetchSpy = vi
      .spyOn(global, 'fetch')
      .mockResolvedValueOnce(
        new Response(null, {
          status: 302,
          headers: { Location: 'https://script.googleusercontent.com/macros/echo' },
        })
      )
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ ok: true }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        })
      )

    const response = await postJsonWebhook('https://script.google.com/macros/s/abc/exec?key=s', {
      companyName: 'Acme',
    })

    expect(response.status).toBe(200)
    expect(fetchSpy).toHaveBeenCalledTimes(2)
    expect(fetchSpy).toHaveBeenNthCalledWith(
      2,
      'https://script.googleusercontent.com/macros/echo',
      expect.objectContaining({
        method: 'GET',
        redirect: 'follow',
      })
    )
    expect(fetchSpy.mock.calls[1]?.[1]).not.toHaveProperty('body')
  })
})

describe('isWebhookSuccess', () => {
  it('returns false for non-OK HTTP status', async () => {
    await expect(isWebhookSuccess(new Response('', { status: 500 }))).resolves.toBe(false)
  })

  it('returns false when JSON body has ok: false (Apps Script)', async () => {
    const response = new Response(JSON.stringify({ ok: false, message: 'Unauthorized' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
    await expect(isWebhookSuccess(response)).resolves.toBe(false)
  })

  it('returns true for OK JSON with ok: true', async () => {
    const response = new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
    await expect(isWebhookSuccess(response)).resolves.toBe(true)
  })
})
