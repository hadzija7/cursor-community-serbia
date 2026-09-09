import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import ClaimCreditsButton from '@/components/ClaimCreditsButton'
import { I18nProvider } from '@/lib/i18n'

vi.mock('next-auth/react', () => ({
  useSession: () => ({ data: { user: { email: 'hacker@example.com' } }, status: 'authenticated' }),
}))

vi.mock('@/lib/use-hacker-status', () => ({
  useHackerStatus: () => ({ lumaStatus: 'checked_in', loading: false }),
}))

describe('ClaimCreditsButton', () => {
  afterEach(() => {
    cleanup()
    vi.unstubAllGlobals()
  })

  beforeEach(() => {
    window.localStorage.clear()
  })

  it('shows Render Billing redeem tip after a successful code claim', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ code: 'RENDER-TEST-CODE' }),
      }),
    )

    render(
      <I18nProvider>
        <ClaimCreditsButton sponsorId="render" />
      </I18nProvider>,
    )

    fireEvent.click(screen.getByRole('button', { name: /claim credits/i }))

    await waitFor(() => {
      expect(screen.getByText('RENDER-TEST-CODE')).toBeInTheDocument()
    })

    expect(screen.getByRole('link', { name: /open render billing/i })).toHaveAttribute(
      'href',
      'https://dashboard.render.com/billing',
    )
    expect(
      screen.getByText(/Credit Balance → Enter promo code → Apply/i),
    ).toBeInTheDocument()
  })

  it('does not show the Render tip for other shared-code sponsors', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ code: 'DAYTONA-TEST-CODE' }),
      }),
    )

    render(
      <I18nProvider>
        <ClaimCreditsButton sponsorId="daytona" />
      </I18nProvider>,
    )

    fireEvent.click(screen.getByRole('button', { name: /claim credits/i }))

    await waitFor(() => {
      expect(screen.getByText('DAYTONA-TEST-CODE')).toBeInTheDocument()
    })

    expect(screen.queryByRole('link', { name: /open render billing/i })).not.toBeInTheDocument()
    expect(screen.getByRole('link', { name: /open daytona/i })).toBeInTheDocument()
  })
})
