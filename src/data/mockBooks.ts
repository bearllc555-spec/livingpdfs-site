import { Book } from '../types';

export const mockBooks: Book[] = [
  {
    id: 'tailwind-v4',
    title: 'Tailwind CSS v4.0 Mastery Guide',
    author: 'Anthony Page',
    category: 'Design & Frontend',
    description: 'Learn to build responsive, light-speed applications with Tailwind v4. This living guide is constantly kept up-to-date with compiler upgrades, new theme systems, and utility rules.',
    thumbnailColor: 'from-cyan-500 to-blue-600',
    iconName: 'Sparkles',
    price: 19.99,
    totalPages: 48,
    lastUpdated: '2026-05-20',
    currentVersion: 'v4.2.1',
    tags: ['Tailwind', 'CSS', 'Design System', 'Living PDF'],
    isNew: true,
    isPopular: true,
    coverUrl: '/images/tailwind_v4_cover.png',
    updateHistory: [
      {
        version: 'v4.2.1',
        date: '2026-05-20',
        changes: [
          'Added full comprehensive chapter on CSS Container Queries integration.',
          'Updated standard utility mappings for React 19 builds.',
          'Optimized compilation speed notes for @tailwindcss/vite compiler.'
        ]
      },
      {
        version: 'v4.1.0',
        date: '2026-04-12',
        changes: [
          'Added CSS Grid alignment shortcuts documentation.',
          'Included dark-mode styling override tips.'
        ]
      }
    ],
    pages: [
      {
        pageNumber: 1,
        title: 'Introduction to Tailwind v4.0',
        content: `
Welcome to the LivingPDFs.com Living Guide on Tailwind CSS v4.0. Modern CSS has evolved significantly, making it faster, more container-focused, and increasingly declarative.

Tailwind v4 re-imagines utility class composition from the ground up, switching from standard Node-based PostCSS compilation to a brand-new Rust-powered engine. This results in compile speeds that are virtually instantaneous.

Whether you are launching a minimalist blog, a complex SaaS administration panel, or a high-fidelity media dashboard, the guidelines in this guide will show you how to maintain consistent design pacing, visual contrast, adaptive padding, and professional responsive alignments without maintaining bulky stylesheets.`
      },
      {
        pageNumber: 2,
        title: 'The Modern Build Pipeline',
        content: `
The new compiler integrates seamlessly with modern bundling architectures like Vite, Next.js, and esbuild. 

To introduce Tailwind CSS v4 to a new React workspace, the setup requires only a simple single-line directive in your global styles sheet:

\`\`\`css
/* index.css */
@import "tailwindcss";
\`\`\`

No separate configuration files like tailwind.config.js are strictly necessary anymore. All custom variables, custom themes, and fluid typography rules can be declared directly using standard CSS @theme variables at the head of your document, allowing you to use raw CSS styling powers.`
      },
      {
        pageNumber: 3,
        title: 'Unified Design Tokens',
        content: `
Design tokens represent the foundational building blocks of your visual brand. In Tailwind CSS v4, these tokens are mapped securely to standard CSS custom variables inside the \`@theme\` block:

\`\`\`css
@theme {
  --color-brand-cyan: #06b6d4;
  --font-sans: "Inter", sans-serif;
  --font-mono: "JetBrains Mono", monospace;
}
\`\`\`

By declaring configurations in standard CSS, any modern development tool can parse, suggestions can compile, and the developer enjoys absolute transparency without relying on complex JSON schemas. This is the heart of living and flexible guides.`
      },
      {
        pageNumber: 4,
        title: 'Advanced Layouts: Grid & Flexbox',
        content: `
A masterclass on alignment. Modern web platforms deserve perfect alignment rhythm. We discard random margining and absolute overlays in favor of responsive CSS flex and block layouts.

For bento-style showcases, we recommend the standard responsive grid utilities:
\`\`\`html
<div class="grid grid-cols-1 md:grid-cols-3 gap-6">
  <div class="md:col-span-2">Main Case</div>
  <div>Sidebar widget</div>
</div>
\`\`\`

Using Tailwind's grid features, children scale smoothly across layout breakpoints while keeping equal heights and maintaining optimal alignment.`
      },
      {
        pageNumber: 5,
        title: 'The Dark Mode Paradigm',
        content: `
Late-night reading and dark-canvas sessions should look highly intentional, avoiding the lazy conversion of pure blacks and highly contrasting whites.

Instead, we prefer beautiful dim background options like slates, deep charcoals, and twilight-hues combined with soft off-white text.

In Tailwind CSS, dark mode styling is introduced easily via the \`dark:\` modifier. It allows you to adjust colors based on system settings or active body classes:
\`\`\`html
<div class="bg-white text-gray-900 dark:bg-zinc-950 dark:text-zinc-100">
  This card automatically adjusts visually.
</div>
\`\`\`
Tailwind v4 detects client theme switches efficiently without lag.`
      },
      {
        pageNumber: 6,
        title: 'Container Queries & Fluid Elements',
        content: `
One of the most revolutionary additions. Instead of querying the global viewport dimensions with traditional media queries, you can now construct responsive patterns based directly on the dimensions of the parent container:

\`\`\`html
<div class="@container">
  <div class="grid grid-cols-1 @md:grid-cols-2">
    <!-- Fluid layout adjusts based on parent width! -->
  </div>
</div>
\`\`\`

This matches the modularity trend perfectly. Your cards, headers, and media controls can be placed in narrow sidebars, wide hubs, or central screens and adjust instantly.`
      },
      {
        pageNumber: 7,
        title: 'UNLOCKED: Custom Themes Customization',
        content: `This page is locked! You must purchase the living copy of this book to read this premium chapter.`
      }
    ]
  },
  {
    id: 'react-19-deep-dive',
    title: 'React 19 & Google Gemini Integration',
    author: 'Elena Rostova',
    category: 'Software Engineering',
    description: 'A deep plunge into Server Actions, full-stack forms, and proxying AI queries to the Google Gemini API securely using sever-side endpoints.',
    thumbnailColor: 'from-violet-500 to-indigo-600',
    iconName: 'Cpu',
    price: 24.50,
    totalPages: 56,
    lastUpdated: '2026-05-25',
    currentVersion: 'v1.0.4',
    tags: ['React 19', 'Gemini AI', 'Server Actions', 'Full-stack'],
    isPopular: true,
    coverUrl: '/images/react_19_cover.png',
    updateHistory: [
      {
        version: 'v1.0.4',
        date: '2026-05-25',
        changes: [
          'Updated API routing examples to reflect Google Gen AI SDK v2.4.0 standards.',
          'Added error boundary designs for streaming model interfaces.'
        ]
      }
    ],
    pages: [
      {
        pageNumber: 1,
        title: 'React 19 Architecture Overview',
        content: `
The release of React 19 ushers in a unified architecture that bridges client-side interactive rendering with highly optimized, secure server-side compute.

By implementing built-in handling for asynchronous requests, React 19 replaces standard cumbersome states like \`isLoading\` or \`isError\` with elegant form-actions and transition-focused custom hooks.

We will learn how to initialize apps securely, process inputs seamlessly, run lightweight database operations, and proxy external AI models while ensuring that your client-side application bundle remains remarkably lightweight.`
      },
      {
        pageNumber: 2,
        title: 'Server Actions & Form Handling',
        content: `
The new React Actions model simplifies form logic considerably. State transitions are processed natively using standard async functions passed directly to action properties:

\`\`\`typescript
async function handleSubmit(formData: FormData) {
  'use server';
  const name = formData.get('name');
  await saveToCloud(name);
}
\`\`\`

This standardizes form validation, submission tracking, pending status alerts, and error recovery, rendering custom boilerplate libraries obsolete.`
      },
      {
        pageNumber: 3,
        title: 'Securely Proxying the Gemini API',
        content: `
The absolute highest priority when deploying intelligent applications is securing your private API credentials. Placing Gemini keys or standard tokens in client browser bundles constitutes a massive security risk.

To prevent this, we declare server-side routes on an Express middleware layer. The server maps requests like \`/api/predict\` securely using environment secrets:

\`\`\`typescript
import { GoogleGenAI } from "@google/genai";
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
\`\`\`

The client issues anonymous fetch calls, keeping keys protected behind the cloud firewall.`
      },
      {
        pageNumber: 4,
        title: 'Optimizing Model Instruction Performance',
        content: `
In guide-books or automated apps, model prompts are structured with strict boundaries. System instructions convey exactly what role the assistant should play.

For code generators, instructions enforce outputs formatted clean of unnecessary pleasantries:
"Provide output strictly as JSON with keys type and value."

Through rigorous system prompting, your models respond efficiently, minimizing Token usage and preventing parsing errors in production.`
      },
      {
        pageNumber: 5,
        title: 'The useActionState Hook in Action',
        content: `
React 19 provides the \`useActionState\` hook to safely track action outcomes and trigger instantaneous visual feedback:

\`\`\`typescript
const [state, formAction, isPending] = useActionState(
  async (prevState, formData) => {
    return await submitAction(formData);
  },
  initialState
);
\`\`\`

This simplifies loaders, disables buttons dynamically during sync events, and guarantees error isolation on nested components.`
      },
      {
        pageNumber: 6,
        title: 'Real-time Streaming Visualizations',
        content: `
Waiting for complete model predictions causes friction in modern interfaces. Real-time token streaming solves this problem by flushing immediate predictions to the layout.

By using standard Server-Sent Events or readable response streams, text appears immediately. This guide explores optimal visual buffers, cursor tickers, and auto-scroll constraints for streaming hubs.`
      },
      {
        pageNumber: 7,
        title: 'UNLOCKED: Custom Token Buffers and Compression',
        content: `This page is locked! You must purchase the living copy of this book to read this premium chapter.`
      }
    ]
  },
  {
    id: 'typescript-rugged',
    title: 'The Rugged TypeScript Typings Manual',
    author: 'Clara Oswald',
    category: 'Software Engineering',
    description: 'A structural handbook for engineering unbreakable TypeScript codes. Advanced templates, conditional guards, and zero-any rules.',
    thumbnailColor: 'from-amber-600 to-red-700',
    iconName: 'ShieldAlert',
    price: 15.00,
    totalPages: 32,
    lastUpdated: '2026-05-18',
    currentVersion: 'v3.1.0',
    tags: ['TypeScript', 'Software Design', 'Robust Code'],
    coverUrl: '/images/typescript_rugged_cover.png',
    updateHistory: [
      {
        version: 'v3.1.0',
        date: '2026-05-18',
        changes: [
          'Updated generics definitions for mapping database schemas dynamically.',
          'Added custom validation decorators reference.'
        ]
      }
    ],
    pages: [
      {
        pageNumber: 1,
        title: 'Unbreakable Types Philosophy',
        content: `
Type safety is not self-justified academic perfection. It represents bulletproof safety nets that prevent failures at 3 AM.

In a professional development scope, relying on standard fallback types like \`any\` is equivalent to turning off compiling rules.

This manual outlines the tools required to establish type assertions, generic configurations, parameter narrowing arrays, and custom type guards that verify properties without risking runtime crashes.`
      },
      {
        pageNumber: 2,
        title: 'Generic Type Safety',
        content: `
Generics allow you to construct reusable components that interact predictably with varying payloads.

\`\`\`typescript
interface Envelope<T> {
  payload: T;
  timestamp: string;
}
\`\`\`

By declaring structured wrappers, methods return typed models, improving auto-completions, and preventing visual runtime type mismatches.`
      },
      {
        pageNumber: 3,
        title: 'Discriminated Unions vs Guessing',
        content: `
A classic anti-pattern: using an optional string to separate statuses:
\`\`\`typescript
interface RequestState { status: 'loading' | 'success' | 'error'; data?: any; error?: string }
\`\`\`

Instead, rugged developers use discriminated unions:
\`\`\`typescript
type RequestState = 
  | { status: 'loading' }
  | { status: 'success'; data: Book[] }
  | { status: 'error'; message: string };
\`\`\`
This enforces compile-time verification when managing loading or error routes.`
      },
      {
        pageNumber: 4,
        title: 'Strict Configuration Settings',
        content: `
Your tsconfig.json works as the compiler sentinel. Enable rigorous rules for structural safety:

- \`strictNullChecks\`: Enforces variables to be explicitly checked before accessing methods.
- \`noImplicitAny\`: Errors when compiler infers unspecified 'any' models.
- \`noUnusedLocals\`: Clears dormant variables, keeping bundles minimal.`
      },
      {
        pageNumber: 5,
        title: 'Advanced Type Mapping Systems',
        content: `
Utilize native mapping filters to convert existing interfaces into specific forms:
\`\`\`typescript
type Immutable<T> = {
  readonly [P in keyof T]: T[P];
};
\`\`\`

Immutable parameters protect configurations from random state overrides inside interactive components.`
      },
      {
        pageNumber: 6,
        title: 'Dynamic Runtime Assertions',
        content: `
TypeScript annotations vanish completely at compilation. When handling foreign payloads over public API paths, run validation checks on keys:

\`\`\`typescript
function isBook(payload: any): payload is Book {
  return typeof payload === 'object' && 'id' in payload && 'title' in payload;
}
\`\`\`
Ensures safe data ingestion under all scenarios.`
      },
      {
        pageNumber: 7,
        title: 'UNLOCKED: Custom Advanced Conditonal Types',
        content: `This page is locked! You must purchase the living copy of this book to read this premium chapter.`
      }
    ]
  },
  {
    id: 'clean-architecture-serverless',
    title: 'Clean Architecture on Serverless Systems',
    author: 'Devon Carter',
    category: 'Backend & Cloud',
    description: 'Build robust API networks and cloud pipelines that cost next to nothing and auto-scale to millions of concurrent reads instantly.',
    thumbnailColor: 'from-blue-600 to-teal-700',
    iconName: 'Cloud',
    price: 22.99,
    totalPages: 44,
    lastUpdated: '2026-05-10',
    currentVersion: 'v1.2.0',
    tags: ['Serverless', 'Cloud Architecture', 'Scale', 'API Design'],
    coverUrl: '/images/clean_architecture_cover.png',
    updateHistory: [
      {
        version: 'v1.2.0',
        date: '2026-05-10',
        changes: [
          'Modified regional routing advice for Cloud Run latency optimization.',
          'Added cold-start mitigating patterns chapter.'
        ]
      }
    ],
    pages: [
      {
        pageNumber: 1,
        title: 'Serverless Design Core Fundamentals',
        content: `
The cloud environment frees modern engineering groups from server patching, operating system provisioning, and capacity over-buying.

However, serverless models demand state-agnostic codebases. Every dynamic container should be spun down, isolated, or replicated without state losses.

This guide provides strategies for implementing microservices, managing cloud caches, scheduling async tasks, and keeping databases synchronized safely using event-oriented logic.`
      },
      {
        pageNumber: 2,
        title: 'Decoupling Applications from Runtime',
        content: `
Keep core business processes isolated from cloud infrastructure SDKs. Express handlers or AWS Lambdas should serve purely as traffic adaptors.

Avoid placing business logic inside database clients. Use specialized controllers to handle calculations:

\`\`\`typescript
export function calculateRewards(duration: number): number {
  return Math.floor(duration / 10);
}
\`\`\`
Ensures simple local unit testing.`
      },
      {
        pageNumber: 3,
        title: 'Managing Hot & Cold Startup Delays',
        content: `
Cloud run containers dynamically shut down when dormant. To minimize cold startup delays:
- Keep bundle size small. Avoid unnecessary imports.
- Minimize file reads on bootstrap.
- Use lightweight libraries over nested bulky standard packages.`
      },
      {
        pageNumber: 4,
        title: 'Distributed Transaction Patterns',
        content: `
When executing across dynamic server instances, traditional double-entry locking causes latency queues.

Instead, execute logic with Saga orchestration or transactional queues:
- Book an entry as 'pending'
- Wait for a response token
- Reconcile or emit revert action on failure.`
      },
      {
        pageNumber: 5,
        title: 'Low Latency Regional Syncs',
        content: `
Route traffic to edges using geographic distribution. Read operations are served instantly from the nearest regional replica, keeping latencies below 30ms.

Write actions bypass caches directly to primary nodes, keeping data integrity intact.`
      },
      {
        pageNumber: 6,
        title: 'High Availability Testing Routines',
        content: `
Test cluster scaling by inducing synthetic traffic loads. Verify memory boundaries, auto-scaling thresholds, response times under stress, and fallback behaviors during region-wide outages.`
      },
      {
        pageNumber: 7,
        title: 'UNLOCKED: Global Distributed Multi-Cloud Strategy',
        content: `This page is locked! You must purchase the living copy of this book to read this premium chapter.`
      }
    ]
  },
  {
    id: 'nextjs-15-blueprint',
    title: 'Next.js 15 Production Blueprint',
    author: 'Anthony Page',
    category: 'Backend & Cloud',
    description: 'Master React Server Components, partial pre-rendering, dynamic cache invalidation, and seamless server actions in Next.js 15.',
    thumbnailColor: 'from-gray-800 to-emerald-950',
    iconName: 'Server',
    price: 29.99,
    totalPages: 60,
    lastUpdated: '2026-05-27',
    currentVersion: 'v1.0.0',
    tags: ['Next.js', 'React Server Components', 'Web Performance'],
    coverUrl: '/images/next_15_cover.png',
    updateHistory: [
      {
        version: 'v1.0.0',
        date: '2026-05-27',
        changes: [
          'First release of Next.js 15 production guide.',
          'Added partial pre-rendering diagnostic checklist.'
        ]
      }
    ],
    pages: [
      {
        pageNumber: 1,
        title: 'Next.js 15 Core Paradigm',
        content: `
Welcome to the Next.js 15 Living Blueprint. Modern front-end architectures require unified server-rendered layout boundaries that scale effortlessly.

This guide deep dives into optimized data fetching mechanisms, caching overrides, routing optimization, and instant dynamic server rendering configurations.`
      },
      {
        pageNumber: 2,
        title: 'React Server Components Explained',
        content: `
React Server Components (RSC) allow components to fetch and resolve data on the server, significantly reducing index weights and client boot delays.

Ensure clean separation between interactive widgets ('use client') and static layout sheets.`
      },
      {
        pageNumber: 3,
        title: 'Direct Server Function Triggers',
        content: `
Server functions are invoked securely over RPC boundaries. This guide reviews error isolates, optimistic update transitions, and custom headers propagation.`
      },
      {
        pageNumber: 4,
        title: 'Partial Pre-rendering Setup',
        content: `
PPR blends static shells with dynamic streaming segments seamlessly. This keeps initial page speed metrics extremely high for users.`
      },
      {
        pageNumber: 5,
        title: 'Advanced Cache Control Rules',
        content: `
Never serve stale layouts. Leverage dynamic on-demand revalidation markers to refresh UI state cleanly across distributed multi-region edge networks.`
      },
      {
        pageNumber: 6,
        title: 'Static Delivery Architectures',
        content: `
Learn how to compile Next.js 15 static assets safely for dynamic deployment models across edge proxy services.`
      },
      {
        pageNumber: 7,
        title: 'UNLOCKED: Custom High-Performance Routing Matrix',
        content: `This page is locked! You must purchase the living copy of this book to read this premium chapter.`
      }
    ]
  },
  {
    id: 'rugged-rust',
    title: 'Systems Programming with Rugged Rust',
    author: 'Alistair Vance',
    category: 'Software Engineering',
    description: 'Uncover compiler secrets, memory ownership safety, raw concurrency patterns, and metal-level optimizations with the Rust programming language.',
    thumbnailColor: 'from-orange-600 to-red-800',
    iconName: 'Shield',
    price: 28.99,
    totalPages: 38,
    lastUpdated: '2026-05-24',
    currentVersion: 'v1.4.0',
    tags: ['Rust', 'Systems', 'Compiler', 'Safety'],
    coverUrl: '/images/rugged_rust_cover.png',
    updateHistory: [
      {
        version: 'v1.4.0',
        date: '2026-05-24',
        changes: ['Added asynchronous network orchestration chapters.', 'Refined lockless atomic array models.']
      }
    ],
    pages: [
      {
        pageNumber: 1,
        title: 'The Rust Compiler Paradigm',
        content: `Rust represents a fundamental shift in systems programming. By enforcing ownership rules at compile time, the borrow checker eliminates entire classes of runtime errors including null pointer dereferences, data races, and use-after-free bugs without needing a garbage collector.`
      },
      {
        pageNumber: 2,
        title: 'Ownership and Borrowing Mechanics',
        content: `Every value in Rust has an owner. There can only be one owner at a time. When the owner goes out of scope, the value is dropped instantly. Borrowing allows component nodes to safely reference values via immutable (&T) or mutable (&mut T) references under strict exclusivity rules.`
      },
      {
        pageNumber: 3,
        title: 'Lockless Thread Concurrency',
        content: `Rust’s type systems establish Send and Sync traits that ensure data structures are safely shared across multi-processor execution channels. This chapter shows you how to design atomic pointers and state channels without deadlocks.`
      },
      {
        pageNumber: 4,
        title: 'UNLOCKED: Zero Cost Abstractions',
        content: `This page is locked! You must purchase the living copy of this book to read this premium chapter.`
      }
    ]
  },
  {
    id: 'docker-extreme-scale',
    title: 'Docker Containers at Extreme Scale',
    author: 'Marcus Drake',
    category: 'Backend & Cloud',
    description: 'The ultimate container operations handbook. Architect multi-tenant systems, manage isolation levels, and write ultra-optimized Dockerfiles for enterprise grids.',
    thumbnailColor: 'from-blue-500 to-sky-700',
    iconName: 'Server',
    price: 18.50,
    totalPages: 42,
    lastUpdated: '2026-05-15',
    currentVersion: 'v2.1.2',
    tags: ['Docker', 'DevOps', 'Containers', 'Infrastructure'],
    coverUrl: '/images/docker_extreme_cover.png',
    updateHistory: [
      {
        version: 'v2.1.2',
        date: '2026-05-15',
        changes: ['Optimized multi-stage build patterns for size reduction.', 'Added rootless container configuration guides.']
      }
    ],
    pages: [
      {
        pageNumber: 1,
        title: 'The Blueprint of Containerization',
        content: `Containers group application code alongside necessary system binaries to guarantee execution parity between developer hubs and cluster targets. This guide demonstrates host kernel namespaces isolation techniques.`
      },
      {
        pageNumber: 2,
        title: 'Writing Light-speed Dockerfiles',
        content: `Avoid ballooning image sizes. Use multi-stage compiler runs, leverage cached layers strategically, and prune development utilities to produce target payloads under 20MB.`
      },
      {
        pageNumber: 3,
        title: 'Security and Least Privilege',
        content: `Never run apps as root inside isolated pods. Discover how to create dedicated system users and enforce restrictive capabilities settings.`
      },
      {
        pageNumber: 4,
        title: 'UNLOCKED: Isolated Overlay Networking Systems',
        content: `This page is locked! You must purchase the living copy of this book to read this premium chapter.`
      }
    ]
  },
  {
    id: 'graphql-federation-design',
    title: 'GraphQL Federation & Gateway Design',
    author: 'Sarah Lin',
    category: 'Software Engineering',
    description: 'Consolidate separate APIs into a single high-performance federated graph. Master subgraph routing, caching directives, and query cost estimators.',
    thumbnailColor: 'from-pink-600 to-fuchsia-800',
    iconName: 'Share2',
    price: 23.00,
    totalPages: 36,
    lastUpdated: '2026-05-11',
    currentVersion: 'v1.1.0',
    tags: ['GraphQL', 'Federation', 'APIs', 'Architecture'],
    coverUrl: '/images/graphql_federation_cover.png',
    updateHistory: [
      {
        version: 'v1.1.0',
        date: '2026-05-11',
        changes: ['Added query depth limiter code snippets.', 'Refined schema stitching error logs format.']
      }
    ],
    pages: [
      {
        pageNumber: 1,
        title: 'The Unified Superchain Evolution',
        content: `As backend topologies grow, clients struggle to coordinate queries across hundreds of microservices. GraphQL Federation provides a declarative approach to unify diverse subgraphs behind a single high-throughput gateway.`
      },
      {
        pageNumber: 2,
        title: 'Entities and Dynamic Keys Mapping',
        content: `Entities allow schemas to reference fields located on distinct remote servers. By mapping keys, a User service can resolve account details while a Reviews service maps corresponding products synchronously.`
      },
      {
        pageNumber: 3,
        title: 'Designing Cost and Depth Analyzers',
        content: `Malicious clients can build recursively nested queries that saturate backend processing lines. This chapter details how to measure query weight before scheduling execution.`
      },
      {
        pageNumber: 4,
        title: 'UNLOCKED: Edge Caching for Federated Entities',
        content: `This page is locked! You must purchase the living copy of this book to read this premium chapter.`
      }
    ]
  },
  {
    id: 'python-agentic-ai',
    title: 'Building Agentic Workflows with Python',
    author: 'Dr. Kieran Vance',
    category: 'AI & Data Science',
    description: 'Master LLM tool use, routing graphs, persistent state loops, and cognitive orchestration using modern Python agent frameworks.',
    thumbnailColor: 'from-teal-600 to-emerald-900',
    iconName: 'Brain',
    price: 32.00,
    totalPages: 52,
    lastUpdated: '2026-05-26',
    currentVersion: 'v1.0.1',
    tags: ['Python', 'AI', 'Agents', 'LLMs'],
    coverUrl: '/images/python_agentic_cover.png',
    updateHistory: [
      {
        version: 'v1.0.1',
        date: '2026-05-26',
        changes: ['Updated LangGraph memory management examples for state restoration.', 'Configured auto-recovery modes on tool call errors.']
      }
    ],
    pages: [
      {
        pageNumber: 1,
        title: 'Cognitive Loop Architectures',
        content: `Traditional LLM pipelines invoke single predictions and terminate. Agentic systems introduce dynamic feedback cycles, allowing models to review outputs, call calculator tools, parse directory files, and loop until goals are verified.`
      },
      {
        pageNumber: 2,
        title: 'State Chaining and Action Formats',
        content: `Discover how to model agency using stategraphs. Track execution history, map conditional transitions based on tool outputs, and maintain user intent variables throughout multi-turn chats.`
      },
      {
        pageNumber: 3,
        title: 'Tool Construction and Schema Injection',
        content: `Inject functions into context prompts dynamically. Write beautiful Python docstrings that instruct model nodes on when and how to launch search queries.`
      },
      {
        pageNumber: 4,
        title: 'UNLOCKED: Autonomous Error-Triage Loops',
        content: `This page is locked! You must purchase the living copy of this book to read this premium chapter.`
      }
    ]
  },
  {
    id: 'figma-to-code-pipeline',
    title: 'The Figma to Code Design Pipeline',
    author: 'Chloe Miller',
    category: 'Design & Frontend',
    description: 'Bridge the designer-developer gap. Implement automated token ingestion, Tailwind-ready token utilities, and headless component wrappers directly from vector screens.',
    thumbnailColor: 'from-indigo-500 to-violet-700',
    iconName: 'Layers',
    price: 15.99,
    totalPages: 30,
    lastUpdated: '2026-05-19',
    currentVersion: 'v1.0.0',
    tags: ['Figma', 'Design System', 'Tailwind', 'Workflow'],
    coverUrl: '/images/figma_to_code_cover.png',
    updateHistory: [
      {
        version: 'v1.0.0',
        date: '2026-05-19',
        changes: ['Initial release of Figma automation blueprints.', 'Integrated beautiful code-generation templates for CSS custom variables.']
      }
    ],
    pages: [
      {
        pageNumber: 1,
        title: 'Sovereign Design Tokens',
        content: `Design should never be translated by guessing. By defining typography, color palettes, and margin steps inside specialized tokens files, both your design canvasses and frontend compilers remain in sync.`
      },
      {
        pageNumber: 2,
        title: 'Automated GitHub Ingestion Pulls',
        content: `Establish webhooks that listen to updates on Figma files, call the Figma REST API, compile layout variables to tailwind theme objects, and send pull requests automatically.`
      },
      {
        pageNumber: 3,
        title: 'Constructing Headless Wrapper Units',
        content: `Isolate raw layout patterns from interactors. Discover how to create styles-only nodes that support custom Radix behaviors smoothly.`
      },
      {
        pageNumber: 4,
        title: 'UNLOCKED: Auto-layouts Extraction Equations',
        content: `This page is locked! You must purchase the living copy of this book to read this premium chapter.`
      }
    ]
  },
  {
    id: 'postgresql-optimization',
    title: 'PostgreSQL Performance Optimization',
    author: 'Dante Alighieri',
    category: 'Database & Analytics',
    description: 'Unlock lightning-fast queries on massive datasets. Dive deep into query planner forensics, custom indexing strategies, and locking mechanism optimizations.',
    thumbnailColor: 'from-cyan-600 to-indigo-900',
    iconName: 'Database',
    price: 26.99,
    totalPages: 45,
    lastUpdated: '2026-05-12',
    currentVersion: 'v1.3.1',
    tags: ['PostgreSQL', 'Database', 'SQL', 'Performance'],
    coverUrl: '/images/postgresql_optimization_cover.svg',
    updateHistory: [
      {
        version: 'v1.3.1',
        date: '2026-05-12',
        changes: ['Added comprehensive chapter on pg_stat_statements usage.', 'Adjusted VACUUM settings and index bloat calculations.']
      }
    ],
    pages: [
      {
        pageNumber: 1,
        title: 'Query Execution Diagnostics',
        content: `When a query runs slowly, do not guess index strategies. Run EXPLAIN (ANALYZE, BUFFERS) to expose how many megabytes were read of the disk and where filter bottlenecks originate.`
      },
      {
        pageNumber: 2,
        title: 'Strategic Indexes Architecture',
        content: `Explore partial, expression-based, and covering indexes. Learn how to prevent lock-escalation states when creating indexes on transactional systems.`
      },
      {
        pageNumber: 3,
        title: 'Vacuum and Bloat Remediation',
        content: `PostgreSQL is an MVCC engine, leaving dead tuples on modification. Master active autovacuum scheduling to keep records tightly packed in memory pages.`
      },
      {
        pageNumber: 4,
        title: 'UNLOCKED: Partitioning High Volume Ledger Tables',
        content: `This page is locked! You must purchase the living copy of this book to read this premium chapter.`
      }
    ]
  },
  {
    id: 'kubernetes-orchestration',
    title: 'Kubernetes Orchestration Handbook',
    author: 'Niels Bohr',
    category: 'Backend & Cloud',
    description: 'Your zero-downtime cluster blueprint. Master declarative ingress networks, stateful storage systems, pods lifecycle events, and self-healing service grids.',
    thumbnailColor: 'from-blue-600 to-indigo-805',
    iconName: 'Cpu',
    price: 34.99,
    totalPages: 58,
    lastUpdated: '2026-05-21',
    currentVersion: 'v3.0.0',
    tags: ['Kubernetes', 'Cloud Native', 'Scale', 'DevOps'],
    coverUrl: '/images/kubernetes_orchestration_cover.svg',
    updateHistory: [
      {
        version: 'v3.0.0',
        date: '2026-05-21',
        changes: ['Upgraded deployment YAML manifests to k8s v1.31 compliance.', 'Added dynamic multi-ingress routing tutorials.']
      }
    ],
    pages: [
      {
        pageNumber: 1,
        title: 'Declarative State Control',
        content: `Kubernetes operates on absolute reconciliation loops. You define the desired state inside YAML files, and the control plane coordinates resources until reality matches your manifest.`
      },
      {
        pageNumber: 2,
        title: 'Dynamic Routing & Ingress Nodes',
        content: `Connect services to public networks safely. Master Ingress controllers, TLS cert managers, and zero-downtime path integrations.`
      },
      {
        pageNumber: 3,
        title: 'Stateful Storage Provisioners',
        content: `Persist data safely. Bind PersistentVolume Claims to cloud disks dynamically, ensuring storage survives pod reschedules.`
      },
      {
        pageNumber: 4,
        title: 'UNLOCKED: Automated Canary Rollout Scripts',
        content: `This page is locked! You must purchase the living copy of this book to read this premium chapter.`
      }
    ]
  },
  {
    id: 'svelte-5-runes',
    title: 'Svelte 5 & The Reactive Runes Revolution',
    author: 'Richie Harris',
    category: 'Design & Frontend',
    description: 'Build lightning-fast, highly interactive widgets using Svelte 5 runes. Master fine-grained reactivity, custom actions, and compile-time layout optimizations.',
    thumbnailColor: 'from-orange-500 to-amber-600',
    iconName: 'Compass',
    price: 21.50,
    totalPages: 35,
    lastUpdated: '2026-05-23',
    currentVersion: 'v1.0.2',
    tags: ['Svelte', 'Runes', 'Frontend', 'Reactivity'],
    coverUrl: '/images/svelte_5_runes_cover.svg',
    updateHistory: [
      {
        version: 'v1.0.2',
        date: '2026-05-23',
        changes: ['Refined derived state monitoring guides.', 'Fixed transition event parameters for single-screen apps.']
      }
    ],
    pages: [
      {
        pageNumber: 1,
        title: 'Reimagining Reactive Bindings',
        content: `Svelte 5 discards standard compiler bindings ($:) in favor of Runes. Runes are explicit functions that tell the Svelte parser when and where to trigger fine-grained reactive updates.`
      },
      {
        pageNumber: 2,
        title: 'Mastering the State & Derived Runes',
        content: `Use $state to declare values that change and $derived to build cached combinations without maintaining manual watchers:
\`\`\`typescript
let count = $state(0);
let doubled = $derived(count * 2);
\`\`\``
      },
      {
        pageNumber: 3,
        title: 'Component Class Mechanics',
        content: `Learn to pass parameters cleanly. Svelte 5 utilizes standard properties arrays, making codebases easier for TypeScript parsers to analyze.`
      },
      {
        pageNumber: 4,
        title: 'UNLOCKED: High-Performance Canvas Animation Runes',
        content: `This page is locked! You must purchase the living copy of this book to read this premium chapter.`
      }
    ]
  },
  {
    id: 'css-layout-alchemy',
    title: 'CSS Layout Alchemy & Container Queries',
    author: 'Estelle Weyl',
    category: 'Design & Frontend',
    description: 'Master the artistic balance of modern vanilla CSS. Harness container visual frames, grid math, subgrids, clamp math variables, and gorgeous ambient animations.',
    thumbnailColor: 'from-yellow-405 to-amber-700',
    iconName: 'Zap',
    price: 14.50,
    totalPages: 28,
    lastUpdated: '2026-05-14',
    currentVersion: 'v1.1.0',
    tags: ['CSS', 'Layout', 'Animation', 'Typography'],
    coverUrl: '/images/css_layout_alchemy_cover.svg',
    updateHistory: [
      {
        version: 'v1.1.0',
        date: '2026-05-14',
        changes: ['Added CSS Subgrid alignment examples.', 'Included gorgeous scroll-driven visual transitions guidelines.']
      }
    ],
    pages: [
      {
        pageNumber: 1,
        title: 'The Art of Visual Alignment',
        content: `Great designs are characterized by intentional spacing grids. This chapter teaches you to balance negative space, control inline alignment, and pairing display fonts with monospace markers.`
      },
      {
        pageNumber: 2,
        title: 'Designing with Container Queries',
        content: `Say goodbye to viewport-bound layouts. Container queries let you style widgets contextually, aligning design blocks elegantly inside narrow columns or wide sidebars alike.`
      },
      {
        pageNumber: 3,
        title: 'The Fluid Sizing Clamp Equations',
        content: `Achieve perfect fluid-responsive scaling:
\`\`\`css
font-size: clamp(1rem, 2.5vw + 0.5rem, 3rem);
\`\`\`
Text transitions smoothly between small screens and massive viewports.`
      },
      {
        pageNumber: 4,
        title: 'UNLOCKED: Complex Scroll-Driven Parallax Timelines',
        content: `This page is locked! You must purchase the living copy of this book to read this premium chapter.`
      }
    ]
  },
  {
    id: 'copilot-prompting-10x',
    title: 'Copilot Prompting for 10x Engineers',
    author: 'Anthony Page',
    category: 'AI & Data Science',
    description: 'Explode your daily code production rate. Master context loading, architectural system boundaries, precise instruction chaining, and automated test suite generation.',
    thumbnailColor: 'from-violet-600 to-emerald-700',
    iconName: 'Sparkles',
    price: 12.99,
    totalPages: 32,
    lastUpdated: '2026-05-27',
    currentVersion: 'v1.0.0',
    tags: ['AI Prompting', 'CoPilot', 'Productivity', 'Engineering'],
    coverUrl: '/images/copilot_prompting_cover.svg',
    updateHistory: [
      {
        version: 'v1.0.0',
        date: '2026-05-27',
        changes: ['First release.', 'Tested with advanced 2026 LLM coding capabilities.']
      }
    ],
    pages: [
      {
        pageNumber: 1,
        title: 'Engineering Intent Expression',
        content: `Stop treating AI assistants like search engines. Modern coding models respond best to structured system roles, exact parameter limitations, and clear negative bounds.`
      },
      {
        pageNumber: 2,
        title: 'The Context Density Theorem',
        content: `Provide precisely what is needed. Loading thousand-line files with dormant logic dilutes model focus. This chapter teaches you to extract key interfaces before prompting changes.`
      },
      {
        pageNumber: 3,
        title: 'Writing Non-breaking Automated Tests',
        content: `Command models to write verification matrices alongside features. Keep validations fast and use isolated mock environments to avoid configuration leaks.`
      },
      {
        pageNumber: 4,
        title: 'UNLOCKED: Automated CI/CD Agentic Workflows',
        content: `This page is locked! You must purchase the living copy of this book to read this premium chapter.`
      }
    ]
  },
  {
    id: 'redis-distributed-caching',
    title: 'Redis Distributed Caching Patterns',
    author: 'Salvatore Sanfilippo',
    category: 'Database & Analytics',
    description: 'Scale system throughput with clean memory configurations. Learn cache eviction algorithms, pub/sub communication channels, and secure distributed lock execution.',
    thumbnailColor: 'from-red-600 to-rose-800',
    iconName: 'Database',
    price: 19.99,
    totalPages: 35,
    lastUpdated: '2026-05-09',
    currentVersion: 'v2.0.1',
    tags: ['Redis', 'Caching', 'Database', 'Scaling'],
    coverUrl: '/images/redis_caching_cover.svg',
    updateHistory: [
      {
        version: 'v2.0.1',
        date: '2026-05-09',
        changes: ['Added Redlock consensus guidelines.', 'Included memory efficiency tricks using Hash structures.']
      }
    ],
    pages: [
      {
        pageNumber: 1,
        title: 'In-Memory Data Structures',
        content: `Redis is not just a key-value store. It is a data structure server. Explore hashes, sorted sets, hyperloglogs, and bitmaps for blazing fast sub-millisecond computations.`
      },
      {
        pageNumber: 2,
        title: 'Cache Invalidation Strategies',
        content: `Nothing is harder than cache invalidation. Discover Write-Through, Write-Behind, and TTL-based eviction logic. Prevent database saturation during scale events.`
      },
      {
        pageNumber: 3,
        title: 'Distributed Redlock Consensus',
        content: `Run critical lock operations across dynamic server networks. Guarantee exclusive execution paths and prevent concurrency conflicts securely.`
      },
      {
        pageNumber: 4,
        title: 'UNLOCKED: Multi-Region Redis Cluster Sharding',
        content: `This page is locked! You must purchase the living copy of this book to read this premium chapter.`
      }
    ]
  },
  {
    id: 'astronomy-data-pipelines',
    title: 'Astrophysics Data Pipelines in Jupyter',
    author: 'Dr. Stella Nova',
    category: 'AI & Data Science',
    description: 'Analyze dynamic atmospheric fluctuations and cosmic datasets. Master numpy pipelines, pandas aggregations, and matplotlib visuals on planetary scales.',
    thumbnailColor: 'from-purple-800 to-zinc-950',
    iconName: 'Globe',
    price: 35.00,
    totalPages: 48,
    lastUpdated: '2026-05-05',
    currentVersion: 'v1.4.2',
    tags: ['Data Science', 'Python', 'Jupyter', 'Astrophysics'],
    coverUrl: '/images/astro_data_cover.svg',
    updateHistory: [
      {
        version: 'v1.4.2',
        date: '2026-05-05',
        changes: ['Updated galaxy mapping visualizations packages guidelines.', 'Fixed array bounds warnings for real-time spectral analytics.']
      }
    ],
    pages: [
      {
        pageNumber: 1,
        title: 'Ingesting Deep-Space Spectral Files',
        content: `Modern astrophysics relies heavily on programmatic telescope calibrations. This chapter outlines how to import raw FITS spectral datasets and clean high-altitude cosmic noise.`
      },
      {
        pageNumber: 2,
        title: 'Numpy Array Astronomy Math',
        content: `Accelerate celestial computations using vectorized operations. Calculate galactic rotation curves across raw matrix frames without nested python loops.`
      },
      {
        pageNumber: 3,
        title: 'Plotting Light Curves dynamically',
        content: `Map exoplanet transits with matplotlib. Feed light attenuation readings into moving average buffers to uncover dim planetary shadows.`
      },
      {
        pageNumber: 4,
        title: 'UNLOCKED: Cosmic Microwave Background Anomaly Analysis',
        content: `This page is locked! You must purchase the living copy of this book to read this premium chapter.`
      }
    ]
  },
  {
    id: 'web-security-penetration',
    title: 'Web Security & Penetration Engineering',
    author: 'Clara Hacker',
    category: 'Software Engineering',
    description: 'Secure your application frameworks from malicious payloads. Master Cross-Site Scripting mitigations, CSRF defenses, secure cookie models, and input isolation rules.',
    thumbnailColor: 'from-emerald-800 to-zinc-900',
    iconName: 'ShieldAlert',
    price: 27.50,
    totalPages: 40,
    lastUpdated: '2026-05-18',
    currentVersion: 'v1.2.0',
    tags: ['Security', 'Penetration', 'Hacking', 'Web Safety'],
    coverUrl: '/images/web_security_cover.svg',
    updateHistory: [
      {
        version: 'v1.2.0',
        date: '2026-05-18',
        changes: ['Integrated modern OWASP Top 10 guidelines.', 'Added instructions on Content Security Policy (CSP) headers configuration.']
      }
    ],
    pages: [
      {
        pageNumber: 1,
        title: 'The Hacker Mentality',
        content: `To build secure networks, you must think like an attacker. Discover critical web weaknesses, understand how SQL injections hijack databases, and locate dormant logic gates.`
      },
      {
        pageNumber: 2,
        title: 'Advanced Web XSS Exposing',
        content: `Prevent arbitrary code executions inside customer viewports. Secure applications using custom text sanitizers, strict JSX escaping, and defensive content handling rules.`
      },
      {
        pageNumber: 3,
        title: 'Hardening Your Cookies & Auth tokens',
        content: `Configure credentials securely using HttpOnly, Secure, and SameSite headers. Shield user sessions from token hijacking campaigns.`
      },
      {
        pageNumber: 4,
        title: 'UNLOCKED: Content Security Policy Audit Pipelines',
        content: `This page is locked! You must purchase the living copy of this book to read this premium chapter.`
      }
    ]
  },
  {
    id: 'ux-laws-conversion',
    title: '12 Laws of UX to Deep-Scale Conversion',
    author: 'Adaline Reed',
    category: 'Design & Frontend',
    description: 'Harness cognitive behaviors, Fitts s law, Jakob s law, and interaction speed loops to design screens that build brand equity and convert prospects.',
    thumbnailColor: 'from-purple-500 to-indigo-700',
    iconName: 'Compass',
    price: 16.50,
    totalPages: 31,
    lastUpdated: '2026-05-12',
    currentVersion: 'v1.0.5',
    tags: ['UX', 'Design', 'Product', 'Conversion'],
    coverUrl: '/images/ux_laws_cover.svg',
    updateHistory: [
      {
        version: 'v1.0.5',
        date: '2026-05-12',
        changes: ['Added empirical charts on checkout friction limits.', 'Refined visual text hierarchy rules.']
      }
    ],
    pages: [
      {
        pageNumber: 1,
        title: 'Cognitive Load and Desirability',
        content: `Design is not just decorations. Great dashboards leverage cognitive laws to reduce visual noise. Remove redundant buttons, keep spacing generous, and focus user attention on clean action triggers.`
      },
      {
        pageNumber: 2,
        title: 'Jakob’s Law and User Intuition',
        content: `Users spend most of their time on other apps. This means they expect your interfaces to function in familiar ways. Learn where to place navigation bars to avoid cognitive frustration.`
      },
      {
        pageNumber: 3,
        title: 'Designing Perfect Touch Targets',
        content: `Based on Fitts’s Law, touch elements must match size and distance metrics. Ensure buttons are at least 44px with comfortable spacing to prevent multi-tap errors.`
      },
      {
        pageNumber: 4,
        title: 'UNLOCKED: Aesthetic-Usability Effect Analysis',
        content: `This page is locked! You must purchase the living copy of this book to read this premium chapter.`
      }
    ]
  },
  {
    id: 'go-grpc-microservices',
    title: 'Go Microservices & High-Performance gRPC',
    author: 'Ken Thompson',
    category: 'Backend & Cloud',
    description: 'Build concurrent, lightweight systems that handle millions of internal JSON/binary requests. Master gRPC streaming, protobuf schema design, and local network optimization.',
    thumbnailColor: 'from-cyan-500 to-teal-800',
    iconName: 'Server',
    price: 25.99,
    totalPages: 44,
    lastUpdated: '2026-05-25',
    currentVersion: 'v1.5.0',
    tags: ['Go', 'gRPC', 'Microservices', 'Concurrency'],
    coverUrl: '/images/go_grpc_cover.svg',
    updateHistory: [
      {
        version: 'v1.5.0',
        date: '2026-05-25',
        changes: ['Added HTTP/2 stream multiplexing configurations.', 'Refined dynamic protobuf payload structures.']
      }
    ],
    pages: [
      {
        pageNumber: 1,
        title: 'Go Concurrency Archetypes',
        content: `Go’s compiler handles thousands of concurrent threads (goroutines) scheduled elegantly on physical CPU cores. This architecture scales systems with next to zero memory overhead.`
      },
      {
        pageNumber: 2,
        title: 'Protobuf Payloads and gRPC Streaming',
        content: `Avoid text-heavy JSON transfers. Learn to declare protobuf schemas and compile optimized binary encoders that deliver payloads up to 10 times faster than REST.`
      },
      {
        pageNumber: 3,
        title: 'Designing Custom Interceptors Middleware',
        content: `Intercept requests cleanly. Build secure authentication middleware, centralized error handling loggers, and tracing interceptors without boilerplate clutter.`
      },
      {
        pageNumber: 4,
        title: 'UNLOCKED: High Availability Dynamic Load Balancing',
        content: `This page is locked! You must purchase the living copy of this book to read this premium chapter.`
      }
    ]
  }
];
