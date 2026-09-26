# Release Notes — v1.0.1 (patch)

Single fix set (fix/console-hydration, develop 4eff038):
- Dev-mode console error "eval() is not supported": strict CSP was applied in
  development; script-src now widens with 'unsafe-eval' ONLY when
  NODE_ENV !== production (D41). Production policy unchanged (D39).
- Hydration-mismatch diffs (.reveal ".in", #tlFill style): downstream of the
  aborted dev hydration caused by the eval block; resolved by the same fix.
- New regression gate: `pnpm agent:dev-console`.
Validation: dev console clean (throttled + scroll), prod CSP byte-identical,
full battery green (18/18 unit, 10/10 journeys, 22/22 responsive, 11/11 SEO,
axe 0×10, P5 44/44, P6 24/24, content/links/bundle/smoke green).
