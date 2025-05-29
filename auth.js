// Authentification Twitch avec flux implicite
// Utilisation de l'API Twitch directement pour une meilleure compatibilité

// Gestionnaire d'événement pour le bouton de connexion
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

// Gestionnaire d'événement pour le bouton de déconnexion
document.getElementById('logoutBtn').addEventListener('click', () => {
  handleLogout();
});

window.onload = () => {
  // Vérifier le fragment d'URL (hash) pour l'authentification implicite Twitch
  if (window.location.hash) {
    // Extraire les paramètres du fragment d'URL
    const hashParams = window.location.hash.substring(1).split('&').reduce((params, param) => {
      const [key, value] = param.split('=');
      params[key] = value;
      return params;
    }, {});
    
    // Récupérer le token d'accès
    const accessToken = hashParams.access_token;
    
    if (accessToken) {
      // Stocker le token d'accès
      localStorage.setItem('twitchAccessToken', accessToken);
      
      // Afficher l'interface utilisateur connecté
      document.getElementById('loginBtn').style.display = 'none';
      document.getElementById('logoutBtn').style.display = 'inline-block';
      
      // Récupérer les informations de l'utilisateur
      fetchUserInfo(accessToken);
      
      // Nettoyer l'URL pour des raisons de sécurité
      window.history.replaceState({}, document.title, '/');
    }
  } else if (localStorage.getItem('twitchAccessToken')) {
    // Si l'utilisateur est déjà connecté, récupérer ses informations
    const userData = JSON.parse(localStorage.getItem('twitchUser') || '{}');
    
    // Afficher l'interface utilisateur connecté
    document.getElementById('loginBtn').style.display = 'none';
    document.getElementById('logoutBtn').style.display = 'inline-block';
    
    if (userData.display_name) {
      // Afficher les informations utilisateur si disponibles
      displayUserProfile(userData);
    } else {
      // Sinon, récupérer les informations utilisateur
      fetchUserInfo(localStorage.getItem('twitchAccessToken'));
    }
  }
};

// Fonction pour afficher le profil utilisateur
function displayUserProfile(userData) {
  // Récupérer l'élément de profil
  const profileElement = document.getElementById('profile');
  
  // Afficher les informations utilisateur avec une mise en page améliorée
  profileElement.innerHTML = `
    <img src="${userData.profile_image_url}" alt="Avatar">
    <p>Bonjour ${userData.display_name} !</p>
  `;
  
  // Afficher le bouton de déconnexion et masquer le bouton de connexion
  document.getElementById('loginBtn').style.display = 'none';
  document.getElementById('logoutBtn').style.display = 'inline-block';
  
  // Ajouter une classe pour indiquer que l'utilisateur est connecté
  document.body.classList.add('user-logged-in');

}

// Fonction pour récupérer les informations utilisateur directement depuis l'API Twitch
async function fetchUserInfo(accessToken) {
  try {
    if (!accessToken) return;
    
    // Appel direct à l'API Twitch pour récupérer les informations utilisateur
    const response = await fetch('https://api.twitch.tv/helix/users', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Client-ID': '4ytiv41aszrka8xsaupu67mr7jxsaw'
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      const userData = data.data[0];
      
      // Stocker les informations utilisateur
      localStorage.setItem('twitchUser', JSON.stringify(userData));
      
      // Afficher les informations utilisateur
      displayUserProfile(userData);
    } else if (response.status === 401) {
      // Token expiré, supprimer les informations de connexion
      handleLogout();
    }
  } catch (error) {
    console.error('Erreur lors de la récupération des informations utilisateur:', error);
  }
}

// Fonction pour récupérer les informations utilisateur via notre API serverless (fallback)
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
      displayUserProfile(userData);
    } else if (response.status === 401) {
      // Token expiré, supprimer les informations de connexion
      handleLogout();
    }
  } catch (error) {
    console.error('Erreur lors de la récupération des informations utilisateur:', error);
    // En cas d'erreur avec l'API serverless, essayer l'appel direct
    const accessToken = localStorage.getItem('twitchAccessToken');
    if (accessToken) {
      fetchUserInfo(accessToken);
    }
  }
}

// Fonction pour gérer la déconnexion
function handleLogout() {
  localStorage.removeItem('twitchAccessToken');
  localStorage.removeItem('twitchRefreshToken');
  localStorage.removeItem('twitchUser');
  
  // Réinitialiser l'interface utilisateur
  document.getElementById('loginBtn').style.display = 'inline-block';
  document.getElementById('logoutBtn').style.display = 'none';
  
  // Supprimer l'affichage du profil
  const profileElement = document.getElementById('profile');
  if (profileElement) {
    profileElement.innerHTML = '';
  }
}
