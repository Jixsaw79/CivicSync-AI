# Security policy and deployment boundaries

## Scope

CivicSync AI is a public hackathon demonstration. It is not an authenticated civic service and must not be used to submit real citizen records or sensitive personal information.

The following limitations are intentional and must remain clear during demos:

- Citizen, Department Staff and Administrator are presentation modes only. They do not authenticate users or enforce permissions.
- Reports and workflow changes are stored in the current browser's local storage. There is no shared database or server-side record ownership.
- The Gemini triage endpoint is publicly callable. The in-memory request throttle is only a best-effort burst guard and is not shared across serverless instances.
- Civic Insights is deterministic rule-based analysis of browser-supplied demo snapshots, not an authoritative operational decision.
- Image evidence is optimized and retained locally in the browser. It is not uploaded to the API or sent to Gemini.
- Sample locations, departments, service targets, costs, impact estimates and all seeded records are synthetic. No DNCC or government system is connected.

## Current defensive controls

- Gemini API credentials are read only from server-side environment variables.
- API routes validate methods, content type, origin, request size and input fields.
- Gemini output is validated and normalized before it is returned to the client.
- API responses disable caching and set defensive response headers.
- Vercel deployment headers include a Content Security Policy, anti-framing policy, MIME sniffing protection and a restrictive Permissions Policy.
- Browser-persisted report records are validated before use; uploaded images are compressed and retained within a bounded local evidence set.
- Automated tests and a production build run in GitHub Actions. CodeQL scans JavaScript/TypeScript, and Dependabot monitors package and GitHub Actions updates.

These controls reduce risk; they do not make the demo invulnerable.

## Required deployment controls

Before exposing the Gemini endpoint to a broad public audience:

1. Configure Vercel Firewall or an equivalent edge/API gateway rate limit specifically for `POST /api/demo/triage`. The in-memory throttle is not a substitute.
2. Set `GEMINI_API_KEY` only in the server-side Vercel environment. Never use a `VITE_` prefix, commit secrets, or paste keys into chat or issue reports.
3. Configure usage quotas and billing alerts for the Google AI project.
4. Review Vercel deployment logs and provider usage for unexpected request spikes.

The demo's simulated roles are not security boundaries. Do not put confidential records or privileged actions behind the role selector.

## Repository maintainer checklist

The repository owner should configure the following GitHub settings (the current contributor connection does not have repository-administration permission):

- Protect `main`: require pull requests, require the Frontend CI and CodeQL checks, dismiss stale approvals when appropriate, and block force pushes and branch deletion.
- Enable Dependabot security updates and private vulnerability reporting where available.
- Review Dependabot and CodeQL alerts promptly.
- Restrict who can change deployment secrets and production environment settings.
- Keep the Vercel project connected to the intended repository and production branch.

## If this becomes more than a prototype

A real service would need a threat model and independent security review, identity and server-enforced authorization, server-side durable storage with ownership rules, distributed rate limiting, abuse monitoring, privacy controls and retention policies, secure evidence upload handling, operational incident response, and appropriate legal/government approvals. None of those capabilities is supplied by this prototype.

## Reporting a vulnerability

Please avoid posting secrets, personal data or exploitable details in public issues. If GitHub private vulnerability reporting is enabled for this repository, use that channel; otherwise contact the repository maintainer privately.
