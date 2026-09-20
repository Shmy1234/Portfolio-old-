export interface ProjectMetric {
  value: string;
  label: string;
}

export interface Project {
  id: string;
  title: string;
  /** One-line hook shown under the title. */
  blurb: string;
  description: string;
  github?: string;
  liveUrl?: string;
  year: string;
  category: "ai" | "ml" | "algorithms" | "game";
  tags: string[];
  metrics?: ProjectMetric[];
  highlights?: string[];
  priority: number;
}

export interface Experience {
  id: string;
  title: string;
  company: string;
  location?: string;
  startDate: string;
  endDate: string;
  /** One sentence of impact, shown above the bullets. */
  headline: string;
  description: string[];
  /** Context that belongs to the team, not to me. Rendered as a footnote. */
  teamNote?: string;
  skills?: string[];
  subRoles?: {
    title: string;
    startDate: string;
    endDate: string;
  }[];
}

export interface Award {
  id: string;
  title: string;
  type: 'award' | 'certificate';
  issuer?: string;
  date?: string;
  description?: string;
}

export const profile = {
  name: "Sahil Regonda",
  location: "Toronto, Ontario",
  citizenship: "USA & Canada",
  university: "University of Toronto",
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
  skillCategories: [
    {
      category: "Languages",
      items: ["Python", "TypeScript", "JavaScript", "Java", "C++", "C", "SQL", "HTML/CSS"],
    },
    {
      category: "Frameworks & Libraries",
      items: ["React", "React Native", "Next.js", "Flutter", "FastAPI", "Node.js", "Express.js", "TensorFlow", "ONNX", "Pydantic"],
    },
    {
      category: "Databases, APIs & Platforms",
      items: ["PostgreSQL", "Supabase", "pgvector", "Redis", "OpenAI API", "Google Calendar API", "Microsoft Outlook API", "Jitsi"],
    },
    {
      category: "Developer & Testing Tools",
      items: ["Git", "GitHub", "GitHub Actions", "Docker", "Linux", "Jest", "Pytest", "Playwright", "Jira", "VS Code", "Cursor"],
    },
  ],
};

export const projects: Project[] = [
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
  {
    id: "trial-of-knight",
    title: "Trial of the Knight",
    blurb: "A 2D platformer in Python and Pygame.",
    description:
      "A knight moves through shifting magic terrain, traps, and room puzzles. Written without an engine, so the game loop, collision handling, and sprite state machines are all hand-rolled.",
    github: "https://github.com/Shmy1234/Trial-of-The-Knight-2",
    year: "2023",
    category: "game",
    tags: ["Python", "Pygame"],
    priority: 5,
  },
  {
    id: "dungeon-runner",
    title: "Dungeon Runner",
    blurb: "A dungeon crawler running on plain HTML, CSS, and JavaScript.",
    description:
      "Procedural mazes and puzzles with no framework and no build step. Rendering, input handling, and level state are written directly against the DOM and canvas.",
    github: "https://github.com/Shmy1234/Runner-Dungeon-2",
    year: "2023",
    category: "game",
    tags: ["JavaScript", "HTML", "CSS"],
    priority: 6,
  },
];

