# CivicSync AI

**AI-assisted civic issue reporting and municipal workflow prototype**  
*Hackathon demonstration for a DNCC-inspired service workflow.*

CivicSync AI demonstrates how a citizen report could be analyzed, mapped, routed to a municipal department and reviewed by staff. It is a prototype only: it is not an official DNCC service and does not send complaints to the government.

## Features

- Executive dashboard with synthetic issue, severity and resource indicators.
- OpenStreetMap basemap centered on Dhaka North with illustrative neighborhood markers.
- Citizen issue submission with image preview and client-side validation.
- Real Gemini-powered triage through a server-side API endpoint.
- Synthetic department routing through a mock DNCC adapter.
- Demonstration report queue with dispatch and resolution workflow.
- Simulated Citizen, Department Staff and Administrator presentation roles.
- Browser-local persistence through localStorage.
- Dark mode, responsive layout and reduced-motion support.

## Technology

- React 18 + Vite
- Tailwind CSS
- Leaflet + React Leaflet + OpenStreetMap
- Recharts
- Vercel serverless functions
- Google Gemini API (server-side)

## Run the frontend

Requires Node.js 18 or newer.

```bash
npm install
npm run dev
```

Vite serves the frontend only. The Gemini and mock municipal API routes live in `api/` and are executed by Vercel, not by the Vite development server. To test the full workflow locally, use the Vercel CLI and run `vercel dev`.

## Configure real AI inference

Set `GEMINI_API_KEY` as a server-side environment variable in Vercel. Optionally set `GEMINI_MODEL` (defaults to `gemini-2.5-flash`). Never add the key to a `VITE_*` variable or commit it to Git.

If the key is missing or Gemini fails, the app shows an error and does not create a fake AI result.

## Deploy a hackathon preview

1. Import the repository into Vercel.
2. Use the Vite framework preset.
3. Build command: `npm run build`.
4. Output directory: `dist`.
5. Add `GEMINI_API_KEY` to the Vercel environment.
6. Deploy and test the API routes on the preview URL.

## Demo accounts and data

The role selector switches between Citizen, Department Staff and Administrator presentation modes. These are **simulated roles**, not authenticated accounts or server-enforced access controls.

Reports and status changes persist in the current browser using localStorage. They are not shared between browsers or users. Seed reports, issue density, budget figures, population impact, dispatch times, sample departments, ward labels and service targets are synthetic.

## DNCC simulation boundary

- `GET /api/demo/municipal` returns mock departments, sample ward labels and illustrative service targets.
- `POST /api/demo/triage` uses Gemini for real inference and marks every result as requiring human review.
- `GET /api/dncc` is a backwards-compatible alias for the mock municipal adapter.
- Map tiles are from OpenStreetMap; the plotted points are illustrative neighborhood coordinates, not official ward polygons.
- No complaint is sent to DNCC, no government data is queried and no official status is retrieved.
- No government contact or permission is required for this hackathon prototype.

## Privacy and safety

Use synthetic data during judging. Do not enter real citizen personal information. The current upload preview remains local to the browser and is not uploaded or analyzed by Gemini. AI triage is decision support only; staff review is required.

## Validation

Run:

```bash
npm test
npm run build
```

The CI workflow should run the same checks on the pull request. A successful build does not mean that deployment secrets or Gemini connectivity have been configured.
