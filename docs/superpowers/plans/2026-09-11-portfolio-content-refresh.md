# Portfolio Content Refresh Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refresh the portfolio's positioning and evidence, add Seagulls Labs and two projects, replace the fake contact form with direct contact links, and clear the reported configuration diagnostic.

**Architecture:** Keep the existing Next.js single-page layout and painted component system. Centralize revised profile, experience, and project copy in `src/data/portfolio.ts`; make only the rendering changes needed for current dates, new categories, and a stateless contact section; protect the user-visible requirements with lightweight tests against the rendered page.

**Tech Stack:** Next.js 14, React 18, TypeScript, Tailwind CSS, Framer Motion, Node.js built-in test runner

**Spec:** `docs/superpowers/specs/2026-09-11-portfolio-content-refresh-design.md`

## Global Constraints

- Keep the existing single-page presentation and painted visual system.
- Do not add runtime dependencies, APIs, server routes, or forms.
- Remove all GPA and Dean's List references from visible content and supporting portfolio data.
- Do not use "Welcome to my portfolio," "aspiring," "in your portfolio," or "over a year of programming experience."
- Use only claims supported by the supplied worklogs or public repositories.
- Qualify localhost measurements, static test inventories, active-development work, and team outcomes.
- Use `https://www.linkedin.com/in/sahilrr/` for every LinkedIn link.
- Preserve user-owned `.next` worktree changes and never stage them.

---

### Task 1: Add rendered-page contract tests

**Files:**
- Create: `tests/portfolio-page.test.mjs`
- Modify: `package.json:6-11`

**Interfaces:**
- Consumes: The portfolio's rendered HTML at `PORTFOLIO_URL`.
- Produces: `npm run test:content`, a dependency-free smoke-test command used by all later tasks while the Next.js development server is running.

- [ ] **Step 1: Write the failing rendered-page tests**

Create `tests/portfolio-page.test.mjs`:

```js
import assert from "node:assert/strict";
import test from "node:test";

const portfolioUrl = process.env.PORTFOLIO_URL ?? "http://127.0.0.1:3100";
const response = await fetch(portfolioUrl);
assert.equal(response.ok, true, `Expected ${portfolioUrl} to respond successfully`);
const page = await response.text();

test("renders the approved professional positioning", () => {
  assert.match(page, /Software engineer building dependable full-stack and AI products\./);
  assert.doesNotMatch(page, /3\.54|dean(?:'|’)s list|welcome to my portfolio|over a year of programming experience|\baspiring\b/i);
  assert.match(page, /https:\/\/www\.linkedin\.com\/in\/sahilrr\//);
  assert.doesNotMatch(page, /linkedin\.com\/in\/sahilregonda/);
});

test("renders five experience entries in reverse chronological order", () => {
  const companies = ["Seagulls Labs", "Applied Optimal Inc.", "Inclusifai", "PashMotors", "Ontario Inc."];
  const positions = companies.map((company) => page.indexOf(company));
  positions.forEach((position, index) => assert.notEqual(position, -1, `${companies[index]} is missing`));
  assert.deepEqual([...positions].sort((a, b) => a - b), positions);
  assert.doesNotMatch(page, /estimated\s+\d+%|\(\d+\s+mos\)/i);
});

test("renders the approved six projects and links", () => {
  ["AccessiGo", "SEC Document Copilot", "SkillSnapAI", "Pathfinder Mastery", "Trial of the Knight", "Dungeon Runner"].forEach((project) => {
    assert.match(page, new RegExp(project), `${project} is missing`);
  });
  assert.match(page, /https:\/\/github\.com\/Shmy1234\/SkillSnapAI/);
  assert.match(page, /https:\/\/skill-snap-ai-theta\.vercel\.app\//);
  assert.match(page, /https:\/\/github\.com\/Shmy1234\/Pathfinder-Mastery/);
  assert.match(page, /https:\/\/pathfinder-mastery\.vercel\.app\//);
  assert.doesNotMatch(page, /pathfinding-algorithms-olive|runner-dungeon-2\.vercel\.app/i);
  assert.doesNotMatch(page, /98%|under two seconds|222.*passing backend tests/i);
});

test("renders direct contact actions without a message form", () => {
  assert.doesNotMatch(page, /<form\b|Message Sent/i);
  assert.match(page, /mailto:sahil\.regonda@mail\.utoronto\.ca/);
  assert.match(page, /https:\/\/www\.linkedin\.com\/in\/sahilrr\//);
  assert.match(page, /https:\/\/github\.com\/Shmy1234/);
});
```

