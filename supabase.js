import { createClient } from '@supabase/supabase-js'

// Dans une application front-end, les variables d'environnement doivent être injectées lors de la construction
// ou exposées via des variables globales spécifiques

// Pour Netlify, nous utilisons directement les valeurs car les variables d'environnement
// ne sont pas accessibles via process.env dans le navigateur
const supabaseUrl = 'https://qvpmzkniijkdxacvsalv.supabase.co';

// Nous utilisons la clé publique anon qui est sécurisée pour être utilisée côté client
// Cette clé est limitée aux opérations autorisées pour les utilisateurs anonymes
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF2cG16a25paWprZHhhY3ZzYWx2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg1MTE2NjksImV4cCI6MjA2NDA4NzY2OX0.ZaxvW75hTvkN13P3jWhBuUAg5iPlE9V7OUmcDGuB1Ow';

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
