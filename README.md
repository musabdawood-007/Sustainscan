# SustainScan Pro

> **Built by [Musab Projects](https://musab-007.netlify.app)** — a project group by Musab Dawood

A smart food waste auditor for university cafeterias. Students log what they didn't eat and why, while administrators analyze waste patterns and track financial losses in PKR.

---

## Features

- **Two User Roles:**
  - **Student** — Register, submit waste reports, view analytics chart and financial loss stats
  - **Admin** — View all logs, manage food menu, search/filter waste data
- **Chart.js Analytics** — Bar chart showing waste by item and total financial loss
- **Menu Management** — Admins can add/delete food items (persisted via localStorage)
- **Waste Reporting** — Product name, price in PKR, and reason (Bad Taste, Too Much, Cold, Other)
- **Welcome/Logout Animations** — Splash screen and fade transitions
- **About Page** — Developer credits with portfolio link
- **Project Poster** — Standalone promotional page (`poster.html`)

## Tech Stack

| Layer | Technology |
|---|---|
| Markup | HTML5 |
| Styling | Tailwind CSS (CDN) + Custom CSS (glassmorphism) |
| Scripting | Vanilla JavaScript |
| Charting | Chart.js (CDN) |
| Icons | Font Awesome 6 (CDN) |
| Fonts | Google Fonts (Poppins, Montserrat) |
| Data Persistence | localStorage (no backend) |

## Project Structure

```
Sustain Scan/
├── index.html    — Main application (all views, modals, header, footer)
├── script.js     — Auth, dashboards, chart, localStorage logic
├── style.css     — Custom CSS (glassmorphism, animations)
└── poster.html   — Standalone project poster/presentation page
```

## How to Run

Open `index.html` directly in any modern web browser. All dependencies loaded via CDN.

```bash
npx serve .
```

> **Note:** All data is stored in localStorage — there is no backend.

## License

Built by [Musab Projects](https://musab-007.netlify.app) — a project group by Musab Dawood.
