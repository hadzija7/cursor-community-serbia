/**
 * POST JSON to a webhook URL, following Google Apps Script ContentService redirects with GET.
 * Apps Script runs doPost on the initial /exec request, then 302s to a googleusercontent.com
 * URL that serves the response body — that hop accepts GET only (POST yields 405).
 */
export async function postJsonWebhook(
  url: string,
  body: unknown,
  headers: HeadersInit = {},
): Promise<Response> {
  const payload = JSON.stringify(body)
  const requestHeaders: HeadersInit = {
    'Content-Type': 'application/json',
    ...headers,
  }

  const response = await fetch(url, {
    method: 'POST',
    headers: requestHeaders,
    body: payload,
    cache: 'no-store',
    redirect: 'manual',
  })

  if (response.status >= 300 && response.status < 400) {
    const location = response.headers.get('Location')
    if (location) {
      return fetch(location, {
        method: 'GET',
        cache: 'no-store',
        redirect: 'follow',
      })
    }
  }

  return response
}

/** True when HTTP is OK and, if JSON includes `ok`, it is not explicitly false. */
export async function isWebhookSuccess(response: Response): Promise<boolean> {
  if (!response.ok) {
    return false
  }

  const contentType = response.headers.get('Content-Type') ?? ''
  if (!contentType.includes('application/json') && !contentType.includes('text/')) {
    return true
  }

  try {
    const text = await response.clone().text()
    if (!text.trim()) {
      return true
    }
    const parsed = JSON.parse(text) as { ok?: unknown }
    if (typeof parsed === 'object' && parsed !== null && 'ok' in parsed) {
      return parsed.ok !== false
    }
  } catch {
    // Non-JSON success bodies (Zapier, etc.) are fine when HTTP status is OK.
  }

  return true
}
