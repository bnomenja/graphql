# GraphQL

A single-page application that displays a personalized school profile by querying the Zone01 GraphQL API. Built with vanilla JavaScript, CSS custom properties, and SVG for data visualization.

## Features

- JWT authentication via login/password or login/email
- Profile overview (personal info, level, XP, audit ratio)
- Interactive SVG graphs:
  - XP progression over time
  - Project audit pass/fail ratio
  - Skills breakdown
- Responsive layout (desktop & mobile)
- No framework, no dependencies

## Project Structure

```
graphql/
├── css/
│   ├── variables.css       # Design tokens (colors, fonts, spacing)
│   ├── base.css            # Reset, global styles, shared components
│   ├── login.css
│   ├── main.css
│   ├── personnal.css
│   ├── progress.css
│   ├── project_audits.css
│   └── skills.css
├── js/
│   ├── api/
│   │   └── graphql.js      # Centralized GraphQL fetch
│   ├── utils/
│   │   ├── auth.js         # JWT helpers
│   │   └── dom.js          # View helpers (setView, showLoading, showError)
│   ├── views/
│   │   ├── login.js
│   │   ├── main.js
│   │   ├── personalInfo.js
│   │   ├── progress.js
│   │   ├── projectAudit.js
│   │   └── skills.js
│   ├── app.js              # Entry point & router
│   └── config.js           # API URLs
├── favicon.svg
└── index.html
```

## Getting Started

No build step required. Just serve the project with any static file server.

**With VS Code Live Server:**
Right-click `index.html` → Open with Live Server

**With Node.js:**
```bash
npx serve .
```

**With Python:**
```bash
python3 -m http.server 5500
```

Then open `http://localhost:5500` in your browser.

> ⚠️ The app must be served over HTTP (not opened as a file) because it uses ES modules.

## Authentication

The login page accepts:
- `username:password`
- `email:password`

Credentials are encoded in Base64 and sent to the Zone01 signin endpoint. On success, the JWT is stored in `localStorage` and used for all subsequent GraphQL requests via Bearer authentication.

## GraphQL Queries

All queries go through `js/api/graphql.js` which handles:
- Attaching the Bearer token from `localStorage`
- Throwing on `errors` returned by the API
- Returning `res.data` directly

Query types used:
- **Basic** — `user { login attrs }`
- **Nested** — `user { events { cohorts { labelName } } }`
- **With arguments** — `transaction(where: { type: { _eq: "xp" } }, order_by: { createdAt: asc })`

## Hosting

The app is hosted on: _[https://bnomenja.github.io/graphql/]_

## Tech

- Vanilla JavaScript (ES Modules)
- CSS custom properties
- SVG (hand-written, no library)
- GraphQL over HTTP
- JWT (Bearer authentication)

## Author

BEMAMORY Nomenjanahary Luciano Loic (**bnomenja**) — [Zone01 Oujda](https://learn.zone01oujda.ma)  
GitHub: [github.com/bnomenja](https://github.com/bnomenja)