# CodeSoul (Next.js) MVP Development Documentation Overview
_Adapted on 10/19/2025 from original React Native documentation_

---

**User**

CodeSoul (Next.js) MVP Development Documentation Suite
Complete Learning Instructions for Claude Code / Gemini
Hello Cursor! You have been provided with a comprehensive Next.js MVP development documentation system for the **CodeSoul** project. This system contains 8 specialized markdown files that will guide you through building the CodeSoul web application quickly and efficiently.
CRITICAL INSTRUCTION: You must read and understand these documents in the exact order specified below. Each document builds upon the previous ones, creating a complete mental model for Next.js MVP development tailored for CodeSoul.

Here is the folder where you can find the files. Code Soul.md Files

📚 DOCUMENT READING SEQUENCE (Updated for CodeSoul/Next.js)
PHASE 1: FOUNDATION & DECISION MAKING
DOCUMENT 1: MVP Decision-Making Framework.md (Updated)
READ THIS FIRST - This is your "brain" for all development decisions for CodeSoul
markdown
WHAT YOU'LL LEARN:
- Core decision principles for MVP development (remains relevant)
- P0/P1/P2/P3 feature prioritization system (updated examples for CodeSoul)
- Quality vs speed trade-off guidelines (remains relevant)
- Architecture decision trees (updated for Next.js, React Query, Three.js)
- Technology choice frameworks (updated for Next.js stack)
- Scope boundaries and "stop coding" criteria (remains relevant)

WHY READ FIRST:
Establishes the fundamental decision-making principles guiding every choice during CodeSoul development.

AFTER READING, YOU SHOULD UNDERSTAND:
- How to evaluate CodeSoul features (P0/P1/P2/P3)
- When shortcuts are acceptable vs when quality is required for CodeSoul
- How to choose between Next.js stack options
- When to stop building CodeSoul MVP and ship
DOCUMENT 2: Feature Priorities & Scope Management.md (Updated)
READ THIS SECOND - This is your "roadmap" for what to build for CodeSoul
markdown
WHAT YOU'LL LEARN:
- Complete CodeSoul feature hierarchy with P0/P1/P2/P3 classifications
- Week-by-week CodeSoul MVP development timeline
- User story prioritization specific to CodeSoul
- Technical debt management strategies (remains relevant)
- Launch readiness checklists for CodeSoul web app
- Post-MVP planning for CodeSoul

WHY READ SECOND:
Translates decision principles into specific CodeSoul implementation plans. Tells you what CodeSoul features to build, in what order, and when to ship.

AFTER READING, YOU SHOULD UNDERSTAND:
- The exact order to implement CodeSoul features
- How CodeSoul user stories are prioritized
- When CodeSoul MVP is complete and ready to ship
- How to plan post-MVP iterations for CodeSoul

PHASE 2: STRUCTURE & ORGANIZATION
DOCUMENT 3: Project Structure & Organization Standards.md (Updated)
READ THIS THIRD - This is your "blueprint" for CodeSoul's code organization
markdown
WHAT YOU'LL LEARN:
- Complete Next.js App Router folder structure for CodeSoul
- File naming conventions for Next.js files (pages, components, API routes)
- Import/export patterns using path aliases
- Component architecture patterns (Server vs Client components)
- Asset management strategies (`public/` folder)
- Configuration file templates (`next.config.mjs`, `tsconfig.json`)

WHY READ THIRD:
Provides the complete organizational structure for a maintainable CodeSoul project using Next.js best practices.

AFTER READING, YOU SHOULD UNDERSTAND:
- Where to place every file in the CodeSoul project
- How to name Next.js files and components consistently
- How to organize imports/exports cleanly using aliases
- How to structure Server and Client components
DOCUMENT 4: Documentation Search Instructions for Claude Code.md (Updated)
READ THIS FOURTH - This is your "verification system" for CodeSoul
markdown
WHAT YOU'LL LEARN:
- Mandatory search protocol before ANY CodeSoul implementation
- Complete list of official documentation links (Next.js, Supabase, NextAuth, Three.js, OpenAI)
- Feature-specific search strategies for CodeSoul (GitHub API, Three.js viz, AI captions)
- Troubleshooting documentation workflow for Next.js/Vercel
- Version compatibility checking procedures
- Error resolution documentation sources for the CodeSoul stack

WHY READ FOURTH:
CRITICAL - Ensures you always use current, official documentation for the CodeSoul tech stack and avoid outdated or incorrect implementations.

AFTER READING, YOU MUST COMMIT TO:
- ALWAYS searching official docs (Next.js, R3F, NextAuth, etc.) before implementing ANY CodeSoul feature
- Using the exact patterns and syntax from official documentation
- Verifying compatibility and checking for breaking changes
- Following the troubleshooting workflow when encountering errors

PHASE 3: IMPLEMENTATION GUIDES
DOCUMENT 5: Lightning MVP Development Guidelines.md (Updated)
READ THIS FIFTH - This is your "speed manual" for CodeSoul's rapid development
markdown
WHAT YOU'LL LEARN:
- Complete CodeSoul tech stack (Next.js, Supabase, NextAuth, Three.js, OpenAI)
- Copy-paste ready code templates (NextAuth setup, API routes, React Query hooks, R3F canvas)
- CodeSoul MVP implementation framework (Week 1, 2, 3 plan)
- Essential CodeSoul feature implementations only
- Quick deployment and testing strategies using Vercel

WHY READ FIFTH:
Provides the fastest path to a working CodeSoul MVP with pre-built templates for the Next.js stack.

