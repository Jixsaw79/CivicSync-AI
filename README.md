# CivicPulse AI

**Smart Citizen Grievance & Resource Optimizer**  
*Integrated public-data intelligence for planning.*

CivicPulse AI is a frontend-only Smart Nation hackathon prototype. It demonstrates how citizen-reported infrastructure issues can be organized into an urban operations workflow with simulated AI triage, zone-level issue intelligence, department routing, and resource-prioritization recommendations.

## Prototype features

- Executive dashboard with active-report, high-severity-zone, budget-estimate, and dispatch-time indicators.
- Interactive schematic city-zone density map with report filtering.
- Citizen report simulator with image preview, issue category, zone, and description.
- Simulated 1.5-second AI triage flow for category, severity, duplicate-cluster hint, and municipal-unit assignment.
- Searchable, filterable report queue with dispatch and resolution workflows.
- Browser-local report persistence across refreshes (localStorage).
- Traditional versus optimized sample budget allocation chart.
- Ranked maintenance queue with urgency, affected-population estimate, and repair-cost estimate.

## Tech stack

- React + Vite
- Tailwind CSS
- lucide-react
- Recharts

## Run locally

Requires Node.js 18 or newer.

```bash
npm install
npm run dev
```

Create a production build:

```bash
npm run build
npm run preview
```

## Deploy to Vercel

1. Import this GitHub repository into Vercel.
2. Keep the framework preset as **Vite**.
3. Build command: `npm run build`.
4. Output directory: `dist`.
5. No environment variables or backend services are required.

## Demo notes and limitations

- All seed data is synthetic and intended for demonstration.
- AI triage is a deterministic local simulation; no external AI model is called.
- The uploaded image is previewed in the browser only. It is not transmitted or analyzed.
- The city-zone visualization is a schematic grid, not a geospatial map.
- Budget, savings, population-impact, and dispatch-time figures are illustrative estimates, not audited outcomes.
- Reports and dispatch changes persist in the current browser using localStorage; clearing site data or switching browsers/devices resets the demo state.
- Uploaded images are validated (PNG/JPG/WEBP, up to 5 MB), previewed locally, and never uploaded.
- No real municipal department is connected. Department assignment is shown as a prototype workflow.

## Frontend quality checks

A GitHub Actions workflow builds the production bundle on pushes to the improvement branches and on pull requests targeting `main`. Run the same check locally with `npm install` followed by `npm run build`.

## Suggested next steps

For a later production iteration, add a secure API, authentication and role-based access, persistent storage, geocoding, validated public datasets, real multimodal AI with human review, audit logs, and accessibility testing.
