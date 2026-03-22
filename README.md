# GovtChatBot
[Open Project](https://chatbotguidejob.netlify.app/).
GovtChatBot is a recruiter-ready government job discovery demo built with React, Vite, and Express. It combines a guided AI-style interview, resume-assisted profile extraction, match scoring, and job-specific preparation roadmaps in a single interface.

The app is designed to feel like a smart job assistant rather than a static job board. A user can answer guided questions, upload resume text, view ranked job matches, and open a roadmap tailored to the job they select.

## What The Project Does

- Starts with a guided assistant conversation instead of a plain search form
- Asks 11 profile-building questions before generating matches
- Supports resume-based matching from text-readable resume files or pasted resume content
- Scores jobs using qualification, state, sector, urgency, and preference signals
- Re-ranks results using additional candidate preferences such as experience level, work style, relocation, and study pace
- Generates a roadmap for the selected job with milestones, checklist items, and candidate-specific signals
- Shows strategic advice, insights, and recommended next steps alongside the results

## Current User Flow

1. The assistant greets the user and starts a guided interview.
2. The user answers 11 questions about qualification, location, sector, experience, job type, language, relocation, and preparation preferences.
3. The app sends the collected profile to the backend and receives ranked jobs, advice, insights, and follow-up actions.
4. The user can also upload or paste resume text to infer profile signals automatically.
5. Clicking a matched job opens a preparation roadmap built for that role and the candidate profile.

## Matching Logic

The matching system currently uses a local rules-based scoring engine.

### Backend scoring

The Express API ranks jobs using:

- qualification eligibility
- preferred state vs. job location
- preferred sector vs. job sector
- text-query overlap with title, description, and skills
- urgency when the user asks for soon-closing or urgent roles

### Frontend enhancement

After the backend returns ranked jobs, the React app boosts scores further using:

- experience level
- job type preference
- exam timeline
- language comfort
- relocation flexibility
- work style
- priority focus

### Resume-assisted matching

Resume matching is currently heuristic, not OCR- or AI-model-based. The app reads text from supported file types or pasted resume content, then looks for:

- qualification keywords
- state names
- sector keywords
- a small catalog of known skill phrases

Those inferred signals are used to build the candidate profile and trigger a fresh match request.

## Important Limitations

- The project uses local demo job data from `server/data/portalData.js`, not a live government jobs feed.
- Resume parsing currently works best for text-readable files such as `.txt`, `.md`, `.json`, `.csv`, `.html`, and `.xml`.
- Binary resume formats like `.pdf` and `.docx` are not parsed in this build.
- The backend does not run an actual LLM. The "AI assistant" experience is implemented through structured frontend logic plus backend ranking rules.
- `Open Form` links are placeholder URLs in the mock dataset.

## Tech Stack

- React 19
- Vite 8
- Express 5
- Plain CSS for styling and animations
- No database in the current version

## Project Structure

```text
GovtChatBot/
|- src/
|  |- App.jsx            # Main application UI, guided flow, resume parsing, roadmap logic
|  |- index.css          # Theme, layout, animations, responsive behavior
|  |- main.jsx           # React entry point
|- server/
|  |- index.js           # Express server bootstrap
|  |- app.js             # API routes and ranking logic
|  |- data/
|     |- portalData.js   # Mock jobs, filters, hero content, default profile values
|- vite.config.js        # Vite config with /api proxy to localhost:4000
|- package.json
```

## API Endpoints

### `GET /api/health`

Returns a simple health check response.

### `GET /api/portal`

Returns initial UI content and seed data:

- hero content
- navigation items
- quick filters
- metrics
- profile defaults
- profile options
- initial ranked jobs
- insights
- follow-up actions
- advice summary

### `POST /api/chat`

Accepts:

```json
{
  "message": "Graduate banking jobs in Bihar",
  "profile": {
    "qualification": "Graduate",
    "state": "Bihar",
    "sector": "Bank"
  }
}
```

Returns:

- assistant reply
- ranked jobs
- insights
- follow-up actions
- advice summary

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Start the backend

```bash
npm run server
```

The Express API runs on `http://localhost:4000`.

### 3. Start the frontend

In a second terminal:

```bash
npm run dev
```

The Vite dev server proxies `/api` requests to the backend.

### 4. Open the app

Visit the local Vite URL shown in the terminal, usually:

```text
http://localhost:5173
```

## Build For Production

```bash
npm run build
```

To preview the production build locally:

```bash
npm run preview
```

## Suggested Demo Script

If you are presenting this project to a recruiter, a good flow is:

1. Start with the guided AI interview.
2. Answer a few questions to show profile-aware interaction.
3. Upload resume text to demonstrate automatic signal extraction.
4. Open the ranked matches panel and explain why the top job was selected.
5. Click a matched job to show the roadmap and checklist.

## Future Improvements

- Add real PDF and DOCX resume parsing
- Connect to a live government jobs source
- Replace heuristic matching with a stronger AI or embedding-based ranking layer
- Add saved profiles and persistent job tracking
- Add accessibility audits and formal contrast validation
- Add recruiter/demo analytics and exportable reports

## Status

This project is currently a polished frontend-plus-API demo focused on intelligent UX, profile-aware ranking, and clear job preparation guidance.
