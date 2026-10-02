# Authenticated screen inventory

Inspected on October 1, 2026 using both accounts supplied by the user. Screenshots and response captures are under ignored `reference/accounts/`. Both accounts successfully authenticated on the source site. On this inspection, both already had a Code for Communities Chandigarh registration. Attempting registration redirected to each account's program dashboard.

One live Host Program inquiry was submitted from the professional account with organization `Workspace recreation test` and an explicit message identifying it as an authorized test and requesting no follow-up. The service returned HTTP 200, `Form submitted successfully`, and the confirmation screen. It did not publish an event or grant organizer permissions. No source profile edits, team creation, or project submissions were made.

| Route / interaction | Student | Working professional |
| --- | --- | --- |
| `/programs` | Authenticated navigation and account menu | Same |
| `/profile` | Education, skills, social links, settings | Startup details, skills, links, settings |
| `/onboarding?edit=true&step=1` | Basic information | Basic information |
| `/onboarding?edit=true&step=2` | College, city, degree, study year, graduation, resume | Professional category, category-specific fields, resume |
| `/onboarding?edit=true&step=3` | Skills and six social links | Same |
| `/onboarding?edit=true&step=4` | Transactional and promotional preferences | Same |
| `/my-events` | Registered program card, search, sorting, filters, grid/table | Same |
| `/my-events/manage/[registration ID]` | Overview, phases, resources, copy ID | Same |
| Dashboard Manage Team | Team-size limit and locked-phase screen | Same |
| Dashboard Submissions | Submission Phase, Grand Finale, description dialog, eligibility | Same |
| Dashboard Events | Cloud Community Days and DevFest schedule | Same |
| `/hackathons/register/code-for-communities-chandigarh` | Seven registration questions | Same |
| `/hackathons/register/hackcbs-9-0` | Fourteen questions; college prefilled | Same questions; no college prefill |
| `/host` | Three-step host inquiry | Three-step inquiry and successful submission confirmation |
| Account dropdown | Profile, My Programs, All Programs, Host Event, Logout | Same |
| Profile actions | Contact dialog, copy ID, legal links, reset password, rating | Same |

Professional categories inspected without saving: Corporate, Startup, Self-Employed, Venture Capitalist, Investor, Accelerator, University, Government, Non-Profit, Other. Their visible fields are implemented.

## Local behavior and boundaries

- Supplied credentials work locally. Passwords are stored as scrypt hashes in ignored `.env.local`; session cookies are signed and HttpOnly. No live Firebase session is shipped to browsers.
- Profile edits, skills, links, PDF resume data, and communication preferences persist independently per account in ignored `.local-data/accounts/` files.
- Registration validation and a local registration record are implemented for the two captured open events. Registration uploads currently retain filenames, not file contents. Local registrations do not enroll anyone on HackCulture.
- Both source registrations are seeded locally, including their account-specific IDs. Existing local registrations and profile edits are preserved. Dashboard routes check account ownership; an already registered user is redirected from registration to their dashboard.
- The Chandigarh dashboard reproduces the captured presentation markup with local assets and React-controlled navigation, resource tabs, phase switching, description dialogs, copy ID, and responsive sidebar. The source gates team formation until October 4 and submissions until October 5. Those locked states are reproduced. Countdown values and phase eligibility are the captured state, not a live event clock. Team editing, actual project submission, judging, and organizer administration were inaccessible and are not claimed as reproduced. Other locally registered events receive a registration confirmation, not an invented dashboard.
- Host Program now persists inquiries to `.local-data` and displays the captured success screen. Local inquiries do not send messages or publish events. The confirmation wording is copied from the reference site; it does not imply a real team will contact the local user.
- OAuth, new-account creation, password-reset email delivery, and live event submissions require backend integrations. City/college fields accept text; remote search datasets are not mirrored.
- Layouts were compared at 1440px and 390px. This is not a claim of exact pixel equality in every state.

## Verification and setup

`scripts/check-local-accounts.mjs` checks both role logins, protected routing, captured account routes, program search and grid/table switching, dashboard tabs and mobile sidebar, profile persistence, invalid registration rejection, host form submission and persistence, desktop/mobile overflow, runtime errors, and logout. Supply `HC_STUDENT_EMAIL`, `HC_STUDENT_PASSWORD`, `HC_PRO_EMAIL`, and `HC_PRO_PASSWORD` through environment variables. It communicates only with localhost. Host tests save clearly labeled local test inquiries.

`scripts/import-dashboards.mjs` imports sanitized dashboard presentation fixtures and registration seeds from the captures. `scripts/explore-authorized.mjs` is the live inspection script; only its explicit `--submit-host` flag submits a host inquiry, so do not rerun that flag unless another live test inquiry is intended.

For a fresh checkout, run `node scripts/configure-local-accounts.mjs` with `HC_STUDENT_PASSWORD` and `HC_PRO_PASSWORD` set. It creates private hashes and a random session secret. Filesystem storage serves this workspace preview; production requires durable storage and a production identity provider.
