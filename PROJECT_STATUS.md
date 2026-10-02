# HackCulture Recreation Project Status

Last consolidated: October 1, 2026.

This file replaces the operational handoff value of `CONTEXT.md` and `CONTEXT-2.md`. Those two files are large Codex conversation transcripts and can be deleted after this file is reviewed. This file intentionally does not copy live account passwords from the transcripts; use the documented environment variable names instead.

## Project Summary

This workspace is a Next.js App Router recreation of `https://hackculture.io/`, built with TypeScript, Tailwind CSS, shadcn-style primitives, Radix Dialog, and local content fixtures. The project reproduces the public HackCulture site and the accessible authenticated screens observed from the two user-supplied accounts.

The implementation is a frontend recreation with local persistence. It does not execute HackCulture's original JavaScript, analytics, Firebase sessions, or remote API from the local app. Public pages, captured content, local authentication, profile editing, registration forms, My Programs, and a captured program dashboard are implemented locally.

The live site was inspected on September 30, 2026 for public routes and October 1, 2026 for authenticated routes.

## Current Run State

- Local app URL: `http://localhost:3100`
- Recommended dev command: `npm run dev -- --port 3100`
- Port 3100 is used because port 3000 may already be occupied in this workspace.
- The project is not currently inside a Git repository. `git status --short` returns `fatal: not a git repository`.
- `node_modules`, `.next`, `.next-dev`, `.local-data`, `reference`, `test-results`, `reference-home.html`, `.env*`, and `*.tsbuildinfo` are ignored.

## Package And Framework

Package name: `hackculture-recreation`

Scripts:

```sh
npm run dev
npm run build
npm run start
npm run typecheck
npm run inspect
npm run test:smoke
```

Dependencies:

- `next` `^15.5.0`
- `react` `^19.1.0`
- `react-dom` `^19.1.0`
- `@radix-ui/react-dialog` `^1.1.15`
- `@radix-ui/react-slot` `^1.2.3`
- `class-variance-authority` `^0.7.1`
- `clsx` `^2.1.1`
- `html-react-parser` `^6.1.8`
- `lucide-react` `^0.468.0`
- `tailwind-merge` `^3.3.1`

Dev dependencies:

- `typescript` `^5.9.2`
- `tailwindcss` `^4.1.0`
- `@tailwindcss/postcss` `^4.1.0`
- `playwright` `^1.55.0`
- `cheerio` `^1.1.2`
- `prettier` `^3.9.9`
- React and Node type packages

The Next.js config uses `.next-dev` in development and `.next` in production so the dev server and production build do not overwrite one another.

Configured redirects:

- `/hackathon/:slug` -> `/hackathons/:slug`
- `/clients` -> `/our-clientele`
- `/host-event` -> `/host`
- `/my-programs` -> `/my-events`

## Top-Level Files And Directories

Important root files:

- `README.md`: user-facing project overview and run instructions.
- `SITE_MAP.md`: public route inventory from the HackCulture crawl.
- `ACCOUNT_SCREENS.md`: authenticated account inventory and boundaries.
- `PROJECT_STATUS.md`: this consolidated handoff file.
- `package.json` and `package-lock.json`: npm project definition and lockfile.
- `next.config.ts`: Next.js config and redirects.
- `tsconfig.json`: TypeScript config.
- `components.json`: shadcn-style component config.
- `postcss.config.mjs`: Tailwind PostCSS setup.
- `public/reference.css`: copied/sanitized source styling used by the local app.
- `reference-home.html`: ignored captured homepage source.
- `CONTEXT.md` and `CONTEXT-2.md`: old conversation transcripts that this file replaces.

Important directories:

