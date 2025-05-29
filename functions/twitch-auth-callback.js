// Fonction serverless pour gérer le callback d'authentification Twitch
const fetch = require('node-fetch');

// Récupération des variables d'environnement
const TWITCH_CLIENT_ID = process.env.TWITCH_CLIENT_ID;
const TWITCH_CLIENT_SECRET = process.env.TWITCH_CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI || 'https://streammanagermvp.netlify.app/.netlify/functions/twitch-auth-callback';
const FRONTEND_URL = process.env.FRONTEND_URL || 'https://streammanagermvp.netlify.app';

exports.handler = async (event, context) => {
  // CORS headers
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
    // Récupération du code d'autorisation depuis les paramètres de la requête
    const code = event.queryStringParameters?.code;

    if (!code) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Code d\'autorisation manquant' }),
      };
    }

    // Échange du code contre un token d'accès
    const tokenResponse = await fetch('https://id.twitch.tv/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: TWITCH_CLIENT_ID,
        client_secret: TWITCH_CLIENT_SECRET,
        code,
        grant_type: 'authorization_code',
        redirect_uri: REDIRECT_URI,
      }),
    });

    const tokenData = await tokenResponse.json();

    if (!tokenResponse.ok) {
      console.error('Erreur lors de l\'échange du code:', tokenData);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'Erreur lors de l\'échange du code d\'autorisation' }),
      };
    }

    // Récupération des informations de l'utilisateur
    const userResponse = await fetch('https://api.twitch.tv/helix/users', {
      headers: {
        'Authorization': `Bearer ${tokenData.access_token}`,
        'Client-ID': TWITCH_CLIENT_ID,
      },
    });

    const userData = await userResponse.json();

    if (!userResponse.ok) {
      console.error('Erreur lors de la récupération des informations utilisateur:', userData);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'Erreur lors de la récupération des informations utilisateur' }),
      };
    }

    // Redirection vers le frontend avec les tokens et les informations utilisateur
    return {
      statusCode: 302,
      headers: {
        ...headers,
        'Location': `${FRONTEND_URL}?access_token=${tokenData.access_token}&refresh_token=${tokenData.refresh_token}&user=${encodeURIComponent(JSON.stringify(userData.data[0]))}`,
      },
      body: JSON.stringify({ message: 'Redirection vers le frontend' }),
    };
  } catch (error) {
    console.error('Erreur lors du traitement du callback:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Erreur serveur lors du traitement du callback' }),
    };
  }
};
