import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

export default async (req: VercelRequest, res: VercelResponse) => {
  // 1. Nur POST-Anfragen erlauben
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    // 2. Umgebungsvariablen sicher laden
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('Supabase URL or Service Key not set in environment variables');
      return res.status(500).json({ error: 'Server configuration error' });
    }

    // 3. Supabase-Client initialisieren
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
        auth: {
            persistSession: false
        }
    });

    // 4. E-Mail aus dem Request-Body extrahieren
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    // 5. Magic Link senden
    const { data, error } = await supabase.auth.signInWithOtp({
      email: email,
      options: {
        // Die URL, zu der der Benutzer nach dem Klick auf den Link weitergeleitet wird.
        emailRedirectTo: new URL('/', req.headers.origin || 'https://druid-five.vercel.app').toString(),
      },
    });

    // 6. Fehlerbehandlung
    if (error) {
      console.error('Supabase signInWithOtp error:', error.message);
      return res.status(500).json({ error: error.message });
    }

    // 7. Erfolgsantwort senden
    return res.status(200).json({ message: 'Magic link sent successfully', data });

  } catch (err: any) {
    console.error('Internal server error:', err.message);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