- `src/app`: App Router pages, route handlers, global CSS, account CSS, dashboard CSS.
- `src/components`: React components for navigation, forms, profiles, dashboards, and interactive controls.
- `src/components/ui`: local shadcn-style primitives.
- `src/content/pages`: sanitized JSON fixtures for public pages.
- `src/content/accounts`: local account/profile/dashboard/registration fixtures.
- `src/lib`: account helpers, content renderer, utility functions.
- `scripts`: inspection, import, verification, and smoke-test scripts.
- `public/assets`: downloaded source assets, images, fonts, SVGs.
- `public/offerings`: additional offering assets.
- `reference`: ignored source captures and screenshots used during inspection.
- `.local-data`: ignored runtime account/profile/host data for local persistence.
- `test-results`: ignored Playwright screenshots and diagnostics.

## Source Structure

App routes and APIs:

- `src/app/page.tsx`: homepage route.
- `src/app/[...slug]/page.tsx`: static public route renderer for captured pages.
- `src/app/profile/page.tsx`: protected profile page.
- `src/app/onboarding/page.tsx`: four-step profile editor.
- `src/app/my-events/page.tsx`: protected My Programs page.
- `src/app/my-events/manage/[id]/page.tsx`: protected program dashboard route.
- `src/app/hackathons/register/[slug]/page.tsx`: protected registration forms.
- `src/app/api/auth/route.ts`: local sign-in/logout API.
- `src/app/api/auth/session/route.ts`: local session API.
- `src/app/api/profile/route.ts`: profile update API.
- `src/app/api/registrations/route.ts`: local registration API.
- `src/app/api/host/route.ts`: local host inquiry API.

Core components:

- `site-header.tsx`: header, nav, dropdowns, auth-aware account menu.
- `auth-form.tsx`: sign-in, sign-up display state, password visibility.
- `account-provider.tsx`: client session context and logout flow.
- `profile-page.tsx`: profile display, contact dialog, settings, role-specific sections.
- `onboarding-editor.tsx`: four-step account editor.
- `my-programs.tsx`: My Programs search, filtering, sorting, grid/table views.
- `program-dashboard.tsx`: captured Chandigarh dashboard, phases, resources, team/submission/events views.
- `registration-form.tsx`: captured registration forms and validation.
- `host-form.tsx`: three-step host inquiry and confirmation.
- `program-directory.tsx` and `program-controls.tsx`: public program directory.
- `featured-carousel.tsx`, `testimonial-carousel.tsx`, `cookie-consent.tsx`, `interactive-surface.tsx`: public interactions.

Local libraries:

- `src/lib/accounts.ts`: local account storage, auth, hashing/session helpers, profile persistence.
- `src/lib/account-types.ts`: account and profile types.
- `src/lib/content.tsx`: sanitized content renderer, internal link handling, footer, slots.
- `src/lib/offerings.ts`: offering metadata.
- `src/lib/utils.ts`: shared utility helpers.

## Public Site Coverage

There are 75 public local routes and 54 captured programs. Public pages are stored in `src/content/pages`, with route metadata in `src/content/routes.json` and program data in `src/content/programs.json`.

Implemented public areas:

- Homepage.
- Programs directory.
- Offerings overview.
- Five offering pages.
- Our Clientele.
- Blog index.
- Five blog articles.
- Three legal pages.
- Host Program page.
- Auth page and reset-password page.
- 54 program detail pages.

Implemented public interactions:

- Header navigation and dropdowns.
- Mobile menu.
- Offerings navigation.
- Program search.
- Program category/status/sort controls.
- Pagination and empty states.
- Blog category filters.
- FAQ accordions.
- Testimonials carousel.
- Program section navigation.
- Share links.
- Cookie preference persistence.
- Sign-in gate for registration routes.
- Sign-up visual state and password visibility.
- Host Program multi-step form.

External destinations are intentionally preserved where appropriate, including Calendly, social profiles, map links, Linktree/ecosystem links, WhatsApp, email links, and externally hosted article destinations.

## Public Route Inventory

The discovered and implemented public routes are:

