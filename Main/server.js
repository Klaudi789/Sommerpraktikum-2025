const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

const PORT = 3000;
const DATA_FILE = path.join(__dirname, 'data.json');

app.use(express.json());  // Damit req.body als JSON geparst wird
// Ordner für statische Dateien (HTML, CSS, JS, Bilder)
app.use(express.static(path.join(__dirname, 'public')));

// API: Daten laden
app.get('/api/data', (req, res) => {
  fs.readFile(DATA_FILE, 'utf8', (err, data) => {
    if (err) {
      console.error('Fehler beim Lesen der Datei:', err);
      return res.status(500).json({ error: 'Daten konnten nicht geladen werden.' });
    }
    res.json(JSON.parse(data));
  });
});

// API: Daten speichern (überschreibt die ganze Datei)
app.post('/api/data', (req, res) => {
  const newData = req.body;
  fs.writeFile(DATA_FILE, JSON.stringify(newData, null, 2), 'utf8', (err) => {
    if (err) {
      console.error('Fehler beim Schreiben der Datei:', err);
      return res.status(500).json({ error: 'Daten konnten nicht gespeichert werden.' });
    }
    res.json({ message: 'Daten erfolgreich gespeichert' });
  });
});

app.listen(PORT, () => {
  console.log(`Server läuft auf http://localhost:${PORT}`);
});