- [ ] **Step 2: Add the validation command**

Add this script to `package.json`:

```json
"test:content": "node --test tests/portfolio-page.test.mjs"
```

- [ ] **Step 3: Run the tests to verify the current site violates the new contract**

Start the current app with `npm run dev -- -p 3100`, then run `npm run test:content` in a second terminal.

Expected: 4 FAIL for professional positioning, five-role experience order, six-project inventory, and contact form removal.

- [ ] **Step 4: Commit the tests**

```bash
git add tests/portfolio-page.test.mjs package.json
git commit -m "test: define portfolio content contract"
```

---

### Task 2: Remove deprecated TypeScript configuration

**Files:**
- Modify: `tsconfig.json:20`
- Modify: `tsconfig.app.json:24`
- Test: TypeScript resolved configuration and compiler output

**Interfaces:**
- Consumes: Existing `@/* -> ./src/*` path aliases.
- Produces: TypeScript configurations without `baseUrl`, preserving the same import interface.

- [ ] **Step 1: Run the focused test to confirm the diagnostic source**

Run: `./node_modules/.bin/tsc --showConfig -p tsconfig.json | rg 'baseUrl'`

Expected: output contains `"baseUrl": "./"`, confirming the diagnostic source.

- [ ] **Step 2: Remove only the two `baseUrl` properties**

Keep the mappings unchanged:

```json
"paths": {
  "@/*": ["./src/*"]
}
```

Use the existing expanded formatting in `tsconfig.json` and compact formatting in `tsconfig.app.json`.

- [ ] **Step 3: Verify aliases and configuration**

Run: `./node_modules/.bin/tsc --showConfig -p tsconfig.json | rg 'baseUrl'`

Expected: `rg` exits 1 with no output because the resolved configuration no longer contains `baseUrl`.

Run: `./node_modules/.bin/tsc --noEmit --incremental false`

Expected: exit code 0 with no alias-resolution error.

- [ ] **Step 4: Commit the configuration fix**

```bash
git add tsconfig.json tsconfig.app.json
git commit -m "fix: remove deprecated TypeScript baseUrl"
```

---

### Task 3: Rewrite profile positioning and supporting copy

**Files:**
- Modify: `src/data/portfolio.ts:53-92,271-308`
- Modify: `src/components/ScrollRevealIntro.tsx:39-74`
- Modify: `src/components/HeroSection.tsx:55-156`
- Test: `tests/portfolio-page.test.mjs`

**Interfaces:**
- Consumes: Existing `profile` fields used by the Navbar, Hero, and Contact components.
- Produces: `profile` without `gpa` or `deansList`, a current LinkedIn URL, and consistent professional positioning.

- [ ] **Step 1: Run the focused positioning test**

Run: `node --test --test-name-pattern="professional positioning" tests/portfolio-page.test.mjs`

Expected: FAIL on GPA, Dean's List, short-tenure copy, unsupported estimates, and the old LinkedIn URL.

- [ ] **Step 2: Replace the profile facts and About copy**

Use these exact values in `profile`:

