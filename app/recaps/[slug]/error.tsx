'use client'

import Link from 'next/link'

export default function RecapError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="min-h-screen bg-cursor-bg text-cursor-text flex flex-col items-center justify-center px-6">
      <h1 className="text-2xl font-semibold text-cursor-text mb-2">Something went wrong</h1>
      <p className="text-cursor-text-muted mb-6 text-center max-w-md">
        We couldn&apos;t load this recap. Please try again.
      </p>
      <div className="flex gap-3">
        <button
          onClick={reset}
          className="px-5 py-2.5 bg-cursor-text text-cursor-bg rounded-md hover:bg-cursor-text-muted transition-colors text-sm font-medium"
        >
          Try again
        </button>
        <Link
          href="/"
          className="px-5 py-2.5 border border-cursor-border rounded-md hover:border-cursor-border-emphasis transition-colors text-sm font-medium"
        >
          Back to home
        </Link>
      </div>
    </main>
  )
}
