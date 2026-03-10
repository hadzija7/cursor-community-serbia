import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, beforeEach, afterEach } from 'vitest'
import { I18nProvider, useI18n } from '@/lib/i18n'

function I18nProbe() {
  const { t, setLocale } = useI18n()

  return (
    <>
      <p>{t('footer.madeWith')}</p>
      <p>{t('does.not.exist')}</p>
      <button onClick={() => setLocale('en')}>Set locale</button>
    </>
  )
}

describe('i18n', () => {
  afterEach(() => {
    cleanup()
  })

  beforeEach(() => {
    window.localStorage.clear()
  })

  it('translates known keys and falls back to key for unknown ones', () => {
    render(
      <I18nProvider>
        <I18nProbe />
      </I18nProvider>
    )

    expect(screen.getByText('Made with Cursor by ambassadors worldwide')).toBeInTheDocument()
    expect(screen.getByText('does.not.exist')).toBeInTheDocument()
  })

  it('persists locale selection in localStorage', () => {
    render(
      <I18nProvider>
        <I18nProbe />
      </I18nProvider>
    )

    fireEvent.click(screen.getByRole('button', { name: 'Set locale' }))
    expect(window.localStorage.getItem('locale')).toBe('en')
  })
})
