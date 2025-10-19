Documentation Search Instructions for Claude Code (CodeSoul)

Table of Contents

Critical Search Protocol

Official Documentation Links

Search Strategies by Feature

Implementation Verification Process

Troubleshooting Documentation

Version Compatibility Checking



Critical Search Protocol

(This section remains unchanged as it is high-level guidance.)



Official Documentation Links

🎯 Primary Technology Stack Documentation

Next.js \& React

\## Next.js

\- \*\*Main Documentation\*\*: https://nextjs.org/docs

\- \*\*App Router\*\*: https://nextjs.org/docs/app

\- \*\*Routing\*\*: https://nextjs.org/docs/app/building-your-application/routing

\- \*\*API Routes\*\*: https://nextjs.org/docs/app/building-your-application/routing/route-handlers

\- \*\*Deployment (Vercel)\*\*: https://vercel.com/docs



\## React

\- \*\*Main Documentation\*\*: https://react.dev/

\- \*\*Hooks Reference\*\*: https://react.dev/reference/react



Backend \& Data

\## GitHub API (GraphQL)

\- \*\*Main Documentation\*\*: https://docs.github.com/en/graphql

\- \*\*Explorer\*\*: https://docs.github.com/en/graphql/overview/explorer

\- \*\*Schema Reference\*\*: https://docs.github.com/en/graphql/reference



\## Supabase

\- \*\*Main Documentation\*\*: https://supabase.com/docs

\- \*\*JS Client\*\*: https://supabase.com/docs/reference/javascript/introduction

\- \*\*Storage\*\*: https://supabase.com/docs/guides/storage

\- \*\*Database\*\*: https://supabase.com/docs/guides/database



\## OpenAI

\- \*\*Main Documentation\*\*: https://platform.openai.com/docs

\- \*\*API Reference\*\*: https://platform.openai.com/docs/api-reference

\- \*\*Node.js Library\*\*: https://github.com/openai/openai-node



Authentication

\## NextAuth.js

\- \*\*Main Documentation\*\*: https://next-auth.js.org/

\- \*\*GitHub Provider\*\*: https://next-auth.js.org/providers/github

\- \*\*Supabase Adapter\*\*: https://next-auth.js.org/adapters/supabase

\- \*\*App Router Setup\*\*: https://next-auth.js.org/configuration/initialization#app-router



State Management \& Data Fetching

\## React Query / TanStack Query

\- \*\*Main Documentation\*\*: https://tanstack.com/query/latest/docs/react/overview

\- \*\*`useQuery`\*\*: https://tanstack.com/query/latest/docs/react/reference/useQuery

\- \*\*`useMutation`\*\*: https://tanstack.com/query/latest/docs/react/reference/useMutation



\## Zustand

\- \*\*Main Documentation\*\*: https://docs.pmnd.rs/zustand/getting-started/introduction

\- \*\*TypeScript Guide\*\*: https://docs.pmnd.rs/zustand/guides/typescript



Visualization

\## Three.js

\- \*\*Main Documentation\*\*: https://threejs.org/docs/

\- \*\*Examples\*\*: https://threejs.org/examples/



\## React Three Fiber (R3F)

\- \*\*Main Documentation\*\*: https://docs.pmnd.rs/react-three-fiber/getting-started/introduction

\- \*\*Hooks\*\*: https://docs.pmnd.rs/react-three-fiber/api/hooks



\## React Three Drei

\- \*\*Main Documentation\*\*: https://github.com/pmndrs/drei

\- \*\*Components\*\*: (Browse the Readme for components like <OrbitControls>)



Search Strategies by Feature

🔍 Feature-Specific Search Instructions

Authentication Implementation

\## When implementing GitHub OAuth, search in this order:



1\. \*\*NextAuth.js Documentation\*\*

&nbsp;  - Search: "next-auth github provider app router"

&nbsp;  - URL: https://next-auth.js.org/providers/github

&nbsp;  - Look for: `clientId`, `clientSecret` setup in `lib/auth.ts`.



2\. \*\*NextAuth.js Supabase Adapter\*\*

&nbsp;  - Search: "next-auth supabase adapter setup"

&nbsp;  - URL: https://next-auth.js.org/adapters/supabase

&nbsp;  - Look for: Schema setup, `authOptions` configuration.



3\. \*\*NextAuth.js Client Hooks\*\*

&nbsp;  - Search: "next-auth useSession"

&nbsp;  - Look for: Usage of `useSession`, `signIn`, `signOut` in client components.



GitHub Data Fetching

\## When fetching repo data, search:



1\. \*\*GitHub GraphQL API Explorer\*\*

&nbsp;  - Search: "github graphql explorer"

&nbsp;  - URL: https://docs.github.com/en/graphql/overview/explorer

&nbsp;  - Look for: Build your query first (branches, commits, merges).



2\. \*\*Fetching from Next.js API Route\*\*

&nbsp;  - Search: "nextjs api route fetch graphql"

&nbsp;  - Look for: How to make a secure, server-to-server request to GitHub.



3\. \*\*React Query Integration\*\*

&nbsp;  - Search: "react query useQuery fetch nextjs api"

&nbsp;  - Look for: How to call your internal `/api/github/process` route using `useQuery`.



Three.js Visualization

\## When building the viz, search:



1\. \*\*React Three Fiber (R3F) Docs\*\*

&nbsp;  - Search: "react three fiber setup canvas"

&nbsp;  - URL: https://docs.pmnd.rs/react-three-fiber/getting-started/introduction

&nbsp;  - Look for: How to set up the `<Canvas>` component.



2\. \*\*React Three Drei (Drei) Docs\*\*

&nbsp;  - Search: "drei orbitcontrols" or "drei text"

&nbsp;  - URL: https://github.com/pmndrs/drei

&nbsp;  - Look for: Useful components like `<OrbitControls>`, `<Text>`, `<Line>`.



3\. \*\*Three.js Examples\*\*

&nbsp;  - Search: "three.js particle system example" or "three.js line geometry"

&nbsp;  - URL: https://threejs.org/examples/

&nbsp;  - Look for: The core Three.js logic for creating the visual elements (neurons, synapses, trees).

