const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const db = new sqlite3.Database('users.db');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname)); // чтобы работал ваш HTML/CSS

// Создание таблицы пользователей
db.run(`CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE,
  password TEXT
)`);

// Регистрация
app.post('/register', (req, res) => {
  const { email, psw } = req.body;
  db.run('INSERT INTO users (email, password) VALUES (?, ?)', [email, psw], function(err) {
    if (err) return res.send('E-Mail schon vergeben!');
    res.send('Registrierung erfolgreich!');
  });
});

// Вход
app.post('/login', (req, res) => {
  const { login_email, login_psw } = req.body;
  db.get('SELECT * FROM users WHERE email = ? AND password = ?', [login_email, login_psw], (err, row) => {
    if (row) return res.send('Login erfolgreich!');
    res.send('Falsche E-Mail oder Passwort!');
  });
});

app.listen(3000, () => console.log('Server läuft auf http://localhost:3000'));