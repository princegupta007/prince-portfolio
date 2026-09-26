"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { PALETTE_NAV } from "@/content/nav";
import { CONTACT, CV_PATH } from "@/lib/constants";
import { useToast } from "@/components/ui/Toast";
import { isReduced } from "@/hooks/useReducedMotion";

/**
 * ⌘K command palette — prototype DOM/CSS parity (dialog.cmd > .cmd-box >
 * .cmd-in + ul.cmd-list[role=listbox] > li[role=option] > button.sel).
 * Lazy: the chunk is fetched by PaletteHost on first invocation only.
 * 15 commands: 9 section jumps, 3 actions (CV / copy email / theme),
 * 3 links (GitHub / LinkedIn / mail). Filtering on label+group, ↑↓ with
 * wraparound, ↵ runs, esc/backdrop closes, native focus restore.
 */

type Cmd = { t: string; g: string; run: () => void };

function jump(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: isReduced() ? "auto" : "smooth", block: "start" });
}

export function CommandPalette({ open, onClose }: { open: boolean; onClose: () => void }) {
  const dlg = useRef<HTMLDialogElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const { show: toast } = useToast();
  const [q, setQ] = useState("");
  const [sel, setSel] = useState(0);

  const cmds: Cmd[] = useMemo(
    () => [
      ...PALETTE_NAV.map((n) => ({
        t: n.label,
        g: `${n.num} · navigate`,
        run: () => jump(n.id),
      })),
      {
        t: "Download CV (PDF)",
        g: "action",
        run: () => {
          const a = document.createElement("a");
          a.href = CV_PATH;
          a.download = "";
          document.body.appendChild(a);
          a.click();
          a.remove();
          toast("Downloading CV…");
        },
      },
      {
        t: "WhatsApp me",
        g: "action",
        run: () => {
          const a = document.createElement("a");
          a.href = CONTACT.whatsapp;
          a.target = "_blank";
          a.rel = "noopener noreferrer";
          document.body.appendChild(a);
          a.click();
          a.remove();
          toast("Opening WhatsApp…");
        },
      },
      {
        t: "Copy email address",
        g: "action",
        run: () => {
          if (navigator.clipboard?.writeText) {
            navigator.clipboard.writeText(CONTACT.email).then(
              () => toast(`Copied · ${CONTACT.email}`),
              () => toast(CONTACT.email),
            );
          } else {
            toast(CONTACT.email);
          }
        },
      },
      {
        t: "Toggle colour theme",
        g: "action",
        run: () => document.getElementById("themeBtn")?.click(),
      },
      {
        t: "Open GitHub — @princegupta007",
        g: "link",
        run: () => window.open(CONTACT.github, "_blank", "noopener"),
      },
      {
        t: "Open LinkedIn — /in/princegupta7",
        g: "link",
        run: () => window.open(CONTACT.linkedin, "_blank", "noopener"),
      },
      {
        t: `Email — ${CONTACT.email}`,
        g: "link",
        run: () => {
          window.location.href = CONTACT.emailHref;
        },
      },
    ],
    [toast],
  );

  const view = useMemo(() => {
    const s = q.trim().toLowerCase();
    return s ? cmds.filter((c) => c.t.toLowerCase().includes(s) || c.g.toLowerCase().includes(s)) : cmds;
  }, [cmds, q]);

  // open/close the native dialog; reset query each time it opens
  useEffect(() => {
    const d = dlg.current;
    if (!d) return;
    if (open && !d.open) {
      setQ("");
      setSel(0);
      d.showModal();
      const t = setTimeout(() => input.current?.focus(), 30);
      return () => clearTimeout(t);
    }
    if (!open && d.open) d.close();
    return;
  }, [open]);

  // keep the selected row in view (prototype: scrollIntoView nearest)
  useEffect(() => {
    const btn = listRef.current?.querySelectorAll("button")[sel];
    btn?.scrollIntoView({ block: "nearest" });
  }, [sel, view]);

  const icon = (g: string) => (g.includes("navigate") ? "→" : g === "action" ? "⌘" : "↗");

  const move = (d: number) => {
    if (!view.length) return;
    setSel((s) => (s + d + view.length) % view.length);
  };

  const exec = (i: number) => {
    const c = view[i];
    if (!c) return;
    onClose();
    c.run();
  };

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      move(1);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      move(-1);
    } else if (e.key === "Enter") {
      e.preventDefault();
      exec(sel);
    }
  };

  return (
    <dialog
      className="cmd"
      id="cmd"
      ref={dlg}
      aria-label="Command menu"
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClick={(e) => {
        if (e.target === dlg.current) onClose();
      }}
    >
      <div className="cmd-box">
        <div className="cmd-in">
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
          </svg>
          <input
            type="text"
            id="cmdInput"
            ref={input}
            placeholder="Jump to a section, download CV, copy email…"
            aria-label="Search commands"
            aria-controls="cmdList"
            autoComplete="off"
            spellCheck="false"
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setSel(0);
            }}
            onKeyDown={onKey}
          />
          <kbd
            style={{
              fontSize: ".6rem",
              border: "1px solid var(--line)",
              borderRadius: 5,
              padding: "3px 6px",
              fontFamily: "var(--mono)",
              color: "var(--ink-3)",
            }}
          >
            ESC
          </kbd>
        </div>
        <ul className="cmd-list" id="cmdList" role="listbox" aria-label="Commands" ref={listRef}>
          {view.length === 0 && (
            <li className="cmd-empty" role="option" aria-selected={false} aria-disabled={true}>
              No matches — try “CV”, “stack”, “email”…
            </li>
          )}
          {view.map((c, i) => (
            <li key={c.t} role="none">
              <button
                type="button"
                data-i={i}
                role="option"
                aria-selected={i === sel}
                className={i === sel ? "sel" : ""}
                onClick={() => exec(i)}
                onMouseEnter={() => setSel(i)}
              >
                <span className="ic" aria-hidden="true">
                  {icon(c.g)}
                </span>
                {c.t}
                <span className="g">{c.g}</span>
              </button>
            </li>
          ))}
        </ul>
        <div className="cmd-foot">
          <span>
            <b>↑↓</b> navigate
          </span>
          <span>
            <b>↵</b> run
          </span>
          <span>
            <b>esc</b> close
          </span>
        </div>
      </div>
    </dialog>
  );
}
