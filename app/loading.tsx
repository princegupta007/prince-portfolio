/**
 * Reserved streaming shell for future routes. The single route renders
 * synchronously server-side, so this never flashes today (verified phase-10).
 */
export default function Loading() {
  return (
    <div className="load-shell" aria-hidden="true">
      <div className="load-bar" />
    </div>
  );
}
