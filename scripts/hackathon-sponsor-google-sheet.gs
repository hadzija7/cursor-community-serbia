/**
 * Google Apps Script webhook for hackathon sponsorship applications.
 *
 * Setup:
 * 1. Create a Google Sheet with a tab named SHEET_NAME (default: "Applications").
 * 2. Row 1 headers (optional but recommended):
 *    submittedAt | companyName | contactName | email | website | message | source | community
 * 3. Extensions → Apps Script → paste this file → set SECRET below.
 * 4. Deploy → New deployment → Type: Web app
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 5. Set on the site (Vercel / .env.local):
 *    HACKATHON_SPONSOR_WEBHOOK_URL=https://script.google.com/macros/s/.../exec?key=YOUR_SECRET
 *
 * Do not set HACKATHON_SPONSOR_API_KEY for this path — the secret lives in the URL query param
 * (Apps Script web apps do not reliably receive custom headers like x-api-key).
 */

const SHEET_NAME = 'Applications'
/** Shared secret; must match ?key= on HACKATHON_SPONSOR_WEBHOOK_URL. Leave empty to skip auth. */
const SECRET = ''

function doPost(e) {
  try {
    if (SECRET) {
      const key = e && e.parameter && e.parameter.key
      if (key !== SECRET) {
        return jsonResponse({ ok: false, message: 'Unauthorized' })
      }
    }

    if (!e || !e.postData || !e.postData.contents) {
      return jsonResponse({ ok: false, message: 'Empty body' })
    }

    const data = JSON.parse(e.postData.contents)
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME)
    if (!sheet) {
      return jsonResponse({ ok: false, message: 'Sheet not found: ' + SHEET_NAME })
    }

    sheet.appendRow([
      data.submittedAt || new Date().toISOString(),
      data.companyName || '',
      data.contactName || '',
      data.email || '',
      data.website || '',
      data.message || '',
      data.source || '',
      data.community || '',
    ])

    return jsonResponse({ ok: true })
  } catch (err) {
    return jsonResponse({ ok: false, message: String(err) })
  }
}

function jsonResponse(body) {
  return ContentService.createTextOutput(JSON.stringify(body)).setMimeType(
    ContentService.MimeType.JSON
  )
}
