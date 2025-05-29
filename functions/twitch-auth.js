// Fonction serverless pour gérer l'authentification Twitch
const fetch = require('node-fetch');

// Récupération des variables d'environnement
const TWITCH_CLIENT_ID = process.env.TWITCH_CLIENT_ID || '4ytiv41aszrka8xsaupu67mr7jxsaw';
// Utilisation d'une redirection directe vers le frontend pour l'authentification implicite
const REDIRECT_URI = process.env.FRONTEND_URL || 'https://streammanagermvp.netlify.app';

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
    // Génération de l'URL d'authentification Twitch avec flux implicite (token directement retourné au frontend)
    // Ajout des paramètres pour déclencher la pop-up et forcer la vérification
    const authUrl = `https://id.twitch.tv/oauth2/authorize?client_id=${TWITCH_CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=token&scope=user:read:email%20user:read:follows&force_verify=true&claims=`;

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
