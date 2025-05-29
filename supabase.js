import { createClient } from '@supabase/supabase-js'

// Remplacez ces valeurs par vos propres informations de projet Supabase
const supabaseUrl = 'https://qvpmzkniijkdxacvsalv.supabase.co' // Exemple: 'supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF2cG16a25paWprZHhhY3ZzYWx2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg1MTE2NjksImV4cCI6MjA2NDA4NzY2OX0.ZaxvW75hTvkN13P3jWhBuUAg5iPlE9V7OUmcDGuB1Ow' // La clé 'anon' de votre projet

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