```ts
degree: "B.Sc. Computer Science · Mathematics and Statistics minors",
graduation: "Expected May 2028",
email: "sahil.regonda@mail.utoronto.ca",
linkedin: "https://www.linkedin.com/in/sahilrr/",
github: "https://github.com/Shmy1234",
tagline: "Full-stack and AI engineer focused on reliable product delivery.",
intro:
  "I study Computer Science at the University of Toronto, with minors in Mathematics and Statistics, and graduate in May 2028. Across five engineering internships, I've worked on social fitness, multi-tenant SaaS, founder tools, vehicle verification, and multi-store operations.",
about: [
  "My work spans product interfaces, backend services, data contracts, permissions, integrations, testing, and ML deployment. I am most effective where those layers have to behave as one dependable system.",
  "That has meant recovering expired sessions without losing useful state, enforcing privacy rules from the API through PostgreSQL, preserving evidence in financial research, and making trained models smaller without changing their output.",
],
availability: "Open to Summer 2027 software engineering internship opportunities.",
```

Delete the `gpa` and `deansList` properties.

- [ ] **Step 3: Replace the scroll-reveal copy and Hero metadata**

In `ScrollRevealIntro.tsx`, remove the welcome eyebrow entirely and use:

```tsx
<p className="font-body text-base md:text-lg text-foreground/80 max-w-2xl mx-auto leading-relaxed">
  Software engineer building dependable full-stack and AI products. My work spans product interfaces, backend services, data contracts, testing, and ML deployment across five engineering internships.
</p>
```

In `HeroSection.tsx`, remove the GPA/Dean's List separator and value, keep location/citizenship/university, and change the secondary call to action from `Contact Me` to `Get in touch`.

- [ ] **Step 4: Rewrite supporting `chatbotKnowledge` copy**

Keep the export shape and use these exact strings; retain the existing `skills` string unchanged:

```ts
summary: `Sahil Regonda is a software engineer studying Computer Science at the University of Toronto, with minors in Mathematics and Statistics and graduation expected in May 2028. Across five engineering internships, he has worked on social fitness, multi-tenant SaaS, founder tools, vehicle verification, and multi-store operations. His work connects product interfaces, backend services, data contracts, permissions, testing, and applied AI.`,

projects: `Sahil's projects:
1. AccessiGo - A team-built entrance-image classifier with web and mobile clients. Sahil helped reduce the deployment artifact from 44.4 MB to 14.8 MB through ONNX export, checked conversion parity across eight synthetic inputs at 1e-5 tolerance, migrated serving from Flask to FastAPI, and protected saved results with private storage and PostgreSQL row-level security.
2. SEC Document Copilot - An authenticated research workspace over 25 annual filings. It combines pgvector and full-text retrieval through Reciprocal Rank Fusion, preserves financial row, period, unit, and source context, validates citations and values against registered evidence, and returns an explicit no-evidence response when support is missing.
3. SkillSnapAI - A React and TypeScript resume-analysis application that compares a PDF resume with a job description, returns structured ATS-oriented feedback, stores authenticated users' analysis history, and supports full data deletion through the Puter SDK.
4. Pathfinder Mastery - A React and TypeScript pathfinding visualizer for BFS, DFS, Dijkstra, and A* with ordered waypoints. It ports an earlier Java Swing application to the browser while preserving the algorithm behavior.
5. Trial of the Knight - A 2D platformer in Python and Pygame with a hand-built game loop, collision handling, and sprite state.
6. Dungeon Runner - A browser dungeon crawler built directly with JavaScript, HTML, CSS, DOM rendering, and canvas.`,

experience: `Sahil's professional experience:
- AI Engineering Intern at Seagulls Labs (OpenStage), Aug 2026 to present. Hardened four authenticated entry surfaces with session recovery and partial-failure preservation, reduced unnecessary initial requests in recorded local traces, and is building a replay-safe, private-first workout-completion path.
- Software Engineering Intern at Applied Optimal Inc. (ClubConnect), Jul 2026 to present. Delivered 13 initiatives through 28 merged pull requests, strengthened tenant privacy and server-authoritative roster logic, rebuilt a partial-success CSV workflow, authored 148 test declarations, and reviewed 40 pull requests. ClubConnect's launch to 100+ users is team/product context.
- Software Engineering Intern at Inclusifai, Jan to Mar 2026. Embedded Jitsi meetings, completed Google and Outlook calendar synchronization with reminders, and fixed date/time reliability with time-zone-safe parsing and a PostgreSQL migration.
- Software Engineering Intern at PashMotors (VINSecure), Oct to Dec 2025. Debugged registration, verification, camera, dashboard, and TensorFlow-assisted VIN workflows across documented browsers, environments, providers, and capture inputs.
- AI Engineering Intern at Ontario Inc., Sep 2024 to Feb 2025. Built shared operations workflows across 5+ stores, co-led a DoorDash integration, standardized Linux/Bash operations, and added Jest, Pytest, and Playwright coverage.`,

contact: `You can reach Sahil at:
- Email: sahil.regonda@mail.utoronto.ca
- LinkedIn: linkedin.com/in/sahilrr
- GitHub: github.com/Shmy1234
He is open to Summer 2027 software engineering internship opportunities.`,

education: `Sahil is pursuing a B.Sc. in Computer Science at the University of Toronto, with minors in Mathematics and Statistics and graduation expected in May 2028. Relevant coursework includes Data Structures and Algorithms, Object-Oriented Programming, Software Engineering, Computer Architecture, Databases, Artificial Intelligence, Machine Learning, and Deep Learning.`,
```

