# Stress Check

Private 15-question reflection and local 7-day action plan for DopaBrain.

## Contract

- Fixed DopaBrain display rule; not a validated clinical scale, diagnosis, treatment, or population comparison.
- Answers, totals, categories, and result bands are not sent to analytics or URLs.
- Linked entry accepts only allowlisted `start=1&surface=...` routes.
- Auto Ads uses one publisher loader; no manual ad units or synthetic paid-impression events.
- Result actions are limited to the private 7-day plan, retry, HSP reflection, and stress-response reflection.
- The plan action is measured only after a continuous 50% / 500 ms qualified view; double starts and plan clicks are deduplicated.
- The service worker caches only successful same-origin GET requests inside `/stress-check/`.
- Twelve locale bundles expose the same privacy and trust boundary.

## Verify

Run the root `verify:stress-core`, `verify:stress-plan`, and full harness before release.
