import { HeaderNav } from "./HeaderNav";
import { HeaderShell } from "./HeaderShell";
import { MobileMenu } from "./MobileMenu";
import { ThemeToggle } from "./ThemeToggle";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { CONTACT, CV_PATH, THEME_COOKIE } from "@/lib/constants";
import { PROFILE } from "@/content/profile";
import { cookies } from "next/headers";
import type { Theme } from "@/hooks/useTheme";

/**
 * Fixed header shell (server). Client islands inside: HeaderNav (scrollspy),
 * ThemeToggle (cookie), MobileMenu (burger + overlay). The ⌘K button is a
 * plain trigger — the palette itself lazy-mounts in Phase 5.
 */
export async function Header() {
  const store = await cookies();
  const theme: Theme = store.get(THEME_COOKIE)?.value === "light" ? "light" : "dark";

  return (
    <HeaderShell>
      <div className="wrap hdr-in">
        <a className="brand" href="#hero" aria-label={`${CONTACT.name} — home`}>
          <span className="brand-mark" aria-hidden="true">
            {PROFILE.monogram}
          </span>
          <span className="brand-txt">
            <b>{CONTACT.name}</b>
            <span>{CONTACT.role}</span>
          </span>
        </a>

        <HeaderNav />

        <div className="hdr-actions">
          <button
            type="button"
            className="kbd-btn"
            data-open-cmd
            aria-haspopup="dialog"
            aria-label="Open command menu"
          >
            <Icon name="search" size={13} />
            <span className="lbl">Search</span>
            <kbd>⌘K</kbd>
          </button>

          <ThemeToggle initial={theme} />

          <Button
            href={CV_PATH}
            download
            size="sm"
            icon={<Icon name="download" size={13} />}
            aria-label="Download CV (PDF)"
          >
            <span className="cv-lbl">CV</span>
          </Button>

          <MobileMenu />
        </div>
      </div>
    </HeaderShell>
  );
}