- [ ] **Step 5: Re-run the focused positioning test**

Run: `node --test --test-name-pattern="professional positioning" tests/portfolio-page.test.mjs`

Expected: PASS.

- [ ] **Step 6: Commit the positioning update after the content test passes**

```bash
git add src/data/portfolio.ts src/components/ScrollRevealIntro.tsx src/components/HeroSection.tsx
git commit -m "feat: strengthen portfolio positioning"
```

---

### Task 4: Add Seagulls and tighten all experience entries

**Files:**
- Modify: `src/data/portfolio.ts:22-42,169-253`
- Modify: `src/components/ExperienceSection.tsx:88-105`
- Test: `tests/portfolio-page.test.mjs`

**Interfaces:**
- Consumes: `Experience` fields `id`, `title`, `company`, optional `location`, `startDate`, `endDate`, `headline`, `description`, optional `teamNote`, and optional `skills`.
- Produces: Five reverse-chronological experience cards with no stale `duration` field.

- [ ] **Step 1: Run the focused experience test**

Run: `node --test --test-name-pattern="experience entries" tests/portfolio-page.test.mjs`

Expected: FAIL because Seagulls is missing and duration values remain.

- [ ] **Step 2: Remove duration from the type and renderer**

Delete `duration` from `Experience` and any nested sub-role contract. Render only:

```tsx
<span className="text-xs font-medium px-2 py-1 rounded-full bg-paint-gold/20 text-paint-navy">
  {experience.startDate} - {experience.endDate}
</span>
```

- [ ] **Step 3: Replace the experience array with five concise entries**

Use the approved order and these evidence-backed contents:

```ts
{
  id: "seagulls-labs",
  title: "AI Engineering Intern",
  company: "Seagulls Labs — OpenStage",
  location: "Remote",
  startDate: "Aug 25, 2026",
  endDate: "Present",
  headline: "Improving reliable entry and workout completion for a privacy-aware social fitness platform.",
  description: [
    "Hardened four authenticated entry surfaces with expired-session recovery, in-place retries, and partial-failure preservation so useful content remains available when a secondary request fails.",
    "Deferred Gym history and statistics and scoped Settings requests to the screens that use them, removing up to 12 unnecessary initial catalog requests in recorded local traces; cold and warm localhost p95 remained below 1.3 seconds across 200 loads.",
    "Built an active-development workout-completion path with atomic validation, version checks, replay-safe receipts, autosave coordination, and private-first persistence so optional social delivery does not block private progress.",
  ],
  skills: ["TypeScript", "React", "Next.js", "Node.js", "Supabase", "PostgreSQL", "Vitest", "Playwright"],
}
```