- `/`
- `/programs`
- `/offerings`
- `/offerings/corporate-innovation-programs`
- `/offerings/internal-hackathons`
- `/offerings/ai-capacity-building`
- `/offerings/innovation-hackathons`
- `/offerings/hiring-hackathons-employer-branding`
- `/our-clientele`
- `/blog`
- `/blog/women-in-tech-building-the-future-shebuilds-2025`
- `/blog/gromo-ai-hackathon-recap-16-prototypes-3-now-scaling`
- `/blog/great-bengaluru-hackathon-2025-success-story`
- `/blog/from-code-to-career-hsbc-technology-hiring-hackathon-highlights`
- `/blog/2024-innovation-rewind-hackculture`
- `/legal/terms-and-conditions`
- `/legal/privacy-policy`
- `/legal/code-of-conduct`
- `/host`
- `/auth`
- `/auth/reset-password`
- `/hackathons/sarvam-campus-nit-trichy`
- `/hackathons/code-for-communities-chandigarh`
- `/hackathons/sarvam-campus-srmist`
- `/hackathons/agents-that-act`
- `/hackathons/sarvam-campus-iit-madras`
- `/hackathons/hackcbs-9-0`
- `/hackathons/paytm-ai-hackathon-hyderabad`
- `/hackathons/code-cubicle-6-0`
- `/hackathons/feg-innovation-hackathon-2026-finalists`
- `/hackathons/buildverse-hackathon`
- `/hackathons/sarvam-buildin-hours`
- `/hackathons/databricks-campus-hackathon-bmsce`
- `/hackathons/databricks-campus-hackathon-rvce`
- `/hackathons/MUJ-Hackx4.0`
- `/hackathons/build-with-bharat-2-0`
- `/hackathons/cimet-ai-hiring-hackathon-2026`
- `/hackathons/x402-global-challenge-prehack`
- `/hackathons/forge-the-future-hackathon-2026`
- `/hackathons/bessemer-tech-catalyst`
- `/hackathons/nabard-hackathon-gff-2026`
- `/hackathons/electronica-india-tech-challenge-2026`
- `/hackathons/zero-to-one`
- `/hackathons/sebi-securities-market-techsprint`
- `/hackathons/trackshift-2026`
- `/hackathons/ai-vibe-sprint-jakarta`
- `/hackathons/ai-vibe-sprint-bengaluru-2026`
- `/hackathons/sbi-hackathon-gff-2026`
- `/hackathons/ai-vibe-sprint-delhi-ncr-2026`
- `/hackathons/mphasis-hiring-hackathon`
- `/hackathons/paytm-ai-hackathon`
- `/hackathons/ai-for-good-hackathon-2nd-edition`
- `/hackathons/vibecon`
- `/hackathons/incubation-program-for-mobility-startups`
- `/hackathons/lyzr-agentathon-2026`
- `/hackathons/petrochemical-innovation-challenge`
- `/hackathons/genai-filmmaking-hackathon`
- `/hackathons/ai-ad-making-hackathon-cinic-x-beyond-building`
- `/hackathons/gitagent-hackathon`
- `/hackathons/hyperapi-hackathon`
- `/hackathons/bmu-innovation-challenge`
- `/hackathons/vibecon-india`
- `/hackathons/feuji-innovation-challenge`
- `/hackathons/ekathon-2026`
- `/hackathons/ai-innovation-challenge`
- `/hackathons/cine-ai-hackfest`
- `/hackathons/portkey-ai-builder-challenge`
- `/hackathons/ai-for-good-challenge`
- `/hackathons/vibehack-2025`
- `/hackathons/trackshift-innovation-challenge-1`
- `/hackathons/shebuilds-2025`
- `/hackathons/hsbc-technology-india-hackathon-2025`
- `/hackathons/the-great-benguluru-hackathon`
- `/hackathons/5g-6g-innovation-hackathon-2024`
- `/hackathons/vtion-innovate-hackathon`

Additional supported states and aliases:

