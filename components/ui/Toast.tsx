"use client";

import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
} from "react";
import type { ReactNode } from "react";

/**
 * Single toast host (rule 40: the ONLY aria-live region for transient messages).
 * Phase 5: enter/exit animation — the message mounts, `.on` plays the CSS
 * transition in, and unmount is delayed until the exit transition finishes.
 */
type ToastContextValue = { show: (message: string) => void };

const ToastContext = createContext<ToastContextValue | null>(null);

const HOLD = 2600;
const EXIT = 320;

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside <ToastProvider>");
  return ctx;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [message, setMessage] = useState<string | null>(null);
  const [on, setOn] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const show = useCallback((msg: string) => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setMessage(msg);
    // mount first, then transition in on the next frame
    requestAnimationFrame(() => requestAnimationFrame(() => setOn(true)));
    timers.current.push(
      setTimeout(() => setOn(false), HOLD),
      setTimeout(() => setMessage(null), HOLD + EXIT),
    );
  }, []);

  return (
    <ToastContext.Provider value={{ show }}>
      {children}
      <div className="toast-host" role="status" aria-live="polite">
        {message && <div className={on ? "toast on" : "toast"}>{message}</div>}
      </div>
    </ToastContext.Provider>
  );
}
