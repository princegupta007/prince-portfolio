import { BackToTop } from "./BackToTop";
import { Icon } from "@/components/ui/Icon";
import { INDEX_ITEMS } from "@/content/nav";
import { CONTACT } from "@/lib/constants";
import { PROFILE } from "@/content/profile";

/** Server footer: brand col + section index + socials + back-to-top + colophon. */
export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer>
      <div className="wrap">
        <div className="foot">
          <div className="f-brand">
            <span className="brand-mark" aria-hidden="true">
              {PROFILE.monogram}
            </span>
            <p>
              <b>{CONTACT.name}</b> — {CONTACT.role}
              <br />
              {CONTACT.location}
              <br />
              {PROFILE.skillLine}
            </p>
          </div>

          <nav className="f-nav" aria-label="Section index">
            <ul>
              {INDEX_ITEMS.map((item) => (
                <li key={item.id}>
                  <a href={`#${item.id}`}>
                    <em>{item.num}</em>
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="f-side">
            <div className="f-social">
              <a
                href={CONTACT.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
              >
                <Icon name="github" size={16} />
              </a>
              <a
                href={CONTACT.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
              >
                <Icon name="linkedin" size={16} />
              </a>
              <a href={CONTACT.emailHref} aria-label="Email">
                <Icon name="mail" size={16} />
              </a>
            </div>
            <BackToTop />
          </div>
        </div>

        <div className="foot-btm">
          <span>
            © {year} {CONTACT.name} · {CONTACT.role}
          </span>
          <span className="sig">
            <i aria-hidden="true" />
            {PROFILE.colophon}
          </span>
        </div>
      </div>
    </footer>
  );
}
