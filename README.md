# HackCulture recreation

A Next.js App Router, TypeScript, Tailwind CSS, and shadcn/ui recreation of the public HackCulture website, inspected on September 30, 2026.

## Run locally

```sh
npm install
npm run dev -- --port 3100
```

Open http://localhost:3100. Port 3100 avoids another application already running on port 3000 in this workspace environment.

```sh
npm run typecheck
npm run build
npm start -- --port 3100
```

## Coverage

[SITE_MAP.md](SITE_MAP.md) lists every discovered public page: 75 routes, including the homepage, programs directory, offerings overview and all five offerings, clients, blog and five articles, three legal pages, Host Program, sign-in/password reset, and 54 program detail pages. Singular program URLs and common client/host aliases redirect to the canonical routes. Registration routes preserve the source site's sign-in gate.

The navigation, mobile menu, dropdowns, program search/category/status/sort controls, pagination, blog category filters, testimonials, FAQs, program section navigation, share links, signup/password visibility, cookie preference persistence, and Host Program form are implemented locally.

The original typography, images, decorative SVGs, public layout markup, responsive Tailwind classes, and stylesheet are stored locally. No original JavaScript, analytics, authentication SDK, or remote API is executed by the app. Calendly, social profiles, map links, the ecosystem link, and the externally published article retain their external destinations.

## Source structure

- `src/app`: App Router entry points, metadata, route aliases, loading and not-found UI.
- `src/components`: React navigation, forms, program controls, and interactive components.
- `src/components/ui`: shadcn-style Button and Radix Dialog primitives.
- `src/content/pages`: sanitized public presentation content, rendered into React elements on the server. These are build-time content fixtures, not remote pages or iframes.
- `src/lib/content.tsx`: shared content renderer, internal Next.js links, footer, and interactive component slots.
- `public/assets` and `public/reference.css`: self-hosted visual assets, fonts, and source design rules.
- `scripts/import-content.mjs`: reproducible content sanitization/import from the ignored reference captures.

The development server and production build use separate output directories so they can run without overwriting one another.

## Validation

```sh
npm run test:smoke
node scripts/verify.mjs
```

Browser scripts use Playwright with Microsoft Edge and default to the local app on port 3100. Set `BASE_URL` to change the smoke-test target. The smoke suite exercises the principal interactions and checks all 75 public routes. Visual checks capture desktop (1440px) and mobile (390px) screenshots and report horizontal overflow, broken images, and browser errors in `test-results/`.

## Integration boundaries

Both supplied accounts now sign in locally with signed HttpOnly sessions and privately configured password hashes. Profiles, four-step onboarding, role-specific professional fields, preferences, My Programs, account menus, and two registration forms are implemented. See [ACCOUNT_SCREENS.md](ACCOUNT_SCREENS.md) for the inspected route inventory, setup, and verification.

Account changes persist locally and never modify HackCulture. Both supplied accounts include their observed Chandigarh registration and program dashboard: phases, resources, team formation gates, submission phase selection, description dialogs, and event schedules. My Programs includes search, sorting, filters, and grid/table views. Host Program saves an inquiry locally and shows the captured confirmation screen. Registration uploads currently retain filenames only.

The live site had not opened team formation or submissions during inspection, so their locked states are reproduced. Unavailable team editing, project submission, organizer administration, and other events' post-registration dashboards are not claimed as copied. OAuth, new-account creation, reset email delivery, and live submissions still require backend integrations. One explicitly labeled hosting test inquiry was accepted by the live site during inspection; details and boundaries are in `ACCOUNT_SCREENS.md`.

Program dates, participant counts, and content are the captured reference state. This is a faithful public frontend recreation, not a live synchronization with HackCulture's backend. Animated positions and external widgets can differ from a particular moment on the live site.
