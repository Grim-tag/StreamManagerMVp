// Fonction serverless pour gérer l'authentification Twitch
const fetch = require('node-fetch');

// Récupération des variables d'environnement
const TWITCH_CLIENT_ID = process.env.TWITCH_CLIENT_ID;
const TWITCH_CLIENT_SECRET = process.env.TWITCH_CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI || 'https://streammanagermvp.netlify.app/.netlify/functions/twitch-auth-callback';

exports.handler = async (event, context) => {
  // CORS headers pour permettre les requêtes cross-origin
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  };

  // Gestion des requêtes OPTIONS (pre-flight)
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ message: 'CORS preflight successful' }),
    };
  }

  try {
    // Génération de l'URL d'authentification Twitch
    const authUrl = `https://id.twitch.tv/oauth2/authorize?client_id=${TWITCH_CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=user:read:email`;

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ authUrl }),
    };
  } catch (error) {
    console.error('Erreur lors de la génération de l\'URL d\'authentification:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Erreur serveur lors de l\'authentification' }),
    };
  }
};