Follow the Seagulls object with these exact entries:

```ts
{
  id: "applied-optimal",
  title: "Software Engineering Intern",
  company: "Applied Optimal Inc. — ClubConnect",
  location: "Remote",
  startDate: "Jul 2026",
  endDate: "Present",
  headline: "Shipping membership, roster, activity, and permission workflows for a multi-tenant club-management platform.",
  description: [
    "Delivered 13 initiatives through 28 merged pull requests across the Flutter client, FastAPI services, PostgreSQL migrations, and Supabase policies.",
    "Protected birth dates and tenant data through role-aware APIs, row-level security, and server-authoritative age filtering, including leap-day and time-zone handling.",
    "Rebuilt roster import and export around a five-field CSV contract with normalization, partial-success imports, row-level errors, duplicate and race handling, legacy-record checks, and formula-safe exports.",
    "Authored 148 automated test declarations and reviewed 40 pull requests across 25 work items, checking permissions, migrations, imports, API contracts, and interface behavior.",
  ],
  teamNote: "Team/product context: ClubConnect launched to 100+ users during this period.",
  skills: ["Flutter", "Dart", "FastAPI", "Python", "Supabase", "PostgreSQL", "RLS/RBAC", "Docker", "GitHub Actions", "Pytest", "Jira"],
},
{
  id: "inclusifai",
  title: "Software Engineering Intern",
  company: "Inclusifai",
  location: "Toronto, Ontario",
  startDate: "Jan 2026",
  endDate: "Mar 2026",
  headline: "Brought meetings, calendars, reminders, and reliable date handling into the founder funding workflow.",
  description: [
    "Embedded Jitsi meetings inside funding-opportunity cards with one-click join, link sharing, lifecycle cleanup, and return-to-opportunity behavior.",
    "Completed Google and Outlook OAuth calendar synchronization with scheduled reminders and integration testing across stored meetings, tasks, and deadlines.",
    "Eliminated one-day deadline drift with time-zone-safe parsing and a PostgreSQL DATE-to-TIMESTAMP migration; stabilized calendar controls, state restoration, and API errors.",
  ],
  skills: ["TypeScript", "React", "PostgreSQL", "Supabase", "Jitsi", "OAuth 2.0", "Google Calendar API", "Microsoft Outlook API", "Jest"],
},
{
  id: "pash-motors",
  title: "Software Engineering Intern",
  company: "PashMotors — VINSecure",
  location: "Remote",
  startDate: "Oct 2025",
  endDate: "Dec 2025",
  headline: "Improved the reliability of vehicle registration, verification, camera capture, and VIN workflows.",
  description: [
    "Debugged registration, camera, and dashboard failures across five browsers and five documented device and operating-system environments, contributing JavaScript, Node.js, and responsive interface fixes.",
    "Tested verification with four email providers and traced provider-specific failures across frontend state, provider behavior, and API responses.",
    "Investigated TensorFlow-assisted VIN failures with at least 10 text inputs and 10 images, isolating capture, preprocessing, inference, and API issues and retesting fixes before the shared MVP release.",
  ],
  skills: ["JavaScript", "Node.js", "HTML", "CSS", "TensorFlow", "Jest", "Playwright", "PageSpeed", "QA"],
},
{
  id: "ontario-inc",
  title: "AI Engineering Intern",
  company: "Ontario Inc.",
  location: "Windsor, Ontario",
  startDate: "Sep 2024",
  endDate: "Feb 2025",
  headline: "Built shared operational workflows for paperwork, inventory, schedules, and delivery orders across 5+ stores.",
  description: [
    "Built React and TypeScript interfaces with FastAPI and PostgreSQL services for paperwork, inventory, schedules, orders, and multi-location records.",
    "Co-led a DoorDash API integration with another developer, connecting delivery-order data to React and PostgreSQL tablet workflows with validation, error handling, and end-to-end tests.",
    "Standardized service startup, recurring jobs, configuration, logs, permissions, and diagnostics with Linux and Bash.",
    "Added Jest, Pytest, and Playwright coverage around order, inventory, schedule, and tablet workflows while keeping manager review in front of AI-assisted decisions.",
  ],
  skills: ["React", "TypeScript", "FastAPI", "PostgreSQL", "Python", "Node.js", "LangChain", "LangGraph", "Linux", "Bash", "Jest", "Pytest", "Playwright"],
},
```

