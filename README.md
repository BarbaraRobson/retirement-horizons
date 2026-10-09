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

Back up first. Connect to the internet and open the app to let it download an update. If an update-ready message appears, close **all** Retirement Horizons browser and installed-app windows, then reopen. An open copy deliberately keeps its current code until closed. The footer shows the installed version; this release is **v1.1.9**. Updates preserve existing schema-1 answers, except the projection start is aligned to 1 January of the current year as described below.

## Calculations, warnings and limitations

The app models monthly cash flows and displays annual summaries in current-year purchasing power by default. Future-dollar displays are approximate. Investment return and volatility presets are editable assumptions, not forecasts. Simulation success rates depend on the entered facts, sample size and model; they are not guarantees.

Warnings flag choices such as inflation at or below 1%, zero investment fluctuations, optimistic returns, short horizons, inheritance dependence and duplicated costs. Invalid or contradictory dates, allocations and budgets block calculation. **Passing these checks does not establish that the information is correct or the results are reliable.** Read **Help** before interpreting results.

Pension timing and survivor assumptions were reviewed on 7 October 2026. A blank defined benefit commencement date means already payable at the plan start; enter a future date for a pension that has not started. PSS generally permits pension access from 55 subject to retirement conditions. Age 60 changes its tax treatment. Projections now start on 1 January of the current year and extend through December of the final planning year, so all result rows cover whole calendar years. Existing plans and imported backups adopt that January start. Review opening balances at 1 January and all intervening income/events: the app cannot reconstruct historical balances from today’s figures. Income received earlier in the initial financial year refers to July–December before the January start. A $70,000 pension payable throughout the year contributes $70,000 gross before indexation; one commencing in October contributes $17,500 that year.

The editable PSS survivor default is [CSC’s published spouse-only rate of 67%, or 85% under the higher dependant option](https://www.csc.gov.au/-/media/Files/PSS/Factsheets/PSF03-death-benefits.pdf). Verify the actual entitlement. Existing saved percentages are preserved; older backups gain a blank commencement date. Pre-commencement deaths, initial full-rate spouse payments, disability-specific tax offsets and changed components on death need separate verification.

Other rules were reviewed on 6 October 2026 and may change. Important limitations include:

- Tax, Age Pension and eligibility calculations are simplified. The app is not a verified tax calculator or eligibility determination.
- Pension tax components, survivor terms, foreign-pension classification, applicable fund earnings, withholding and contribution eligibility/caps require independent verification. Unresolved UK lump-sum tax uses a labelled provisional 30% reserve.
- Medicare low-income thresholds are planning approximations. Division 296, Medicare levy surcharge, SAPTO spouse transfers, unusual pre-60 withdrawals, SMSF-specific tax and non-resident Australian taxation are not automatic.
- Events and birthdays have monthly resolution; initial partial financial years need income already received since 1 July. Same-month receipt and settlement ordering can hide a funding gap.
- Estate and survivor calculations simplify legal, tax, timing and transfer-balance consequences. Aged-care means-tested fees are not automatically determined.
- The separate settlement view is a conservative cash-only approximation. No Rent Assistance, Work Bonus, grandfathered benefits, overseas portability or illness-separated rates are included.
- Normal market innovations and optional crashes cannot capture every tail risk, policy change or prolonged market regime. Inheritances are uncertain scenario assumptions and excluded by default.

## If a calculation stops or the browser reloads

The default sample is 1,000 stochastic paths for each standard strategy. Former default sample counts of 400 or 1500 change to 1000 once; other saved counts are kept. The former 150% guardrails ceiling changes once to 200%; other values are kept. Larger samples can take several minutes on a mobile device. Standard comparisons stop after three minutes of computation; advanced annual reassessment stops after 30 seconds. A separate browser watchdog terminates a stalled worker. No incomplete comparison is presented as a completed result. The limits protect against runaway calculations but cannot prevent every device or browser crash.

If a calculation cannot finish, keep a backup, set **Your details → Assumptions → Simulation paths** to **100**, and use the three standard strategies. Fewer paths mean greater sampling uncertainty. Annual reassessment runs many nested simulations and may not finish on a slower device. **Cancel calculation** stops a running calculation. Leaving the page stops its worker.

Tab switching now keeps navigation buttons mounted, commits and blurs focused controls before replacing forms, skips unchanged pages, and unparents old form descendants to reduce the amount a browser can retain. This is defensive hardening; a tab-switch crash on iPad Chrome has not been reproduced on physical hardware.

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

Date: 2026-10-07. Model: GPT-6. Prompt: Increase the default stochastic run count from 400 to 1500, including existing plans on the former default, with consistent bounds and runtime safeguards.

Date: 2026-10-07. Model: GPT-6. Prompt: Document navigation hardening following reports of pre-simulation tab-switch crashes in iPad Chrome, without claiming a confirmed fix.

Date: 2026-10-07. Model: GPT-6. Prompt: Review PSS survivor percentage, age-55 access and partial-year income; clarify periods, add commencement dates and correct related pension assumptions.

Date: 2026-10-07. Model: GPT-6. Prompt: Keep the published 67% survivor default and start projections on 1 January of the current year with complete calendar-year results.

## Automatic super access dates

Each account calculates an access date from its owner’s date of birth: age 60 by default, assuming retirement conditions will be met, or age 65 regardless of work. A confirmed date can override this for employment cessation after 60. Existing entered dates are preserved. Changing the owner or birth date updates automatic dates; manual dates remain unchanged. Pension phase begins at the calculated access date by default, unless kept in accumulation or given a manual commencement date. The model uses monthly resolution and does not implement transition-to-retirement restrictions or pre-60 early-release exceptions. See [ATO access rules](https://www.ato.gov.au/individuals-and-families/super-for-individuals-and-families/super/withdrawing-and-using-your-super/early-access-to-super/illegal-early-access-to-super).

Date: 2026-10-07. Model: GPT-6. Prompt: Automatically calculate super access dates from partners’ birth dates, with retirement assumptions and preserved manual overrides.

## Explanations and suggested entries

Tap ⓘ beside an input for its explanation; Close or Escape dismisses it. Unconfirmed suggested values are shaded and include a Confirm value button. Replacement-home cash supplies opening cash only if blank or still an unconfirmed suggestion. It is not added a second time. Earliest settlement supplies expected/latest dates two/six months later when blank; these are illustrative scenarios, not a typical-delay forecast. Edit them from the contract and builder’s advice. Net house sale proceeds was record-only and is no longer shown. Older backup records are retained for compatibility.

The guardrails headline is the median, across simulation paths, of each path’s median annual funded living spending over the whole projection. It includes survivor spending and shortfalls and differs from starting spending. The failure year is the earliest failure in the tested paths, not a predicted date: other paths can fail later or succeed. Estate-reserve failures occur at the horizon.

Age 55 is the PSS retirement assumption, not a universal defined benefit access rule. Other schemes require their own confirmed commencement dates. Access/phase assumptions describe the model; actual conditions and pension elections must be checked with the fund.

Date: 2026-10-09. Model: GPT-6. Prompt: Document explanatory pop-ups, provisional suggestions, 1000 runs, retirement/pension defaults, failure timing and lifetime guardrails spending.

The comparison includes a Wealth through retirement chart below spending. It shows year-end cash, investments, super, investment property and other entered assets less outstanding debts, including super that may not yet be accessible, and excludes the principal home (PPOR). Lines are medians and bands are central 80% ranges. The guardrails band is darker for readability.
