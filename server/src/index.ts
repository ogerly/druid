import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import { supabase } from './lib/supabaseClient';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors({ origin: 'http://localhost:5173', credentials: true })); // Erlaube Anfragen vom Frontend
app.use(bodyParser.json());
app.use(cookieParser());

const AUTH_COOKIE_NAME = 'sb-auth-token';

/**
 * @route POST /api/auth/signin
 * @desc Meldet einen Benutzer mit E-Mail und Passwort an.
 * Bei Erfolg wird ein httpOnly Cookie mit dem Access Token gesetzt.
 */
app.post('/api/auth/signin', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'E-Mail und Passwort sind erforderlich.' });
  }

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return res.status(401).json({ message: error.message });
  }

  if (data.session) {
    res.cookie(AUTH_COOKIE_NAME, data.session.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: data.session.expires_in * 1000,
    });
    return res.status(200).json({ user: data.user });
  } else {
    return res.status(401).json({ message: 'Anmeldung fehlgeschlagen.' });
  }
});

/**
 * @route POST /api/auth/signout
 * @desc Meldet den Benutzer ab und löscht das Authentifizierungs-Cookie.
 */
app.post('/api/auth/signout', async (req, res) => {
  // Obwohl der Token aus dem Cookie gelesen werden könnte, um serenseitig abzumelden,
  // löschen wir für eine stateless Architektur einfach das Client-Cookie.
  res.clearCookie(AUTH_COOKIE_NAME);
  // Serverseitiges Abmelden ist auch eine gute Praxis, falls der Token kompromittiert wurde.
  const token = req.cookies[AUTH_COOKIE_NAME];
  if (token) {
      await supabase.auth.signOut(token);
  }
  return res.status(200).json({ message: 'Erfolgreich abgemeldet' });
});

/**
 * @route GET /api/auth/user
 * @desc Ruft den aktuellen Benutzer basierend auf dem Cookie ab.
 */
app.get('/api/auth/user', async (req, res) => {
  const token = req.cookies[AUTH_COOKIE_NAME];

  if (!token) {
    return res.status(401).json(null); // Kein Token, also kein Benutzer
  }

  const { data: { user }, error } = await supabase.auth.getUser(token);

  if (error) {
    return res.status(401).json(null); // Token ungültig
  }

  return res.status(200).json(user);
});

// Health-Check-Route
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'API is running' });
});

// Server starten
app.listen(port, () => {
  console.log(`[server]: API server is running at http://localhost:${port}`);
});
