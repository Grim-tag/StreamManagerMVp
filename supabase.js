import { createClient } from '@supabase/supabase-js'

// Utilisation de variables d'environnement pour les clés d'API
// En production, ces valeurs seront définies dans les variables d'environnement Netlify
const supabaseUrl = process.env.SUPABASE_URL || 'https://your-project-url.supabase.co';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || 'your-anon-key';

// Pour le développement local, vous pouvez utiliser un fichier .env (à ne pas committer)
// ou définir les variables directement dans Netlify

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