- `/auth?mode=signup`: account creation visual state.
- `/blog?category=hackathons`, `/blog?category=business`, `/blog?category=featured`: category filters.
- `/profile/programs` and `/my-programs`: protected program aliases/redirects.
- `/hackathon/:slug`: canonical redirect.
- `/clients`: canonical redirect.
- `/host-event`: canonical redirect.

## Authenticated Account Coverage

Two accounts were inspected on the live site:

- Student account email: `taheba9671@bitproy.com`
- Working professional account email: `tadijax798@deertees.com`

Passwords are not stored in this handoff file. Local checks expect:

- `HC_STUDENT_EMAIL`
- `HC_STUDENT_PASSWORD`
- `HC_PRO_EMAIL`
- `HC_PRO_PASSWORD`

Local password hashes and session secrets are stored in ignored `.env.local`, generated by `scripts/configure-local-accounts.mjs`.

Both accounts sign in locally using signed HttpOnly cookies. Account data is loaded from `src/content/accounts` and runtime edits persist in ignored `.local-data/accounts`.

Implemented authenticated routes and flows:

- `/profile`
- `/onboarding?edit=true&step=1`
- `/onboarding?edit=true&step=2`
- `/onboarding?edit=true&step=3`
- `/onboarding?edit=true&step=4`
- `/my-events`
- `/my-events/manage/[registration ID]`
- `/hackathons/register/code-for-communities-chandigarh`
- `/hackathons/register/hackcbs-9-0`
- `/host`
- Account dropdown with Profile, My Programs, All Programs, Host Event, Logout.

Implemented account features:

- Protected routing.
- Local sign-in/logout.
- Role-specific profile page.
- Contact dialog.
- Copy profile ID action.
- Legal links.
- Reset password link/state.
- Profile rating display.
- Four-step onboarding editor.
- Basic information editing.
- Student education details.
- Professional category details.
- Skills editor.
- Social links editor.
- Transactional and promotional preferences.
- Local profile persistence.
- Independent student/professional local data.
- My Programs search, sorting, filters, grid view, table view.
- Registration redirect to dashboard when already registered.

Student-specific captured profile content:

- Education, skills, social links, settings, and student onboarding fields.
- Step 2 includes college, city, degree, study year, graduation, and resume.

Working-professional captured profile content:

- Startup/professional details, skills, social links, settings, and professional onboarding fields.
- Step 2 includes professional category, category-specific fields, and resume.

Professional category variants inspected and implemented:

- Corporate
- Startup
- Self-Employed
- Venture Capitalist
- Investor
- Accelerator
- University
- Government
- Non-Profit
- Other

## Registrations And Dashboards

Both source accounts already had a Code for Communities Chandigarh registration during the October 1, 2026 inspection. Attempting to register redirected each account to its program dashboard.

Seeded local registrations:

- Student:
  - ID: `6abea73f7df522bb370647c6`
  - Slug: `code-for-communities-chandigarh`
  - Name: `Code for Communities Chandigarh`
  - Registered at: `2026-10-01T18:32:31.603000Z`
- Professional:
  - ID: `6abea79ea3971421edf56146`
  - Slug: `code-for-communities-chandigarh`
  - Name: `Code for Communities Chandigarh`
  - Registered at: `2026-10-01T18:34:06.559000Z`

Captured open registration forms:

- `code-for-communities-chandigarh`
  - 7 questions.
  - Includes WhatsApp Number, Current Address, Occupation, Company Name, Years of Experience, LinkedIn Profile, MLH registration screenshot upload.
- `hackcbs-9-0`
  - 14 questions.
  - Includes Age, City, Country, College/University, Current Level of Study, Hacker Bio, Resume upload, prior work/internship experience, GitHub, LinkedIn, X/Twitter, and MLH consent radio questions.

Registration behavior:

- Required fields are validated locally.
- Select/radio options are validated against captured options.
- Local registrations are persisted per account.
- Uploads currently keep filenames only, not file bytes.
- Local registrations do not enroll anyone on HackCulture.
- Existing local registrations and profile edits are preserved.
- Dashboard routes check account ownership.
- An already registered user is redirected from registration to the dashboard.
- Other locally registered events receive a registration confirmation rather than an invented dashboard.