- [ ] **Step 4: Run the experience test**

Run: `node --test --test-name-pattern="experience entries" tests/portfolio-page.test.mjs`

Expected: PASS.

- [ ] **Step 5: Commit the experience refresh**

```bash
git add src/data/portfolio.ts src/components/ExperienceSection.tsx
git commit -m "feat: add Seagulls experience"
```

---

### Task 5: Expand and correct the project portfolio

**Files:**
- Modify: `src/data/portfolio.ts:6-20,94-167,280-285`
- Modify: `src/components/ProjectsSection.tsx:6-10`
- Test: `tests/portfolio-page.test.mjs`

**Interfaces:**
- Consumes: Existing `Project` card contract.
- Produces: Six ordered projects and a new `algorithms` category label.

- [ ] **Step 1: Run the focused project test**

Run: `node --test --test-name-pattern="six projects" tests/portfolio-page.test.mjs`

Expected: FAIL because SkillSnapAI and Pathfinder Mastery are missing.

- [ ] **Step 2: Extend the category union and labels**

Use:

```ts
category: "ai" | "ml" | "algorithms" | "game";
```

and:

```ts
const CATEGORY_LABEL: Record<Project["category"], string> = {
  ai: "AI Engineering",
  ml: "Machine Learning",
  algorithms: "Algorithms",
  game: "Game",
};
```

- [ ] **Step 3: Correct AccessiGo and SEC Document Copilot**

Replace the two featured project objects with:

```ts
{
  id: "accessigo",
  title: "AccessiGo",
  blurb: "A shared web and mobile system for classifying entrance images.",
  description:
    "AccessiGo is a team project that distinguishes entrance doors from non-entrance doors and serves results to React and React Native clients. It provides entrance information; it does not certify accessibility, safety, legal compliance, or current availability.\n\nI helped move the service from Flask/WSGI to FastAPI/ASGI, moved image preprocessing into memory, reused the inference session, and separated stateless scoring from authenticated persistence. Exporting the TensorFlow model to ONNX reduced the artifact from 44.4 MB to 14.8 MB, with an eight-input synthetic parity gate at 1e-5 tolerance before deployment.",
  github: "https://github.com/AccessiGo/AccessiGo",
  year: "2026",
  category: "ml",
  tags: ["Python", "TensorFlow", "ONNX", "FastAPI", "React", "React Native", "PostgreSQL", "Supabase"],
  metrics: [
    { value: "67%", label: "smaller model artifact" },
    { value: "8", label: "synthetic parity inputs" },
    { value: "230", label: "documented test cases" },
  ],
  highlights: [
    "Preserved the upload contract while migrating Flask/WSGI serving to FastAPI/ASGI for the existing web and mobile clients",
    "Kept scoring stateless while protecting saved photos and results with Supabase authentication, private storage, signed URLs, and PostgreSQL row-level security",
    "Documented 230 test cases across inference, uploads, authentication, clients, APIs, and end-to-end workflows; this is a static inventory, not a fresh passing run",
  ],
  priority: 1,
},
{
  id: "sec-document-copilot",
  title: "SEC Document Copilot",
  blurb: "A filings research assistant that cites its sources or reports that evidence is missing.",
  description:
    "SEC Document Copilot is an authenticated research workspace over 25 annual filings from Apple, Microsoft, NVIDIA, Amazon, and Alphabet. It keeps search, source inspection, citations, financial context, and saved research in one place.\n\nDeterministic SEC ingestion preserves financial row labels, reporting periods, units, source locations, and artifact provenance. Retrieval combines pgvector semantic search with PostgreSQL full-text search through Reciprocal Rank Fusion, while registered evidence, citation and value checks, one bounded retry, and an explicit no-evidence fallback keep unsupported answers out of the result.",
  github: "https://github.com/Shmy1234/SEC-Document-Copilot",
  year: "2026",
  category: "ai",
  tags: ["Python", "FastAPI", "LangGraph", "LangChain", "PostgreSQL", "pgvector", "Supabase", "React", "TypeScript"],
  metrics: [
    { value: "25", label: "official annual filings" },
    { value: "4", label: "bounded execution routes" },
  ],
  highlights: [
    "Preserved row, period, unit, source, and artifact context through deterministic SEC EDGAR ingestion and financial-table extraction",
    "Combined semantic and exact-term retrieval with metadata filters and neighboring context",
    "Limited deep runs to six model requests and eight tool calls, with one grounding retry before a no-evidence response",
    "Protected saved research with Supabase JWT validation and row-level access controls",
  ],
  priority: 2,
},
```

