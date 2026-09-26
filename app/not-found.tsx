import Link from "next/link";

const INDEX = [
  ["01", "Numbers", "#numbers"],
  ["02", "Expertise", "#expertise"],
  ["03", "Exhibit", "#exhibit"],
  ["04", "Experience", "#experience"],
  ["05", "Principles", "#principles"],
  ["06", "Stack", "#stack"],
  ["07", "Background", "#background"],
  ["08", "Contact", "#contact"],
] as const;

/** Styled 404 — design language: mono chip, outline display line, index links. */
export default function NotFound() {
  return (
    <main className="nf-wrap" id="main">
      <span className="idx mono" aria-hidden="true">
        404
      </span>
      <h1 className="nf-title">
        This route
        <br />
        <span className="nf-outline">doesn&apos;t exist.</span>
      </h1>
      <p className="nf-lede">
        The portfolio is a single page — everything lives below these links.
      </p>
      <nav className="nf-nav" aria-label="Section index">
        <ul>
          {INDEX.map(([num, label, href]) => (
            <li key={num}>
              <Link href={`/${href}`}>
                <em>{num}</em>
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <Link className="btn ghost" href="/#hero">
        Back to top
      </Link>
    </main>
  );
}
