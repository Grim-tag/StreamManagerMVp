// Configuration Twitch - Les informations d'identification sont stockées dans des constantes
// Dans une application plus sécurisée, ces valeurs seraient gérées par un backend
const TWITCH_CLIENT_ID = '4ytiv41aszrka8xsaupu67mr7jxsaw'; // Client ID public nécessaire pour l'API Twitch
const TWITCH_REDIRECT_URI = 'https://streammanagermvp.netlify.app/'; // URL de redirection après authentification

document.getElementById('loginBtn').addEventListener('click', () => {
  const scope = 'user:read:email';

  window.location = `https://id.twitch.tv/oauth2/authorize?client_id=${TWITCH_CLIENT_ID}&redirect_uri=${TWITCH_REDIRECT_URI}&response_type=token&scope=${scope}`;
});

window.onload = () => {
  const hash = window.location.hash.substr(1);
  const result = hash.split('&').reduce((res, item) => {
    const [key, value] = item.split('=');
    res[key] = value;
    return res;
  }, {});

  if (result.access_token) {
    fetch('https://api.twitch.tv/helix/users', {
      headers: {
        'Authorization': `Bearer ${result.access_token}`,
        'Client-ID': TWITCH_CLIENT_ID // Utilisation de la constante définie en haut du fichier
      }
    })
    .then(response => response.json())
    .then(data => {
      const user = data.data[0];
      document.getElementById('profile').innerHTML = `
        <p>Bonjour ${user.display_name} !</p>
        <img src="${user.profile_image_url}" alt="Avatar">
      `;
    });
  }
};