export const experiences: Experience[] = [
  {
    id: "seagulls-labs",
    title: "AI Engineering Intern",
    company: "Seagulls Labs — OpenStage",
    location: "Remote",
    startDate: "Aug 25, 2026",
    endDate: "Present",
    headline:
      "Improving reliable entry and workout completion for a privacy-aware social fitness platform.",
    description: [
      "Hardened four authenticated entry surfaces with expired-session recovery, in-place retries, and partial-failure preservation so useful content remains available when a secondary request fails.",
      "Deferred Gym history and statistics and scoped Settings requests to the screens that use them, removing up to 12 unnecessary initial catalog requests in recorded local traces; cold and warm localhost p95 remained below 1.3 seconds across 200 loads.",
      "Built an active-development workout-completion path with atomic validation, version checks, replay-safe receipts, autosave coordination, and private-first persistence so optional social delivery does not block private progress.",
    ],
    skills: ["TypeScript", "React", "Next.js", "Node.js", "Supabase", "PostgreSQL", "Vitest", "Playwright"],
  },
  {
    id: "applied-optimal",
    title: "Software Engineering Intern",
    company: "Applied Optimal Inc. — ClubConnect",
    location: "Remote",
    startDate: "Jul 2026",
    endDate: "Present",
    headline:
      "Shipping membership, roster, activity, and permission workflows for a multi-tenant club-management platform.",
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
    title: "Software Engineer Intern",
    company: "Inclusifai",
    location: "Toronto, Ontario",
    startDate: "Jan 2026",
    endDate: "Mar 2026",
    headline:
      "Brought meetings, calendars, reminders, and reliable date handling into the founder funding workflow.",
    description: [
      "Embedded Jitsi meetings inside funding-opportunity cards with one-click join, link sharing, lifecycle cleanup, and return-to-opportunity behavior.",
      "Completed Google and Outlook OAuth calendar synchronization with scheduled reminders and integration testing across stored meetings, tasks, and deadlines.",
      "Eliminated one-day deadline drift with time-zone-safe parsing and a PostgreSQL DATE-to-TIMESTAMP migration; stabilized calendar controls, state restoration, and API errors.",
    ],
    skills: ["TypeScript", "React", "PostgreSQL", "Supabase", "Jitsi", "OAuth 2.0", "Google Calendar API", "Microsoft Outlook API", "Jest"],
  },
  {
    id: "pash-motors",
    title: "Software Engineer Intern",
    company: "PashMotors — VINSecure",
    location: "Remote",
    startDate: "Oct 2025",
    endDate: "Dec 2025",
    headline:
      "Improved the reliability of vehicle registration, verification, camera capture, and VIN workflows.",
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
    headline:
      "Built shared operational workflows for paperwork, inventory, schedules, and delivery orders across 5+ stores.",
    description: [
      "Built React and TypeScript interfaces with FastAPI and PostgreSQL services for paperwork, inventory, schedules, orders, and multi-location records.",
      "Co-led a DoorDash API integration with another developer, connecting delivery-order data to React and PostgreSQL tablet workflows with validation, error handling, and end-to-end tests.",
      "Standardized service startup, recurring jobs, configuration, logs, permissions, and diagnostics with Linux and Bash.",
      "Added Jest, Pytest, and Playwright coverage around order, inventory, schedule, and tablet workflows while keeping manager review in front of AI-assisted decisions.",
    ],
    skills: ["React", "TypeScript", "FastAPI", "PostgreSQL", "Python", "Node.js", "LangChain", "LangGraph", "Linux", "Bash", "Jest", "Pytest", "Playwright"],
  },
];

export const awards: Award[] = [
  {
    id: "aws-cloud",
    title: "AWS Cloud Practitioner",
    type: "certificate",
    issuer: "Amazon Web Services",
  },
  {
    id: "youreka-award",
    title: "Youreka Research Awards",
    type: "award",
    issuer: "Youreka Canada",
    description: "1st Place (2022) & 3rd Place (2023) Regional Science Research",
  },
];

export const chatbotKnowledge = {
  summary: `Sahil Regonda is a software engineer studying Computer Science at the University of Toronto, with minors in Mathematics and Statistics and graduation expected in May 2028. Across five engineering internships, he has worked on social fitness, multi-tenant SaaS, founder tools, vehicle verification, and multi-store operations. His work connects product interfaces, backend services, data contracts, permissions, testing, and applied AI.`,

  skills: `Sahil's technical skills:
- Languages: Python, TypeScript, JavaScript, Java, C++, C, SQL, HTML/CSS
- Frameworks and libraries: React, React Native, Next.js, Flutter, FastAPI, Node.js, Express.js, TensorFlow, ONNX, Pydantic
- Databases, APIs and platforms: PostgreSQL, Supabase, pgvector, Redis, OpenAI API, Google Calendar API, Microsoft Outlook API, Jitsi
- Developer and testing tools: Git, GitHub, GitHub Actions, Docker, Linux, Jest, Pytest, Playwright, Jira, VS Code, Cursor`,

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
};

export const suggestedPrompts = [
  "Summarize Sahil's background",
  "What has he shipped?",
  "Tell me about his AI and ML work",
  "What's his strongest project for an AI role?",
  "How can I contact Sahil?",
];