Implemented Chandigarh dashboard states:

- Overview/dashboard presentation.
- Program phase navigation.
- Resources tab and resource sub-tabs.
- Manage Team locked state.
- Submissions tab with phase selection.
- Grand Finale / mentorship / presentations state.
- Events schedule.
- Description dialogs.
- Copy registration ID action.
- Responsive sidebar and mobile dashboard navigation.

Known dashboard boundaries:

- Live team formation was gated until October 4 during inspection.
- Live submissions were gated until October 5 during inspection.
- Those locked states are reproduced.
- Countdown values and phase eligibility are captured states, not a live event clock.
- Team editing, actual project submission, judging, and organizer administration were inaccessible and are not claimed as reproduced.

## Host Program Flow

The public `/host` page and authenticated host inquiry flow are implemented locally.

Observed live behavior:

- One authorized live Host Program inquiry was submitted from the professional account.
- Organization used: `Workspace recreation test`.
- The message explicitly identified it as an authorized test and requested no follow-up.
- The live service returned HTTP 200 with `Form submitted successfully`.
- The source site displayed the confirmation screen: `We've received your request`.
- No event was published.
- No organizer access was granted.

Local behavior:

- Three-step host inquiry is implemented.
- Host inquiry validation is implemented.
- Host inquiries persist to ignored `.local-data`.
- The captured confirmation screen is displayed.
- Local inquiries do not send messages, publish events, or contact HackCulture.
- The confirmation text is copied from the reference site and does not imply real follow-up from local usage.

## Data And Persistence

Build-time fixtures:

- `src/content/pages/*.json`: public page content.
- `src/content/routes.json`: public routes.
- `src/content/programs.json`: 54 program records.
- `src/content/program-card.json`: public program card fixture.
- `src/content/footer.json`: footer content.
- `src/content/accounts/profiles.json`: seeded student/professional account profiles.
- `src/content/accounts/registrations.json`: seeded registrations.
- `src/content/accounts/registration-programs.json`: two captured registration forms.
- `src/content/accounts/dashboard-screens.json`: sanitized dashboard screen fixtures.

Ignored runtime data:

- `.local-data/accounts/student.json`
- `.local-data/accounts/professional.json`
- local host inquiry records under `.local-data`

Private local config:

- `.env.local` stores generated password hashes and session secret.
- `.env.local` is ignored and should remain private.

Fresh local setup:

```powershell
$env:HC_STUDENT_PASSWORD='...'
$env:HC_PRO_PASSWORD='...'
node scripts/configure-local-accounts.mjs
```

The configure script creates private scrypt hashes and a random session secret. Production would require durable storage and a production identity provider.

## Validation Status

The latest recorded validation from the context files passed:

```sh
npm run test:smoke
```

Passed smoke checks:

- Cookie preference persists.
- Offerings navigation.
- Program search, empty state, pagination, category filter.
- Blog category filter.
- FAQ accordion.
- Registration sign-in gate.
- Signup and password visibility.
- Host form validation and multi-step navigation.
- Mobile menu and testimonial carousel.
- 75 public routes and no runtime exceptions.

Authenticated account check:

```powershell
$env:HC_STUDENT_EMAIL='taheba9671@bitproy.com'
$env:HC_STUDENT_PASSWORD='...'
$env:HC_PRO_EMAIL='tadijax798@deertees.com'
$env:HC_PRO_PASSWORD='...'
node scripts/check-local-accounts.mjs
```

Latest recorded result:

```text
student login, routes, edits, persistence, validation, responsive layout, logout PASS
professional login, routes, edits, persistence, validation, responsive layout, logout PASS
```

Additional API/account check:

```sh
node scripts/check-account-api.mjs
```

Latest recorded result:

```text
PASS invalid credentials, origin checks, profile validation, professional category switching, local registration persistence, and account isolation
```

Production build:

