// Authentification Twitch avec flux implicite
// Utilisation de l'API Twitch directement pour une meilleure compatibilité

// Gestionnaire d'événement pour le bouton de connexion
document.getElementById('loginBtn').addEventListener('click', async () => {
  try {
    // Récupérer l'URL d'authentification depuis la fonction serverless
    const response = await fetch('/api/twitch-auth');
    const data = await response.json();
    
    // Ouvrir une fenêtre pop-up pour l'authentification Twitch
    const width = 500;
    const height = 700;
    const left = (window.screen.width - width) / 2;
    const top = (window.screen.height - height) / 2;
    
    const authWindow = window.open(
      data.authUrl,
      'TwitchAuth',
      `width=${width},height=${height},left=${left},top=${top},toolbar=0,location=0,menubar=0`
    );
    
    // Vérifier périodiquement si l'utilisateur s'est connecté
    const checkInterval = setInterval(() => {
      try {
        // Si la fenêtre est fermée ou redirigée vers notre domaine
        if (authWindow.closed) {
          clearInterval(checkInterval);
          // Vérifier si un token a été stocké
          if (localStorage.getItem('twitchAccessToken')) {
            console.log('Authentification réussie via pop-up');
            // Récupérer les informations utilisateur
            fetchUserInfo(localStorage.getItem('twitchAccessToken'));
          }
        }
      } catch (e) {
        // Une erreur se produit si la fenêtre a été redirigée vers un autre domaine
        // C'est normal et nous pouvons ignorer cette erreur
      }
    }, 500);
    
  } catch (error) {
    console.error('Erreur lors de la connexion:', error);
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
      console.log('Authentification réussie, token reçu');
      // Stocker le token d'accès
      localStorage.setItem('twitchAccessToken', accessToken);
      
      // Récupérer les informations de l'utilisateur immédiatement
      fetchUserInfo(accessToken);
      
      // Nettoyer l'URL pour des raisons de sécurité
      window.history.replaceState({}, document.title, '/');
    }
  } else if (localStorage.getItem('twitchAccessToken')) {
    console.log('Session existante détectée');
    // Si l'utilisateur est déjà connecté, récupérer ses informations
    const userData = JSON.parse(localStorage.getItem('twitchUser') || '{}');
    
    if (userData.display_name) {
      console.log('Informations utilisateur trouvées dans le stockage local');
      // Afficher les informations utilisateur si disponibles
      displayUserProfile(userData);
    } else {
      console.log('Récupération des informations utilisateur depuis l\'API');
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
    if (!accessToken) {
      console.error('Aucun token d\'accès fourni');
      return;
    }
    
    console.log('Récupération des informations utilisateur depuis l\'API Twitch...');
    
    // Appel direct à l'API Twitch pour récupérer les informations utilisateur
    const response = await fetch('https://api.twitch.tv/helix/users', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Client-ID': '4ytiv41aszrka8xsaupu67mr7jxsaw'
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('Données utilisateur reçues:', data);
      
      if (data.data && data.data.length > 0) {
        const userData = data.data[0];
        console.log('Informations utilisateur récupérées avec succès:', userData.display_name);
        
        // Stocker les informations utilisateur
        localStorage.setItem('twitchUser', JSON.stringify(userData));
        
        // Afficher les informations utilisateur
        displayUserProfile(userData);
      } else {
        console.error('Aucune donnée utilisateur reçue');
      }
    } else if (response.status === 401) {
      console.error('Token expiré ou invalide (401)');
      // Token expiré, supprimer les informations de connexion
      handleLogout();
    } else {
      console.error('Erreur lors de la récupération des informations utilisateur:', response.status);
      const errorText = await response.text();
      console.error('Détails de l\'erreur:', errorText);
    }
  } catch (error) {
    console.error('Exception lors de la récupération des informations utilisateur:', error);
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
