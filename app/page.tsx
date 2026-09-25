/**
 * Phase 3 placeholder page — real shell (header/rail/footer/menu) is live;
 * sections replace this file in Phase 4 (scrollspy targets arrive with them).
 */
export default function Home() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-24">
      <p className="font-mono text-xs tracking-widest text-ink-3 uppercase">
        Phase 3 — global layout live
      </p>
      <h1 className="mt-4 font-display text-5xl font-bold text-ink">
        Shell complete: header, rail, menu, footer.
      </h1>
      <p className="mt-6 text-ink-2">
        Scroll to see the stuck header, progress bar and scrollspy settle in.
        Sections land in Phase 4 per <code className="font-mono">docs/IMPLEMENTATION-PLAN.md</code>.
      </p>
      <div className="mt-10 h-[160vh]" aria-hidden="true" />
    </div>
  );
}
