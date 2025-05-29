import { supabase } from './supabase';

// Fonction pour ajouter un stream
export const addStream = async (streamData) => {
  const { data, error } = await supabase
    .from('streams')
    .insert([streamData])
    .select();
  
  if (error) throw error;
  return data[0];
};

// Fonction pour récupérer tous les streams
export const getStreams = async () => {
  const { data, error } = await supabase
    .from('streams')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
};

// Fonction pour mettre à jour un stream
export const updateStream = async (id, updates) => {
  const { data, error } = await supabase
    .from('streams')
    .update(updates)
    .eq('id', id)
    .select();
  
  if (error) throw error;
  return data[0];
};

// Fonction pour supprimer un stream
export const deleteStream = async (id) => {
  const { error } = await supabase
    .from('streams')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
  return true;
};
