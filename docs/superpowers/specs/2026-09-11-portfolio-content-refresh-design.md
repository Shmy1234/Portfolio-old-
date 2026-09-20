# Portfolio Content Refresh Design

## Objective

Revise Sahil Regonda's portfolio so it presents an experienced, credible software-engineering profile; reflects the supplied work records; includes current Seagulls Labs experience and six projects; removes the nonfunctional contact form; and clears the reported VS Code diagnostics without changing the site's established visual identity.

## Product Direction

Keep the existing single-page presentation and painted visual system. Improve the editorial hierarchy and accuracy rather than rebuilding the interface. The page remains:

`Intro -> About -> Experience -> Projects -> Contact`

The content should lead with delivered engineering work, name concrete systems and responsibilities, and distinguish individual contributions from team outcomes. It must not describe Sahil as "aspiring," quantify his career using "over a year," or introduce claims that are not supported by the supplied worklogs or public project repositories.

## Global Copy Rules

- Remove all GPA and Dean's List references from visible content and supporting portfolio data.
- Use concise, professional first-person copy in the intro and About section.
- Prefer specific scope and implementation details over adjectives such as "innovative," "passionate," or "cutting-edge."
- Do not state estimated improvements as measured results.
- Qualify localhost measurements, static test inventories, and team-level outcomes where they are retained.
- Do not claim that AccessiGo certifies accessibility, safety, legal compliance, or current entrance availability.
- Do not claim a confirmed OpenStage launch, production performance gain, retention result, or deployed workout-completion work.
- Do not use the phrases "Welcome to my portfolio," "aspiring," "in your portfolio," or "over a year of programming experience."
- Update LinkedIn everywhere to `https://www.linkedin.com/in/sahilrr/`.

## Intro and About

The opening screen will replace the current generic welcome and short-tenure framing with a direct professional statement:

> Software engineer building dependable full-stack and AI products. My work spans product interfaces, backend services, data contracts, testing, and ML deployment across five engineering internships.

The profile tagline will reinforce the same position without repeating the sentence verbatim. Recommended direction:

> Full-stack and AI engineer focused on reliable product delivery.

The About copy will identify Sahil as a University of Toronto Computer Science student with Mathematics and Statistics minors, graduating in May 2028. It will summarize experience across Seagulls Labs, Applied Optimal, Inclusifai, PashMotors, and Ontario Inc., then explain the recurring strength across that work: making multi-layer workflows dependable across interfaces, APIs, databases, permissions, integrations, and tests.

The About section will use two or three short paragraphs. It will not lead with student status, GPA, awards, or a time-in-industry calculation.

## Experience

Experience entries will appear in reverse chronological order:

1. Seagulls Labs - AI Engineering Intern, Aug 25, 2026 to present
2. Applied Optimal Inc. - Software Engineering Intern, Jul 2026 to present
3. Inclusifai - Software Engineering Intern, Jan 2026 to Mar 2026
4. PashMotors - Software Engineering Intern, Oct 2025 to Dec 2025
5. Ontario Inc. - AI Engineering Intern, Sep 2024 to Feb 2025

Hard-coded duration strings will be removed from the data contract and presentation because they become stale while current roles remain active. Each card will contain a one-sentence impact headline and three or four concise bullets.

### Seagulls Labs

The entry will describe OpenStage as a privacy-aware social-fitness platform and cover:

- Resilient entry across four authenticated surfaces through expired-session recovery, in-place retry, and preservation of useful content during partial failures.
- Deferred and screen-scoped requests that removed up to 12 unnecessary initial catalog requests in recorded local traces, with cold and warm localhost p95 below 1.3 seconds across 200 loads.
- A workout-completion path using atomic validation, version checks, replay-safe receipts, and private-first persistence, explicitly described as active development rather than shipped production behavior.

### Applied Optimal

The entry will emphasize 13 initiatives and 28 merged pull requests, privacy-preserving age and roster logic, a five-field CSV import/export contract with partial-success behavior, and 148 authored test declarations plus 40 reviewed pull requests. The product's 100+ users will remain clearly labeled as team/product scope.

### Inclusifai

The entry will cover embedded Jitsi meetings, Google and Outlook OAuth calendar synchronization, scheduled reminders, and the time-zone-safe `DATE`-to-`TIMESTAMP` migration. Unsupported setup-time, automation, reliability, and missed-deadline percentages will be removed.

### PashMotors

The entry will cover registration, camera, dashboard, provider-specific verification, and TensorFlow-assisted VIN pipeline debugging across documented browsers, environments, text inputs, and images. Unsupported performance, accuracy, turnaround-time, and defect-ownership claims will be removed.

### Ontario Inc.

The entry will cover shared operational workflows across 5+ stores, the co-led DoorDash integration, Linux/Bash operational automation, and Jest/Pytest/Playwright coverage. Unsupported paperwork and review-time percentages will be removed.

## Projects

The Projects section will contain exactly six entries in this order:

1. AccessiGo
2. SEC Document Copilot
3. SkillSnapAI
4. Pathfinder Mastery
5. Trial of the Knight
6. Dungeon Runner

The `Project` category model and category-label map will support a suitable label for algorithm visualization in addition to the existing AI, ML, and game labels. Six cards will continue to use the existing responsive grid. AccessiGo and SEC Document Copilot remain the most detailed case studies; the other four use shorter descriptions appropriate to their scope.

### AccessiGo

Describe a team-built entrance-image classifier with React and React Native clients, FastAPI serving, ONNX Runtime inference, authenticated persistence, private storage, and row-level security. Replace unsupported 98% accuracy and sub-two-second claims with the verified artifact reduction from 44.4 MB to 14.8 MB, approximately 67%, and identify the eight-input `1e-5` check as conversion parity rather than real-image accuracy. Describe 230 tests as a documented static inventory, not a fresh passing result.

