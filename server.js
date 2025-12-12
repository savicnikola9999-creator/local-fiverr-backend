const express = require("express");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();

const app = express();
app.use(cors());
app.use(express.json());

const db = new sqlite3.Database("./database.sqlite");

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE,
    password TEXT
  )`);
});

app.get("/", (req, res) => {
  res.send("Local Fiverr backend radi ✅");
});

const PORT = process.env.PORT || 3001;

// REGISTRACIJA
app.post("/register", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email i lozinka su obavezni" });
  }

  db.run(
    "INSERT INTO users (email, password) VALUES (?, ?)",
    [email, password],
    function (err) {
      if (err) {
        return res.status(400).json({ message: "Korisnik već postoji" });
      }
      res.json({ message: "Registracija uspešna ✅" });
    }
  );
});
<hr>

<h2>Prijava</h2>
<input id="loginEmail" placeholder="Email"><br>
<input id="loginPassword" type="password" placeholder="Lozinka"><br>
<button onclick="login()">Prijavi se</button>

<p id="loginStatus"></p>

// LOGIN
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  db.get(
    "SELECT * FROM users WHERE email = ? AND password = ?",
    [email, password],
    (err, user) => {
      if (!user) {
        return res.status(401).json({ message: "Pogrešan email ili lozinka" });
      }
      res.json({ message: "Login uspešan ✅" });
    }
  );
});


app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;

  db.get(
    "SELECT id, email FROM users WHERE email = ? AND password = ?",
    [email, password],
    (err, row) => {
      if (err) {
        return res.status(500).json({ message: "Greška na serveru" });
      }

      if (!row) {
        return res.status(401).json({ message: "Pogrešan email ili lozinka" });
      }

      res.json({
        message: "Uspešna prijava",
        user: row
      });
    }
  );
});


