# Crossdef (recovered) — IntelliJ-friendly project

This project packages the recovered AngularJS (static) frontend and a small Node/Express backend
that calls `espeak` for IPA, so you can run everything locally and start extending it in IntelliJ.

## Prerequisites
- **Node.js 18+** (IntelliJ will detect it), `npm`
- **espeak** CLI (`brew install espeak` on macOS)

## Run (from CLI)
```bash
npm install
npm run dev
# web: http://localhost:8080
# api: http://localhost:3000/cgi-bin/transcriptioner?lang=fr&word=bonjour
```

## Run (from IntelliJ IDEA)
1. **File → Open…** and select this folder. IntelliJ will index the project from `package.json`.
2. Open **package.json**, click the green run icons next to the scripts:
   - `serve:api` to start the IPA backend
   - `serve:web` to serve the static frontend
   - or `dev` to run both at once (requires the devDependencies installed)
3. Go to **http://localhost:8080** in your browser.

## Project layout
```
server/transcriptioner.js   # Node/Express backend (uses espeak --ipa)
web/index.html              # Frontend entry (AngularJS 1.x)
web/lib/french_ex.js        # App logic (recovered)
web/lib/french_ex.css       # Styles (your CSS + header overrides)
web/lib/*.html              # Partials (exercise-*.html)
web/lib/*.json              # Word lists + ipa.json (sample data)
original/                   # Your original files, untouched
extras/                     # Earlier zips (if any) included here
```

## Notes
- `web/lib/french_ex.js` points to:
  - `domainServer = "lib/"` for local JSON
  - `domainEspeak = "http://localhost:3000/cgi-bin/transcriptioner"` for IPA
- Replace the sample JSON lists with your real ones when you have them.
