
const streamerList = document.getElementById('streamerList');
const streamContainer = document.getElementById('streamContainer');
const chatIframe = document.getElementById('chatIframe');
const channelNameEl = document.getElementById('channelName');
const viewerCountEl = document.getElementById('viewerCount');
const streamDurationEl = document.getElementById('streamDuration');
const profileInfo = document.getElementById('profileInfo');
const logoutBtn = document.getElementById('logoutBtn');

const connectedStreamers = ['grimtag', 'LincolnshireWildlifePark', 'tupollito_com'];
let currentIndex = 0;

function updateProfileUI(user) {
  profileInfo.innerHTML = `
    <img src="${user.profile_image_url}" alt="Avatar">
    <span>${user.display_name}</span>
  `;
}

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
      
      updateProfileUI(userData);
      
      // Nettoyer l'URL pour des raisons de sécurité
      window.history.replaceState({}, document.title, '/');
    } catch (error) {
      console.error('Erreur lors du traitement des données utilisateur:', error);
    }
  } else if (localStorage.getItem('twitchAccessToken')) {
    // Si l'utilisateur est déjà connecté, récupérer ses informations
    const userData = JSON.parse(localStorage.getItem('twitchUser') || '{}');
    
    if (userData.display_name) {
      updateProfileUI(userData);
    } else {
      // Si les informations utilisateur ne sont pas disponibles, les récupérer
      fetchUserData();
    }
  }

  renderStreamers();
  autoSwitch();
  setInterval(autoSwitch, 20000);
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
      updateProfileUI(userData);
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

logoutBtn.addEventListener('click', () => {
  // Supprimer toutes les informations d'authentification
  localStorage.removeItem('twitchAccessToken');
  localStorage.removeItem('twitchRefreshToken');
  localStorage.removeItem('twitchUser');
  
  // Rediriger vers la page d'accueil
  window.location.href = 'https://streammanagermvp.netlify.app/';
});

function renderStreamers() {
  streamerList.innerHTML = '';
  connectedStreamers.forEach(channel => {
    const li = document.createElement('li');
    li.textContent = channel;
    li.setAttribute('data-channel', channel);
    streamerList.appendChild(li);
  });
}

streamerList.addEventListener('click', (e) => {
  if (e.target && e.target.nodeName === 'LI') {
    const channel = e.target.getAttribute('data-channel');
    currentIndex = connectedStreamers.indexOf(channel);
    showStream(channel);
  }
});

function showStream(channel) {
  streamContainer.innerHTML = `<div id="twitch-embed"></div>`;
  chatIframe.src = `https://www.twitch.tv/embed/${channel}/chat?parent=streammanagermvp.netlify.app`;
  channelNameEl.textContent = channel;

  const player = new Twitch.Player("twitch-embed", {
    channel: channel,
    width: "100%",
    height: "100%",
    parent: ["streammanagermvp.netlify.app"]
  });
  player.setVolume(0.05); // Volume à 5%
}

function autoSwitch() {
  const channel = connectedStreamers[currentIndex];
  showStream(channel);
  currentIndex = (currentIndex + 1) % connectedStreamers.length;
}

new Twitch.Player("twitch-embed", {
  channel: channel,
  width: "100%",
  height: "100%",
  parent: ["streammanagermvp.netlify.app"]
}).setVolume(0.01);