### SEC Document Copilot

Describe the authenticated workspace over 25 annual filings, hybrid pgvector and full-text retrieval with Reciprocal Rank Fusion, deterministic financial-table extraction, registered evidence, citation/value checks, and explicit no-evidence behavior. Omit the 222-test result because the worklog marks it as version-qualified until tied to a branch and run artifact.

### SkillSnapAI

Describe a resume-analysis web application that accepts a PDF and job description, produces structured ATS-oriented feedback, stores authenticated users' resume analyses, provides preview/history screens, and supports full user-controlled data deletion. Use repository-supported technologies: React, TypeScript, Remix, Tailwind CSS, Puter SDK storage/authentication/feedback, and PDF-to-image processing. Include:

- Source: `https://github.com/Shmy1234/SkillSnapAI`
- Live application: `https://skill-snap-ai-theta.vercel.app/`
- Year: 2025

Do not invent accuracy, placement, user, or hiring-outcome metrics.

### Pathfinder Mastery

Describe a pathfinding visualizer implementing BFS, DFS, Dijkstra, and A* with ordered waypoints and animated grid exploration. Note that the browser version ports the original Java Swing application to React and TypeScript while preserving algorithm behavior. Include:

- Source: `https://github.com/Shmy1234/Pathfinder-Mastery`
- Live application: `https://pathfinder-mastery.vercel.app/`
- Year: 2026

Do not invent educational-effectiveness or runtime-performance results.

### Older Games

Retain Trial of the Knight and Dungeon Runner as concise early projects. Their descriptions will focus on hand-built loops, collision/state behavior, procedural mazes, DOM/canvas rendering, and their respective Python/Pygame or JavaScript/HTML/CSS stacks. They will not compete visually with the two featured technical case studies.

## Contact

The current form is nonfunctional: submission waits locally, writes data to the browser console, and displays a success message without sending anything. Remove the form, its validation schema, local state, artificial delay, logging, and success/error notifications.

Retain the `#contact` section and navigation link. Replace the two-column form layout with a centered direct-contact panel containing:

- A `mailto:` link for `sahil.regonda@mail.utoronto.ca`
- LinkedIn at `https://www.linkedin.com/in/sahilrr/`
- GitHub at `https://github.com/Shmy1234`
- A concise statement that Sahil is open to 2027 software-engineering internship opportunities

The Hero contact call to action will continue to point to this section, with wording such as "Get in touch."

## VS Code Diagnostics

### TypeScript `baseUrl`

The reported TypeScript diagnostic points to `baseUrl` in `tsconfig.json`. The project also contains the same unnecessary option in `tsconfig.app.json`. The `@/*` mapping already uses `./src/*`, so remove `baseUrl` from both files and retain the `paths` mapping. Verify that TypeScript and the Next.js production build still resolve `@/` imports.

### Markdown MD012

The saved `/Users/shmy/Downloads/Worklog/01_Seagulls_Labs_OpenStage.md` currently contains no consecutive blank lines, and its final content line is line 43. The screenshot shows a line-45 warning, which indicates that VS Code was displaying an older or unsaved editor state. No content edit is currently required. Re-open or reload the saved file after implementation and verify the diagnostic clears; do not suppress MD012 globally.

## Data and Component Boundaries

- `src/data/portfolio.ts` remains the single content source for profile, projects, experience, and supporting knowledge text.
- `src/components/ScrollRevealIntro.tsx` renders the opening positioning statement.
- `src/components/HeroSection.tsx` renders profile facts, About copy, and calls to action without GPA or Dean's List.
- `src/components/ExperienceSection.tsx` renders five evidence-backed entries without hard-coded durations.
- `src/components/ProjectsSection.tsx` renders six projects and the expanded category labels.
- `src/components/ContactSection.tsx` becomes a stateless direct-contact section.
- `tsconfig.json` and `tsconfig.app.json` retain aliases without `baseUrl`.

No new runtime dependencies, APIs, server routes, or forms will be introduced.

## Error Handling and Accessibility

Removing the fake form removes a misleading success state and eliminates a silent data-loss path. Direct links use native browser and mail-client behavior. External links will retain `target="_blank"` with `rel="noopener noreferrer"`, and visible link names will remain understandable without their icons. Existing motion and responsive patterns will be preserved.

## Verification and Acceptance Criteria

- TypeScript checking succeeds with both `baseUrl` declarations removed.
- `npm run build` succeeds.
- The rendered page contains five experience entries, with Seagulls Labs first.
- The rendered page contains exactly six projects, including SkillSnapAI and Pathfinder Mastery with correct source links.
- Pathfinder Mastery and SkillSnapAI expose their verified live links; Dungeon Runner does not expose its retired 404 deployment.
- No source or rendered copy contains GPA, Dean's List, "aspiring," "Welcome to my portfolio," or "over a year of programming experience."
- No contact form, artificial submission delay, browser-console submission, or false success message remains.
- Every LinkedIn link uses `https://www.linkedin.com/in/sahilrr/`.
- AccessiGo and internship claims match the supplied evidence boundaries.
- Desktop and mobile browser review confirms readable cards, valid section navigation, and no obvious overflow or layout regression.
- All six repository URLs and both verified live-demo URLs resolve successfully.
- The saved Seagulls worklog still has no MD012 violation.

## Out of Scope

- Replacing the painted visual theme or rebuilding the page layout
- Adding a real contact backend or third-party form service
- Editing LinkedIn itself
- Claiming release, production, revenue, adoption, or performance outcomes not supported by the supplied records
- Rewriting the external worklogs, which are evidence sources rather than portfolio copy
