# Stress Check

Private 15-question reflection and local 7-day action plan for DopaBrain.

## Contract

- Fixed DopaBrain display rule; not a validated clinical scale, diagnosis, treatment, or population comparison.
- Answers, totals, categories, and result bands are not sent to analytics or URLs.
- Linked entry accepts only allowlisted `start=1&surface=...` routes.
- Auto Ads uses one publisher loader; no manual ad units or synthetic paid-impression events.
- Share analytics is emitted only after native share or clipboard success.
- Twelve locale bundles expose the same privacy and trust boundary.

## Verify

Run the root `verify:zh-cognitive-distortions` gate and full harness before release.
