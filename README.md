# Retirement Horizons

An offline-capable, local-only retirement planning PWA for Australian couples with Australian or UK pension interests. Public files contain only generic rules and explicitly fictional demonstration data.

## Included

- Eight-section branching interview; unknown amounts are flagged, not presented as known zeroes.
- Comparison of model-supported fixed spending, spending phases and guardrails on common market paths.
- Optional slower annual reassessment with a reduced simulation sample.
- Monthly financial modelling and annual summaries; current-year dollars by default and approximate future-dollar display.
- Apartment settlement cash checks for early, expected and delayed completion.
- Standard taxed-super accounts, accessible dates, pension dates, minimum withdrawals, custom weighted investment mixes and future-year allocation changes.
- Australian resident income tax and core Age Pension means tests, including younger-partner accumulation super and home-sale proceeds assumptions.
- UK receipts, conversion costs, verified tax provisions/applicable fund earnings, UK pension/State Pension income, net inheritance scenarios and a simplified UK estate estimate.
- Survivor, care-cost, market crash, poor-return and FX scenarios.
- Local autosave, previous-plan recovery, JSON backup/restore, CSV inputs and projections, offline help and official source links.

## Publish on GitHub Pages

1. Create a **public** repository named `retirement-horizons` in the intended GitHub account.
2. Upload this folder's contents, including `.github/workflows/pages.yml`, into the repository root on `main`. Do not upload personal financial files or backup exports.
3. In Settings → Pages → Build and deployment, select **GitHub Actions**.
4. Run the **Publish Retirement Horizons** workflow or push to `main`. The workflow checks syntax, runs the financial tests, packages only public application files and deploys them.
5. The address will normally be `https://USERNAME.github.io/retirement-horizons/`.

A branch-based Pages alternative is to publish `main` / root. This also serves the app without a build, but does not run the included checks as a deployment gate. There are no package dependencies; Node 22+ is sufficient for the tests.

## iPad

Open the HTTPS address in Safari, choose Share → Add to Home Screen → Open as Web App. Load once online, close and reopen to ensure the service worker controls the app, then test offline. Use that installed copy consistently. Data does not synchronise between devices. Download a JSON backup to Files before uninstalling, clearing browser data, changing devices or updating.

## Privacy

There are no AI calls, remote fonts, analytics, financial connectors or data-upload endpoints. The app only loads its own static files. Entered answers remain in origin-scoped local storage; calculations use a local module Web Worker. The public hosting provider can see ordinary requests for application files, but financial answers are not encoded in those requests. Exports contain personal answers and should be kept private.

## Calculations and limitations

Rules reviewed 6 October 2026. Government rates have effective dates; future benefits/thresholds use an explicit indexation assumption. Investment return and volatility presets are editable modelling judgements inspired by CSC/PSSap categories, not product forecasts.

This is a planning engine, **not a verified tax calculator or eligibility determination**. Its prominent in-app Help explains all approximations. In particular:

- Birthdays and event timing are monthly. An initial partial financial year needs a prior-income estimate.
- Medicare low-income thresholds are editable planning approximations. SAPTO spouse transfers, Medicare levy surcharge, Division 296, unusual pre-60 withdrawals, SMSF-specific tax and non-resident Australian taxation are not automatic; verified annual adjustments are needed.
- Foreign pension classification and applicable fund earnings must be externally verified. Unresolved UK lump-sum tax uses a labelled 30% reserve. Withholding refunds/credits require explicit entries.
- The estate calculator is simplified and does not determine trusts, gifts, allowance tapering, reliefs or inherited-pension beneficiary income tax.
- Contributions require verified eligibility/caps. Individual transfer balance cap and bring-forward rules are not inferred.
- Care costs require actual estimates; residential aged-care means-tested fees are not automatically determined.
- Survivor asset transfers simplify tax, estate delays and pension transfer-balance consequences.
- Cash-only settlement charts are conservative and approximate; the full model includes investment/super funding and more tax detail.
- No Rent Assistance, Work Bonus, legacy/grandfathered benefits, overseas portability or illness-separated rates.
- Normal innovations plus optional crash shocks cannot describe all real-world tail risks. Success rates are conditional simulation outputs, not guarantees.

## Checks

`npm run check` checks JavaScript syntax. `npm test` runs consequential calculation tests for enacted tax rates, Age Pension means tests, covariance, cash-flow conservation, distribution double counting, pension minimum withdrawals, scheduled allocations, settlement timing, inheritance exclusion, essential spending shortfalls, loan payoff, backup schema and reproducibility.

Version 1.1 adds input warnings and blocking validation, corrects pension minimums and tax shortfalls, handles non-homeowner status without a pending purchase, and reports unsupported essential spending explicitly. See the automated tests for covered cases. A DOM-stub check renders all interview sections, repeaters, navigation and help topics without a runtime exception. The deployed app and strategy comparisons have been checked in a desktop browser. Actual iPad layout, offline reopening and download/restore interaction testing remain pending.

## Updates

Change the service-worker cache version when application files change. The worker deliberately does not force a new version onto open clients; users should back up, close all app windows and reopen. Schema changes require an explicit migration rather than silently discarding stored plans.

## Authoring record

Date: 2026-10-06. Model: GPT-6. Prompt: Build a generic Australian/UK retirement PWA, covering the agreed interview, uncertainty, fixed/phased/guardrail spending comparisons, advanced reassessment, current/future dollars, editable assumptions and super allocation schedules, with local data, CSV, iPad design and GitHub Pages publishing.

## Input safeguards (v1.1)

Invalid or contradictory plans cannot calculate. Unusual assumptions stay editable with prominent warnings: inflation at or below 1%, zero investment volatility, high real returns, low correlations, exchange-rate direction, short horizons, unpaid debt interest, inheritance dependency and duplicated costs. Existing local answers and schema-1 backups are preserved. Close all app windows and reopen online to receive the update.

Date: 2026-10-06. Model: GPT-6. Prompt: Audit and fix financial edge cases and flag reasonable input mistakes without overwriting user data.
