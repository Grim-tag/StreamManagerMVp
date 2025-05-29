// Fonction serverless pour récupérer les informations utilisateur Twitch
const fetch = require('node-fetch');

// Récupération des variables d'environnement
const TWITCH_CLIENT_ID = process.env.TWITCH_CLIENT_ID;

exports.handler = async (event, context) => {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
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
    // Récupération du token d'accès depuis les headers
    const authHeader = event.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({ error: 'Token d\'authentification manquant ou invalide' }),
      };
    }

    const accessToken = authHeader.split(' ')[1];

    // Récupération des informations de l'utilisateur
    const userResponse = await fetch('https://api.twitch.tv/helix/users', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
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

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(userData.data[0]),
    };
  } catch (error) {
    console.error('Erreur lors de la récupération des informations utilisateur:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Erreur serveur lors de la récupération des informations utilisateur' }),
    };
  }
};
