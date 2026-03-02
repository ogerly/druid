import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Konfiguriert dotenv, um die .env-Datei im `server`-Verzeichnis zu laden.
dotenv.config(); 

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl) {
  throw new Error('Missing environment variable SUPABASE_URL in server/.env');
}
if (!supabaseServiceKey) {
  throw new Error('Missing environment variable SUPABASE_SERVICE_KEY in server/.env');
}

// Erstellt den Supabase-Client für die Server-Seite mit dem Service Key
export const supabase = createClient(supabaseUrl, supabaseServiceKey);
