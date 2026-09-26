"use client";

/**
 * Last-resort shell: self-contained inline styles (no design-system import),
 * preserves the <html> theme attribute, one reload action.
 */
export default function GlobalError({
  error,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en" data-theme="dark">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          background: "#0a0b0d",
          color: "#f2f1ea",
          fontFamily: "ui-sans-serif, system-ui, sans-serif",
        }}
      >
        <main style={{ maxWidth: 560, padding: 32, textAlign: "center" }}>
          <p
            style={{
              fontFamily: "ui-monospace, monospace",
              letterSpacing: "0.2em",
              color: "#7b8290",
            }}
          >
            UNEXPECTED ERROR
          </p>
          <h1 style={{ fontSize: 40, lineHeight: 1.1, margin: "12px 0" }}>
            The page could not render.
          </h1>
          <p style={{ color: "#a7acb6" }}>
            A reload usually clears this. If it doesn&apos;t, email
            princegupta98299@gmail.com.
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            style={{
              marginTop: 20,
              padding: "12px 22px",
              border: 0,
              borderRadius: 999,
              background: "#cbf24c",
              color: "#0a0b0d",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Reload page
          </button>
          {error.digest ? (
            <code style={{ display: "block", marginTop: 16, color: "#7b8290" }}>
              {error.digest}
            </code>
          ) : null}
        </main>
      </body>
    </html>
  );
}
