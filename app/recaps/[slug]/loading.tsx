export default function RecapLoading() {
  return (
    <main className="min-h-screen bg-cursor-bg text-cursor-text">
      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="bg-[#1B1913] border border-cursor-border rounded-lg p-8 animate-pulse">
          <div className="h-7 bg-cursor-border rounded w-2/3 mb-4" />
          <div className="h-4 bg-cursor-border rounded w-1/4 mb-6" />
          <div className="space-y-3 mb-6">
            <div className="h-4 bg-cursor-border rounded" />
            <div className="h-4 bg-cursor-border rounded" />
            <div className="h-4 bg-cursor-border rounded w-5/6" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="aspect-square bg-cursor-border rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
