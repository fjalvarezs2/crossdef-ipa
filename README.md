# crossdef-ipa

French spelling exercises with live **IPA** transcription.  
**Frontend:** AngularJS + Angular Material · **Backend:** Node/Express + `espeak`

## ✨ Features
- Frequency-based **Levels 1–5** (top 8k French words; JSON in `web/lib/level-*.json`)
- **Difficult words** set for common French spelling traps (`web/lib/difficult-1.json`)
- Live **IPA** via `espeak` backend: `GET /cgi-bin/transcriptioner?lang=fr&word=...`
- **TTS**: speak current exercise + speak typed word (Web Speech API)
- **Toggles**: Show/Hide IPA (dictated / typed), preference saved locally
- **Accent toolbar**: click to insert é/è/ê/à/ç/œ/… into the input
- Clean UI: aligned IPA rows & tidy mistakes table

## 🚀 Quick start

### Requirements
- Node.js 18+ and npm
- `espeak` CLI  
  macOS (Homebrew): `brew install espeak`

### Install & run (two processes)
```bash
npm install
# API on 3000, web on 8081 (no cache)
npm run serve:api
npx http-server web -p 8081 -c-1
# open http://localhost:8081

