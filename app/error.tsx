"use client";

/**
 * Route-level error boundary (App Router). Design-language card, real retry,
 * mailto escape hatch. Console-only logging (no external service — free tier).
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="err-wrap" role="alert">
      <div className="err-card">
        <span className="idx mono" aria-hidden="true">
          ERR
        </span>
        <h2 className="err-title" tabIndex={-1}>
          Something broke on this screen.
        </h2>
        <p className="err-lede">
          The rest of the portfolio is fine — this section hit a runtime error.
          Retry once; if it persists, email me and I&apos;ll fix it fast.
        </p>
        <div className="cta-row">
          <button type="button" className="btn btn-primary" onClick={() => reset()}>
            Retry this section
          </button>
          <a className="btn ghost" href="mailto:princegupta98299@gmail.com">
            Email Prince
          </a>
        </div>
        {error.digest ? <code className="err-digest mono">{error.digest}</code> : null}
      </div>
    </div>
  );
}
