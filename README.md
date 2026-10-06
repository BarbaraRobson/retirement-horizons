# Retirement Horizons

> **FOR EDUCATION AND ENTERTAINMENT PURPOSES ONLY.**
>
> **This app may contain errors, omissions or incorrect assumptions. Its calculations and results are not personal financial advice and must not be treated as such. Do not make investment, retirement, pension, tax or property decisions on the strength of its results. Verify important figures independently and seek advice from a suitably qualified professional about your circumstances.**

## Open the app

**Active page: https://barbararobson.github.io/retirement-horizons/**

Retirement Horizons is a free, offline-capable retirement simulation for Australian couples with Australian defined benefit or UK pension interests. It compares fixed spending, spending phases and guardrails under simulated markets. The fictional example is for trying the controls; it is not a suggested financial plan.

## Install on your own iPad or iPhone

1. While connected to the internet, open **https://barbararobson.github.io/retirement-horizons/** in **Safari**.
2. Tap **Share**, then **Add to Home Screen**. If offered, enable **Open as Web App**, then tap **Add**. Depending on the Safari layout, Share may be in the menu.
3. Open **Retirement Horizons** from your Home Screen. Wait until the footer says **Offline cache available**. Close the app completely and reopen it to finish the first offline setup.
4. Try reopening with Wi-Fi and mobile data off. Reconnect if the app does not load; the first download must finish online.
5. Use that same installed copy for your plan. Start with **Your details** and complete the interview. Use **Defined benefit and UK pensions** for those income sources and **Super & investments** for accumulation and account-based pension balances.

No account, paid subscription or GitHub login is needed to use or install the app. Offline operation and layout still need verification on actual iPad and iPhone hardware; desktop browser testing is not a substitute.

## Keep a backup

Answers are saved automatically on the current device. **They do not synchronise between devices or browser copies.** Do not assume that Safari and the installed app share a plan: check the saved answers in the copy you intend to use.

Tap **Backup** and save the downloaded JSON file in **Files**. Make a backup before clearing browser data, removing the app, changing devices or updating. Backup files and CSV exports contain the entered information; keep them private.

To import a backup, go to **Your details → Restore backup**, select the JSON file and confirm replacement of that device's plan. **Recover previous plan** can recover the locally held recovery copy when one exists; it does not replace an external backup.

## Updates

Back up first. Connect to the internet and open the app to let it download an update. If an update-ready message appears, close **all** Retirement Horizons browser and installed-app windows, then reopen. An open copy deliberately keeps its current code until closed. The footer shows the installed version; this release is **v1.1.3**. Updates preserve existing schema-1 answers.

## Calculations, warnings and limitations

The app models monthly cash flows and displays annual summaries in current-year purchasing power by default. Future-dollar displays are approximate. Investment return and volatility presets are editable assumptions, not forecasts. Simulation success rates depend on the entered facts, sample size and model; they are not guarantees.

Warnings flag choices such as inflation at or below 1%, zero investment fluctuations, optimistic returns, short horizons, inheritance dependence and duplicated costs. Invalid or contradictory dates, allocations and budgets block calculation. **Passing these checks does not establish that the information is correct or the results are reliable.** Read **Help** before interpreting results.

Rules were reviewed on 6 October 2026 and may change. Important limitations include:

- Tax, Age Pension and eligibility calculations are simplified. The app is not a verified tax calculator or eligibility determination.
- Pension tax components, survivor terms, foreign-pension classification, applicable fund earnings, withholding and contribution eligibility/caps require independent verification. Unresolved UK lump-sum tax uses a labelled provisional 30% reserve.
- Medicare low-income thresholds are planning approximations. Division 296, Medicare levy surcharge, SAPTO spouse transfers, unusual pre-60 withdrawals, SMSF-specific tax and non-resident Australian taxation are not automatic.
- Events and birthdays have monthly resolution; initial partial financial years need income already received since 1 July. Same-month receipt and settlement ordering can hide a funding gap.
- Estate and survivor calculations simplify legal, tax, timing and transfer-balance consequences. Aged-care means-tested fees are not automatically determined.
- The separate settlement view is a conservative cash-only approximation. No Rent Assistance, Work Bonus, grandfathered benefits, overseas portability or illness-separated rates are included.
- Normal market innovations and optional crashes cannot capture every tail risk, policy change or prolonged market regime. Inheritances are uncertain scenario assumptions and excluded by default.

## If a calculation stops or the browser reloads

Standard comparisons stop after 50 seconds of computation; advanced annual reassessment stops after 30 seconds. A separate browser watchdog terminates a stalled worker. No incomplete comparison is presented as a completed result. The limits protect against runaway calculations but cannot prevent every device or browser crash.

If a calculation cannot finish, keep a backup, set **Your details → Assumptions → Simulation paths** to **100**, and use the three standard strategies. Fewer paths mean greater sampling uncertainty. Annual reassessment runs many nested simulations and may not finish on a slower device. **Cancel calculation** stops a running calculation. Leaving the page stops its worker.

If the page reloads unexpectedly, reopen the same copy and check that the saved answers are present. Close other heavy browser tabs and try again after updating online. For a bug report, provide the app version, device model, iOS/iPadOS version, the action that triggered it and any displayed error. Do not publish a personal backup or financial figures in a public issue.

## Privacy

There are no AI calls, remote fonts, analytics, financial connectors or data-upload endpoints. Answers remain in device-local storage; calculations run in a local Web Worker. The host can see ordinary requests for the app's static files, but entered financial answers are not included in those requests. Device/browser storage can nevertheless be cleared or become unavailable, so keep backups.

## For contributors

Source repository: https://github.com/BarbaraRobson/retirement-horizons

There are no package dependencies. With Node 22 or later, run `npm run check` for syntax and `npm test` for calculation and UI regressions. The GitHub Actions publishing workflow tests and deploys public application files to the active page above. Do not commit personal financial files or backup exports. Bump the app and service-worker versions together when public files change; schema changes need an explicit migration.

Automated checks cover specific known cases, not every possible financial circumstance or browser behaviour. Mobile hardware testing remains necessary.

## Authoring record

Date: 2026-10-06. Model: GPT-6. Prompt: Build a generic Australian/UK retirement PWA, covering the agreed interview, uncertainty, fixed/phased/guardrail spending comparisons, advanced reassessment, current/future dollars, editable assumptions and super allocation schedules, with local data, CSV, iPad design and GitHub Pages publishing.

Date: 2026-10-06. Model: GPT-6. Prompt: Audit and fix financial edge cases and flag reasonable input mistakes without overwriting user data.

Date: 2026-10-07. Model: GPT-6. Prompt: Rewrite the README for independent iPad/iPhone installation with a prominent education and entertainment warning, possible errors and no personal financial advice; use the active address; rename the pensions section and investigate browser crashes.
