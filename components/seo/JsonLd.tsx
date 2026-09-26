import { CONTACT, SITE_ORIGIN } from "@/lib/constants";

/**
 * Person structured data (schema.org) — server-rendered, theme-independent.
 * Every value is CV-verbatim (agent/context/cv-source.md); no project names.
 */
const PERSON = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: CONTACT.name,
  jobTitle: CONTACT.role,
  email: CONTACT.email,
  telephone: CONTACT.phone,
  url: SITE_ORIGIN,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Jaipur",
    addressRegion: "Rajasthan",
    addressCountry: "IN",
  },
  sameAs: [CONTACT.github, CONTACT.linkedin],
  worksFor: {
    "@type": "Organization",
    name: "Konstant Infosolutions Pvt Ltd",
  },
  alumniOf: [
    { "@type": "CollegeOrUniversity", name: "JECRC University, Jaipur" },
    { "@type": "CollegeOrUniversity", name: "University of Rajasthan, Jaipur" },
  ],
  knowsAbout: [
    "React.js",
    "Next.js",
    "TypeScript",
    "JavaScript",
    "Node.js",
    "Express",
    "PostgreSQL",
    "WebSocket",
    "Role-based access control",
    "Server-side rendering",
    "Web performance",
    "Accessibility",
    "Design systems",
  ],
};

export function JsonLd() {
  return (
    <script
      type="application/ld+json"
      // stable serialisation — identical across themes/requests
      dangerouslySetInnerHTML={{ __html: JSON.stringify(PERSON) }}
    />
  );
}
