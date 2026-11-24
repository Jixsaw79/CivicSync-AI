# Hackathon presentation walkthrough

This is a short presenter-led route through the prototype. Use only the public sample records and demo credentials.

## Suggested 3–4 minute sequence

1. **Start as a visitor.** Open the site without signing in. Explain that the public overview and sample reports are browsable without an account.
2. **Show the city view.** Open the map and issue queue. Point out that locations and metrics are illustrative, not official DNCC data.
3. **Show the citizen flow.** Open Profile · Sign in and choose the Citizen sample account. Submit a synthetic issue description (at least 8 characters), optionally select a zone, and run AI triage.
4. **Explain the AI result.** Open the created report. Show the suggested category, severity, department, safety flags and evidence-based rationale. Explain that the model self-assessment is not calibrated and that a human must verify the result.
5. **Show assignment.** Sign out, enter the Administrator sample account, and assign the new report to a sample staff member.
6. **Show staff work.** Sign out, enter the Department Staff sample account, open the work queue, and start the assigned report.
7. **Show the timeline.** Open the report again and point out the recorded status events. If desired, complete the resolution flow and show citizen feedback.
8. **Close with the boundary.** Explain that report state is stored in the current browser only; no complaint reaches DNCC and no live government integration exists.

## Public sample credentials

| Role | Email | Password |
|---|---|---|
| Citizen | `citizen@civicsync.demo` | `Citizen@123` |
| Department staff | `staff@civicsync.demo` | `Staff@123` |
| Administrator | `admin@civicsync.demo` | `Admin@123` |

These credentials are public and embedded in the frontend for presentation. They are not private accounts.

## Before presenting

- Configure `GEMINI_API_KEY` in Vercel server-side environment variables and test the triage endpoint on the deployed preview.
- If Gemini is not configured, do not claim the AI flow is live. The app should report the configuration error instead of fabricating a result.
- Test the full role-switching sequence in one browser. Browser-local storage means state is not shared across devices.
- Test the website on a phone as well as a desktop.
- Avoid entering real personal information or uploading sensitive images.
