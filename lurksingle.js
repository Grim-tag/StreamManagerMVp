
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
  const hash = window.location.hash.substr(1);
  const result = hash.split('&').reduce((res, item) => {
    const [key, value] = item.split('=');
    res[key] = value;
    return res;
  }, {});

  // Configuration Twitch - Client ID nécessaire pour l'API Twitch
  const TWITCH_CLIENT_ID = '4ytiv41aszrka8xsaupu67mr7jxsaw';

  if (result.access_token) {
    fetch('https://api.twitch.tv/helix/users', {
      headers: {
        'Authorization': `Bearer ${result.access_token}`,
        'Client-ID': TWITCH_CLIENT_ID
      }
    })
    .then(response => response.json())
    .then(data => {
      const user = data.data[0];
      localStorage.setItem('twitchAccessToken', result.access_token);
      localStorage.setItem('twitchDisplayName', user.display_name);
      localStorage.setItem('twitchAvatar', user.profile_image_url);
      updateProfileUI(user);
    });
  } else if (localStorage.getItem('twitchAccessToken')) {
    updateProfileUI({
      display_name: localStorage.getItem('twitchDisplayName'),
      profile_image_url: localStorage.getItem('twitchAvatar')
    });
  }

  renderStreamers();
  autoSwitch();
  setInterval(autoSwitch, 20000);
};

logoutBtn.addEventListener('click', () => {
  localStorage.removeItem('twitchAccessToken');
  localStorage.removeItem('twitchDisplayName');
  localStorage.removeItem('twitchAvatar');
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
