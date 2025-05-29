import { getStreams, addStream, updateStream, deleteStream } from './db.js';

// Éléments du DOM
const streamList = document.getElementById('streamList');
const addStreamForm = document.getElementById('addStreamForm');
const streamContainer = document.getElementById('streamContainer');

// Charger les streams au chargement de la page
document.addEventListener('DOMContentLoaded', loadStreams);

// Fonction pour charger et afficher les streams
async function loadStreams() {
  try {
    const streams = await getStreams();
    renderStreams(streams);
  } catch (error) {
    console.error('Erreur lors du chargement des streams:', error);
    alert('Erreur lors du chargement des streams');
  }
}

// Afficher les streams dans la sidebar
function renderStreams(streams) {
  streamList.innerHTML = '';
  
  streams.forEach(stream => {
    const li = document.createElement('li');
    li.textContent = stream.title;
    li.dataset.id = stream.id;
    li.addEventListener('click', () => showStream(stream));
    
    // Bouton de suppression
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = '×';
    deleteBtn.className = 'delete-btn';
    deleteBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (confirm(`Supprimer le stream "${stream.title}" ?`)) {
        deleteStreamHandler(stream.id);
      }
    });
    
    li.appendChild(deleteBtn);
    streamList.appendChild(li);
  });
}

// Afficher un stream dans le conteneur principal
function showStream(stream) {
  streamContainer.innerHTML = `
    <div class="stream-player">
      <h2>${stream.title}</h2>
      <iframe 
        src="${stream.url}" 
        frameborder="0" 
        allowfullscreen
        width="100%" 
        height="100%">
      </iframe>
    </div>
  `;
}

// Gérer l'ajout d'un nouveau stream
addStreamForm?.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const title = document.getElementById('streamTitle').value;
  const url = document.getElementById('streamUrl').value;
  
  try {
    await addStream({
      title,
      url,
      created_at: new Date().toISOString()
    });
    
    // Réinitialiser le formulaire
    addStreamForm.reset();
    // Recharger la liste
    await loadStreams();
  } catch (error) {
    console.error('Erreur lors de l\'ajout du stream:', error);
    alert('Erreur lors de l\'ajout du stream');
  }
});

// Gérer la suppression d'un stream
async function deleteStreamHandler(streamId) {
  try {
    await deleteStream(streamId);
    await loadStreams();
    // Vider le conteneur si le stream supprimé était affiché
    if (streamContainer.querySelector('iframe')?.src.includes(streamId)) {
      streamContainer.innerHTML = '<p>Sélectionnez un stream à afficher</p>';
    }
  } catch (error) {
    console.error('Erreur lors de la suppression:', error);
    alert('Erreur lors de la suppression du stream');
  }
}
