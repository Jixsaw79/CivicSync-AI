# CivicSync AI — DNCC hackathon simulation

## Purpose

CivicSync AI is a hackathon prototype that demonstrates how citizen-reported civic issues could move through AI-assisted triage, department routing and staff review for a Dhaka North City Corporation (DNCC)-inspired workflow.

This is **not** an official DNCC product, does not submit complaints to DNCC and is not affiliated with the government.

## Demonstration architecture

- **AI triage:** `POST /api/demo/triage` calls Google Gemini from a server-side function. The API key is never sent to the browser. Every recommendation is marked for human review.
- **Map:** OpenStreetMap tiles provide the geographic basemap. The points and neighborhood names are illustrative demo data; they are not official ward boundaries or verified ward assignments.
- **Municipal adapter:** `GET /api/demo/municipal` returns synthetic departments, sample ward labels and example service targets. It never contacts DNCC.
- **Workflow:** report status, dispatch actions, budget estimates and impact figures are synthetic demonstration values.
- **Persistence:** the current UI stores reports in browser localStorage. Data is local to the browser and is not a shared database.
- **Roles:** Citizen, Department Staff and Administrator are simulated presentation roles, not secure authenticated accounts or server-enforced permissions.

## Setup

1. Install dependencies with `npm install`.
2. Set `GEMINI_API_KEY` in the Vercel project environment (or another serverless deployment environment).
3. Deploy to Vercel so the `api/` serverless functions are available.
4. Open the deployed preview and submit a sample report. If the key is missing, the UI reports that real inference is not configured; it does not silently fake an AI result.

For local development, the Vite UI can run with `npm run dev`, but Vite alone does not execute Vercel API routes. Use the Vercel CLI's local development command to test the full API workflow.

## Demo data and safety

- Use synthetic names, descriptions, images and locations only.
- Do not enter real citizens' personal information.
- Do not display the prototype as an official DNCC complaint channel.
- Do not describe the illustrative points as DNCC ward polygons.
- Do not claim that a complaint was received by, assigned to or resolved by DNCC.
- Gemini output is an assistive classification suggestion, not a verified fact or automated government decision.

## What is intentionally out of scope

No government contact, DNCC API credential, official ward GIS file, municipal data-sharing agreement, production staff account or live complaint integration is needed for this hackathon demonstration. A real municipal deployment would be a separate project requiring authorization, verified data and security review.
