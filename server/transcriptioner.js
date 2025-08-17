const express = require('express');
const cors = require('cors');
const { execFile } = require('child_process');

const app = express();
app.use(cors()); // dev only

app.get('/cgi-bin/transcriptioner', (req, res) => {
  const lang = (req.query.lang || 'fr').replace(/[^A-Za-z-]/g, '');
  const word = (req.query.word || '').slice(0, 100);
  if (!word) return res.status(400).json({ error: 'missing word' });
  execFile('espeak', ['-q', '--ipa=2', '-v', lang, word], { timeout: 3000 }, (err, stdout) => {
    if (err) return res.status(500).json({ error: String(err) });
    res.json({ transcriptions: { [lang]: stdout.trim() } });
  });
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log('IPA server on http://localhost:' + port));