- [ ] **Step 4: Add SkillSnapAI and Pathfinder Mastery before the two games**

Use these objects:

```ts
{
  id: "skillsnap-ai",
  title: "SkillSnapAI",
  blurb: "Resume analysis and ATS-oriented feedback matched to a target role.",
  description:
    "SkillSnapAI accepts a PDF resume and job description, then returns structured feedback on alignment, keywords, readability, tone, and ATS compatibility. Authenticated users can review earlier analyses, preview uploaded resumes, and delete their stored files and records.",
  github: "https://github.com/Shmy1234/SkillSnapAI",
  liveUrl: "https://skill-snap-ai-theta.vercel.app/",
  year: "2025",
  category: "ai",
  tags: ["React", "TypeScript", "Remix", "Tailwind CSS", "Puter SDK", "PDF Processing"],
  priority: 3,
},
{
  id: "pathfinder-mastery",
  title: "Pathfinder Mastery",
  blurb: "An interactive comparison of BFS, DFS, Dijkstra, and A*.",
  description:
    "A pathfinding visualizer with ordered waypoints, segment-by-segment routes, coordinate controls, undo, and restart. The browser version ports the original Java Swing application to React and TypeScript while preserving the algorithms and interaction model.",
  github: "https://github.com/Shmy1234/Pathfinder-Mastery",
  liveUrl: "https://pathfinder-mastery.vercel.app/",
  year: "2026",
  category: "algorithms",
  tags: ["React", "TypeScript", "Java", "Vite", "Graph Algorithms"],
  highlights: [
    "Implemented BFS and DFS for unweighted traversal alongside Dijkstra and A* for shortest-path comparison",
    "Supports ordered waypoints and draws each path segment in sequence",
    "Maintains both the original Java desktop version and a browser deployment",
  ],
  priority: 4,
},
```

Set Trial of the Knight and Dungeon Runner priorities to 5 and 6. Keep their descriptions concise.

- [ ] **Step 5: Run the project and positioning tests**

Run: `node --test --test-name-pattern="six projects|professional positioning" tests/portfolio-page.test.mjs`

Expected: PASS.

- [ ] **Step 6: Commit the project expansion**

```bash
git add src/data/portfolio.ts src/components/ProjectsSection.tsx
git commit -m "feat: expand portfolio to six projects"
```

---

### Task 6: Replace the simulated contact form

**Files:**
- Modify: `src/components/ContactSection.tsx:1-320`
- Test: `tests/portfolio-page.test.mjs`

**Interfaces:**
- Consumes: `profile.email`, `profile.linkedin`, `profile.github`, and `profile.availability`.
- Produces: A stateless `#contact` section with three direct actions.

- [ ] **Step 1: Run the focused contact test**

