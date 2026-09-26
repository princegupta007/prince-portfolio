// Phase 1 placeholder — replaced by the real page composition in Phase 3/4.
// Exists to validate fonts, tokens wiring and the build pipeline.
export default function Home() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-24">
      <p className="font-mono text-xs tracking-widest text-neutral-500 uppercase">
        Phase 1 — foundation check
      </p>
      <h1 className="mt-4 font-display text-5xl font-bold text-neutral-900">
        Portfolio scaffold is live.
      </h1>
      <p className="mt-6 text-neutral-600">
        Body copy is set in Inter. Design tokens, primitives and sections arrive
        in Phases 2–4 per{" "}
        <code className="font-mono">docs/IMPLEMENTATION-PLAN.md</code>.
      </p>
      <p className="mt-4 font-display text-2xl text-neutral-800">
        Display specimen — Bricolage Grotesque
      </p>
      <p className="mt-2 font-mono text-sm text-neutral-500">
        Mono specimen — JetBrains Mono · 0123456789 · --ease-atelier
      </p>
    </main>
  );
}
