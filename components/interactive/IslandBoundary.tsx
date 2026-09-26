"use client";

import { Component, type ReactNode } from "react";

/**
 * Island-level error boundary (phase-10): a runtime crash inside a client
 * island degrades to its STATIC variant instead of blanking content.
 * `fallback` is server-safe markup rendered on error.
 */
export class IslandBoundary extends Component<
  { fallback: ReactNode; label: string; children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error: Error) {
    // console-only by policy (no external error service on free tier)
    console.error(`[island:${this.props.label}]`, error);
  }

  render() {
    if (this.state.failed) return this.props.fallback;
    return this.props.children;
  }
}
