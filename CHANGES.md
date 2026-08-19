# VFS Platform fork changes

This repository is a modified fork of `logdyhq/logdy-ui`.

## 0.18.5 (2026-08-19)

- Expand hovered filter and facet sections to show approximately five additional rows.

## 0.18.4 (2026-08-19)

- Show compact Origins labels ending with the parent directory and log filename while retaining the complete path as a tooltip.

## 0.18.3 (2026-08-19)

- Restore visible Next and Prev buttons in the log detail drawer while retaining keyboard navigation.

## 0.18.2 (2026-08-19)

- Reload authenticated status after login so protected backend configuration is available only to an authenticated session.

## 0.18.1 (2026-08-19)

- Added Apache-2.0 modification notices and documented fork provenance.
- Retained the original Apache-2.0 license.

## Earlier VFS modifications

- Replaced password query parameters and browser password storage with same-origin sessions.
- Added same-origin credentials and prefix-safe API, WebSocket, and WASM paths.
- Prevented imported and browser-stored layouts from executing code or injecting HTML.
- Kept server-provided layouts as the explicit trusted configuration source.
- Added production build and security checks in CI.