Run: `node --test --test-name-pattern="direct contact" tests/portfolio-page.test.mjs`

Expected: FAIL because the component contains a form, artificial delay, console log, and false success message.

- [ ] **Step 2: Replace the component with a stateless direct-contact layout**

Keep only these imports:

```tsx
import { motion } from "framer-motion";
import { Mail, Linkedin, Github } from "lucide-react";
import { profile } from "@/data/portfolio";
```

Render the existing section heading and background decoration, followed by one `max-w-3xl` painted card containing an introductory sentence and a responsive three-link grid. The links must be:

```tsx
<a href={`mailto:${profile.email}`}>...</a>
<a href={profile.linkedin} target="_blank" rel="noopener noreferrer">...</a>
<a href={profile.github} target="_blank" rel="noopener noreferrer">...</a>
```

Use visible labels `Email me`, `LinkedIn`, and `GitHub`. End with `profile.availability`. Do not render inputs, a submit button, toast state, or delivery confirmation.

- [ ] **Step 3: Run the focused contact test**

Run: `node --test --test-name-pattern="direct contact" tests/portfolio-page.test.mjs`

Expected: PASS.

- [ ] **Step 4: Commit the contact correction**

```bash
git add src/components/ContactSection.tsx
git commit -m "fix: replace simulated contact form"
```

---

### Task 7: Verify content, build, links, and responsive presentation

**Files:**
- Modify if verification finds an issue: files already listed above only
- Test: `tests/portfolio-page.test.mjs`

**Interfaces:**
- Consumes: Completed content and component changes.
- Produces: Verified production build and responsive page.

- [ ] **Step 1: Run the complete content contract**

Run: `npm run test:content`

Expected: 4 tests pass, 0 fail.

- [ ] **Step 2: Run TypeScript and whitespace checks**

Run: `./node_modules/.bin/tsc --noEmit --incremental false`

Expected: exit code 0.

Run: `git diff --check`

Expected: no output.

- [ ] **Step 3: Build the production application**

Run: `npm run build`

Expected: Next.js build completes successfully.

- [ ] **Step 4: Verify the external worklog diagnostic source**

Run:

```bash
awk 'BEGIN{blank=0} /^[[:space:]]*$/{if(blank){print FNR ": consecutive blank"}; blank=1; next} {blank=0}' /Users/shmy/Downloads/Worklog/01_Seagulls_Labs_OpenStage.md
```

Expected: no output. If VS Code still displays MD012, save or reload the editor buffer; do not add a global suppression.

- [ ] **Step 5: Check public project and demo links**

Run `curl -IL --max-time 20` against all six repository URLs and each configured `liveUrl`. Remove a configured demo link if its deployment is retired and no working canonical replacement exists.

Expected: every URL resolves to an HTTP success or redirect response without DNS or connection failure.

- [ ] **Step 6: Review desktop and mobile rendering**

Start the app with `npm run dev`, then inspect the page at desktop and 390px mobile widths. Confirm:

- Seagulls Labs is the first of five experience cards.
- Exactly six project cards render in the approved order.
- Long SkillSnapAI and Pathfinder content does not overflow.
- `Get in touch` scrolls to the direct-contact panel.
- Email, LinkedIn, GitHub, source, and live-demo links have the expected destinations.
- No form or false delivery confirmation is present.

- [ ] **Step 7: Run the final contract once more and commit any verification fixes**

Run: `npm run test:content && ./node_modules/.bin/tsc --noEmit --incremental false && git diff --check`

Expected: all commands pass.

If verification required a correction:

```bash
git add tests/portfolio-page.test.mjs package.json tsconfig.json tsconfig.app.json src/data/portfolio.ts src/components/ScrollRevealIntro.tsx src/components/HeroSection.tsx src/components/ExperienceSection.tsx src/components/ProjectsSection.tsx src/components/ContactSection.tsx
git commit -m "fix: address portfolio verification findings"
```
