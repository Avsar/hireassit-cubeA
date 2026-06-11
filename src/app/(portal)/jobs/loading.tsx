export default function JobsLoading() {
  return (
    <main className="min-h-screen bg-neutral-50">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-[260px,1fr]">
          <aside>
            <div className="h-80 animate-pulse rounded-2xl border border-neutral-200 bg-white" />
          </aside>
          <div className="space-y-4">
            <div className="h-7 w-64 animate-pulse rounded-lg bg-neutral-200" />
            <div className="grid gap-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="animate-pulse rounded-2xl border border-neutral-200 bg-white p-5"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-neutral-200" />
                    <div className="space-y-2">
                      <div className="h-3 w-32 rounded bg-neutral-200" />
                      <div className="h-4 w-56 rounded bg-neutral-200" />
                    </div>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <div className="h-5 w-20 rounded-full bg-neutral-100" />
                    <div className="h-5 w-24 rounded-full bg-neutral-100" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