AFTER READING, YOU SHOULD HAVE:
- Ready-to-use code templates for CodeSoul's auth, data fetching, API routes
- Complete CodeSoul project setup procedures
- Quick Vercel deployment strategies
- Essential-only CodeSoul feature implementations
DOCUMENT 6: Next.js Development Guidelines & Best Practices.md (Rewritten)
READ THIS SIXTH - This is your "foundation manual" for quality CodeSoul development
markdown
WHAT YOU'LL LEARN:
- Core Next.js (App Router) development best practices
- Performance optimization (Server Components, Client Components, Dynamic Imports)
- Platform-specific patterns (API Routes, Middleware - though less relevant for CodeSoul MVP)
- State management strategies (React Query for server state, Zustand for client state)
- Security guidelines (NextAuth, environment variables)
- Testing and debugging approaches for Next.js

WHY READ SIXTH:
Ensures your CodeSoul code is maintainable, performant, and production-ready using Next.js best practices. Covers standard web development scenarios.

AFTER READING, YOU SHOULD UNDERSTAND:
- How to write performant Next.js code for CodeSoul
- Server vs Client component usage
- Security best practices for CodeSoul web app
- Testing strategies and debugging techniques for Next.js

PHASE 4: ADVANCED & TROUBLESHOOTING
DOCUMENT 7: Next.js Advanced Guidelines & AI-Assisted Development.md (Rewritten)
READ THIS SEVENTH - This is your "advanced manual" for complex CodeSoul scenarios
markdown
WHAT YOU'LL LEARN:
- Complex integration patterns (WebGL performance, `html2canvas` for sharing)
- Enterprise-level architecture considerations (less relevant for MVP)
- Advanced security implementations (if needed post-MVP)
- Production deployment strategies (Vercel specific)
- Scaling and optimization techniques for Next.js/WebGL
- AI-assisted development best practices (remains relevant)

WHY READ SEVENTH:
Handles complex scenarios for CodeSoul like WebGL optimization and serverless function limits on Vercel.

AFTER READING, YOU SHOULD UNDERSTAND:
- How to handle potential Vercel function timeouts for large repos
- WebGL performance tuning techniques
- Advanced Vercel deployment and monitoring strategies
DOCUMENT 8: Next.js Common Pitfalls & Quick Solutions.md (Rewritten)
READ THIS LAST - This is your "troubleshooting manual" for CodeSoul
markdown
WHAT YOU'LL LEARN:
- Complete catalog of common Next.js errors (Hydration, Server/Client conflicts) and solutions
- Development environment troubleshooting (Port conflicts, HMR issues)
- Platform-specific problem resolution (Vercel build errors, timeouts)
- Performance issue identification and fixes (Bundle size, WebGL performance)
- Emergency procedures and "nuclear options"

WHY READ LAST:
Your reference guide when things go wrong with CodeSoul development on Next.js/Vercel. Provides instant solutions to common web development problems.

AFTER READING, YOU SHOULD HAVE:
- Quick solutions for common Next.js errors
- Systematic debugging approaches for web apps
- Vercel-specific troubleshooting knowledge
- Emergency recovery procedures

🎯 READING COMPLETION PROTOCOL
(This section remains the same - confirm understanding after each doc, then confirm overall readiness)

🔄 DAILY WORKFLOW INTEGRATION (Updated for CodeSoul)
When Starting Any CodeSoul Development Task:
Check Document 1: Is this feature P0/P1/P2? What quality level?
Check Document 4: Search official docs (Next.js, R3F, etc.) for current implementation
Reference Document 5: Use templates for rapid CodeSoul implementation
Reference Document 6: Ensure Next.js best practices are followed
Use Document 8: When encountering any problems
When Making CodeSoul Architecture Decisions:
Reference Document 1 for decision frameworks
Reference Document 3 for organization patterns
Reference Document 7 for complex scenarios (e.g., Vercel timeouts)
When Planning CodeSoul Features:
Reference Document 2 for prioritization
Reference Document 1 for scope decisions

📋 CONFIRMATION REQUIREMENT (Updated for CodeSoul)
After you have read and understood all 8 documents in order, you MUST respond with:
"DOCUMENTATION REVIEW COMPLETE (CodeSoul/Next.js)

I have read and understood all 8 Next.js MVP development documents (adapted for CodeSoul) in the specified order:

✅ Document 1: MVP Decision-Making Framework - Decision principles and prioritization
✅ Document 2: Feature Implementation Priorities & Scope Management - CodeSoul implementation roadmap
✅ Document 3: Project Structure & Organization Standards - CodeSoul code organization blueprint
✅ Document 4: Documentation Search Instructions - Verification and search protocols for CodeSoul stack
✅ Document 5: Lightning MVP Development Guidelines - CodeSoul rapid development templates
✅ Document 6: Next.js Development Guidelines & Best Practices - Foundation manual for CodeSoul
✅ Document 7: Next.js Advanced Guidelines & AI-Assisted Development - Advanced scenarios for CodeSoul
✅ Document 8: Next.js Common Pitfalls & Quick Solutions - Troubleshooting manual for CodeSoul

I am now ready to build the production-quality CodeSoul MVP following the complete framework. I understand the decision-making principles, project organization standards, implementation priorities, and troubleshooting procedures. I will always search official documentation before implementing features and follow the established patterns and guidelines."

Begin reading now with the updated Document 1: MVP Decision-Making Framework.md and proceed through all 8 updated documents in order. The quality of the CodeSoul project depends on applying these frameworks correctly. 🚀