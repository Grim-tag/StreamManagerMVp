document.getElementById('loginBtn').addEventListener('click', () => {
  const clientId = '4ytiv41aszrka8xsaupu67mr7jxsaw'; // Ton vrai client ID Twitch
  const redirectUri = 'https://streammanagermvp.netlify.app/'; // Remplace par l’URL Netlify publique
  const scope = 'user:read:email';

  window.location = `https://id.twitch.tv/oauth2/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=token&scope=${scope}`;
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
        'Client-ID': '4ytiv41aszrka8xsaupu67mr7jxsaw' // Ton vrai client ID
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
