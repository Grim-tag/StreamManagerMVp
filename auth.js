// Utilisation des fonctions serverless pour l'authentification Twitch
// Les clés d'API sont maintenant stockées en toute sécurité sur le serveur

document.getElementById('loginBtn').addEventListener('click', async () => {
  try {
    // Appel à notre fonction serverless pour obtenir l'URL d'authentification
    const response = await fetch('/api/twitch-auth');
    const data = await response.json();
    
    if (response.ok && data.authUrl) {
      // Redirection vers l'URL d'authentification Twitch
      window.location = data.authUrl;
    } else {
      console.error('Erreur lors de la génération de l\'URL d\'authentification:', data.error);
      alert('Erreur lors de l\'authentification. Veuillez réessayer.');
    }
  } catch (error) {
    console.error('Erreur lors de l\'appel à la fonction d\'authentification:', error);
    alert('Erreur de connexion au serveur. Veuillez réessayer.');
  }
});

window.onload = () => {
  // Vérifier les paramètres d'URL pour l'authentification
  const urlParams = new URLSearchParams(window.location.search);
  const accessToken = urlParams.get('access_token');
  const refreshToken = urlParams.get('refresh_token');
  const userDataParam = urlParams.get('user');
  
  if (accessToken && userDataParam) {
    try {
      // Décoder les informations utilisateur
      const userData = JSON.parse(decodeURIComponent(userDataParam));
      
      // Stocker les tokens et les informations utilisateur
      localStorage.setItem('twitchAccessToken', accessToken);
      localStorage.setItem('twitchRefreshToken', refreshToken);
      localStorage.setItem('twitchUser', JSON.stringify(userData));
      
      // Afficher les informations utilisateur
      document.getElementById('profile').innerHTML = `
        <p>Bonjour ${userData.display_name} !</p>
        <img src="${userData.profile_image_url}" alt="Avatar">
      `;
      
      // Nettoyer l'URL pour des raisons de sécurité
      window.history.replaceState({}, document.title, '/');
    } catch (error) {
      console.error('Erreur lors du traitement des données utilisateur:', error);
    }
  } else if (localStorage.getItem('twitchAccessToken')) {
    // Si l'utilisateur est déjà connecté, récupérer ses informations
    const userData = JSON.parse(localStorage.getItem('twitchUser') || '{}');
    
    if (userData.display_name) {
      document.getElementById('profile').innerHTML = `
        <p>Bonjour ${userData.display_name} !</p>
        <img src="${userData.profile_image_url}" alt="Avatar">
      `;
    } else {
      // Si les informations utilisateur ne sont pas disponibles, les récupérer
      fetchUserData();
    }
  }
};

// Fonction pour récupérer les informations utilisateur via notre API serverless
async function fetchUserData() {
  try {
    const accessToken = localStorage.getItem('twitchAccessToken');
    
    if (!accessToken) return;
    
    const response = await fetch('/api/twitch-user', {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
    
    if (response.ok) {
      const userData = await response.json();
      localStorage.setItem('twitchUser', JSON.stringify(userData));
      
      document.getElementById('profile').innerHTML = `
        <p>Bonjour ${userData.display_name} !</p>
        <img src="${userData.profile_image_url}" alt="Avatar">
      `;
    } else if (response.status === 401) {
      // Token expiré, supprimer les informations de connexion
      localStorage.removeItem('twitchAccessToken');
      localStorage.removeItem('twitchRefreshToken');
      localStorage.removeItem('twitchUser');
    }
  } catch (error) {
    console.error('Erreur lors de la récupération des informations utilisateur:', error);
  }
}