```sh
npm run build
```

Latest recorded result:

- Next.js 15.5.27
- Build compiled successfully.
- Types/lint validity passed.
- Static generation completed for 86 pages.
- Dynamic routes include auth/profile/registration/host APIs and account pages.

Visual/responsive notes:

- Layouts were checked at 1440px and 390px.
- Smoke and account checks assert no horizontal overflow on key public and authenticated routes.
- This is not a claim of pixel equality in every possible state.

## Important Scripts

Public and visual inspection:

- `scripts/inspect.mjs`: Playwright inspection for public pages.
- `scripts/crawl.mjs`: public crawl support.
- `scripts/import-content.mjs`: imports/sanitizes captured public content.
- `scripts/verify.mjs`: visual/content verification.
- `scripts/smoke.mjs`: smoke tests for public interactions and all public routes.

Authenticated inspection and account setup:

- `scripts/inspect-accounts.mjs`: live authenticated screen capture.
- `scripts/map-accounts.mjs`: captured route/account exploration.
- `scripts/explore-authorized.mjs`: live authenticated exploration; only `--submit-host` submits a host inquiry. Do not run that flag unless another live test inquiry is explicitly intended.
- `scripts/extract-account-data.mjs`: account fixture extraction.
- `scripts/extract-registration.mjs`: registration fixture extraction.
- `scripts/import-dashboards.mjs`: imports sanitized dashboard presentation fixtures and registration seeds.
- `scripts/configure-local-accounts.mjs`: creates local password hashes/session secret.
- `scripts/check-local-accounts.mjs`: end-to-end localhost account checks.
- `scripts/check-account-api.mjs`: API and account-isolation checks.
- `scripts/category-reference.mjs` and `scripts/account-options.mjs`: professional category and option captures.
- `scripts/onboarding-states.mjs` and `scripts/profile-states.mjs`: state capture helpers.

Refinement scripts:

- `scripts/refine-accounts.mjs`
- `scripts/refine-editor.mjs`
- `scripts/fix-account-source.mjs`
- `scripts/menu-reference.mjs`

Reference tools under `reference/tools` are ignored source/reference helpers kept for reproducibility.

## Implementation Boundaries

The local app is a faithful frontend recreation of captured states, not a live HackCulture clone.

Known boundaries:

- No live HackCulture backend integration.
- No live Firebase session shipped to browsers.
- No OAuth implementation.
- No real new-account creation.
- No password-reset email delivery.
- No live event enrollment.
- No actual project submission.
- No real team editing.
- No judging/organizer/admin dashboard.
- No live city/college remote search dataset; those fields accept text locally.
- Registration uploads store filenames only.
- Program dates, participant counts, dashboard gates, and content reflect the captured reference state.
- Animated positions and external widgets may differ from the live site at any later moment.

Security/privacy boundaries:

- Do not commit or publish `.env.local`.
- Do not commit or publish `.local-data`.
- Do not copy live account passwords into docs.
- The supplied account emails are documented because they identify the inspected roles.
- Live scripts that mutate the real HackCulture site should only be run with explicit authorization.

## Safe-To-Delete Context Files

After reviewing this file, it is safe to delete:

- `CONTEXT.md`
- `CONTEXT-2.md`

Those files are conversation transcripts with large command outputs, old intermediate failures, and copied sensitive credential text. The durable project state, implemented scope, validation status, limitations, routes, scripts, and setup instructions are consolidated here.

Keep these files unless intentionally replacing their current purpose:

- `README.md`
- `SITE_MAP.md`
- `ACCOUNT_SCREENS.md`
- `PROJECT_STATUS.md`

## Recommended Next Steps

If continuing development:

1. Start the app on port 3100.
2. Run `npm run test:smoke`.
3. Run `scripts/check-local-accounts.mjs` with the four account environment variables.
4. Run `npm run build` before delivery.
5. Avoid rerunning live inspection scripts against HackCulture unless the task explicitly requires fresh live verification.

