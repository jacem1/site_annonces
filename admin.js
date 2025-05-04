// Charger les données au chargement de la page
document.addEventListener('DOMContentLoaded', () => {
    loadAnnonces();
    displayPendingAnnouncements();
    displayPublishedAnnouncements();
});

// Afficher les annonces en attente
function displayPendingAnnouncements() {
    const container = document.getElementById('pending-announcements');
    const pendingAnnonces = JSON.parse(localStorage.getItem('pendingAnnonces')) || [];
    
    if (pendingAnnonces.length === 0) {
        container.innerHTML = '<p class="text-muted">Aucune annonce en attente de validation</p>';
        return;
    }

    container.innerHTML = pendingAnnonces.map(annonce => `
        <div class="card mb-3">
            <div class="row g-0">
                <div class="col-md-3">
                    <img src="${annonce.image}" class="img-fluid rounded-start" alt="${annonce.marque} ${annonce.modele}">
                </div>
                <div class="col-md-9">
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-start">
                            <h5 class="card-title">${annonce.marque} ${annonce.modele}</h5>
                            <span class="badge bg-warning">En attente</span>
                        </div>
                        <p class="card-text">
                            <small class="text-muted">
                                Soumis le ${new Date(annonce.dateCreation).toLocaleDateString()}
                            </small>
                        </p>
                        <div class="vehicle-details mb-3">
                            <p><i class="fas fa-calendar"></i> ${annonce.annee}</p>
                            <p><i class="fas fa-road"></i> ${annonce.kilometrage.toLocaleString()} km</p>
                            <p><i class="fas fa-gas-pump"></i> ${annonce.carburant}</p>
                            <p><i class="fas fa-tag"></i> ${annonce.prix.toLocaleString()} €</p>
                        </div>
                        <p class="card-text">${annonce.description}</p>
                        <div class="btn-group">
                            <button class="btn btn-success" onclick="approveAnnonce(${annonce.id})">
                                <i class="fas fa-check"></i> Approuver
                            </button>
                            <button class="btn btn-danger" onclick="rejectAnnonce(${annonce.id})">
                                <i class="fas fa-times"></i> Rejeter
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

// Afficher les annonces publiées
function displayPublishedAnnouncements() {
    const container = document.getElementById('published-announcements');
    const vehicules = JSON.parse(localStorage.getItem('vehicules')) || [];
    const publishedVehicules = vehicules.filter(v => v.status === 'published');

    if (publishedVehicules.length === 0) {
        container.innerHTML = '<p class="text-muted">Aucune annonce publiée</p>';
        return;
    }

    container.innerHTML = publishedVehicules.map(vehicule => `
        <div class="card mb-3">
            <div class="row g-0">
                <div class="col-md-3">
                    <img src="${vehicule.image}" class="img-fluid rounded-start" alt="${vehicule.marque} ${vehicule.modele}">
                </div>
                <div class="col-md-9">
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-start">
                            <h5 class="card-title">${vehicule.marque} ${vehicule.modele}</h5>
                            <span class="badge bg-success">Publié</span>
                        </div>
                        <div class="vehicle-details mb-3">
                            <p><i class="fas fa-calendar"></i> ${vehicule.annee}</p>
                            <p><i class="fas fa-road"></i> ${vehicule.kilometrage.toLocaleString()} km</p>
                            <p><i class="fas fa-gas-pump"></i> ${vehicule.carburant}</p>
                            <p><i class="fas fa-tag"></i> ${vehicule.prix.toLocaleString()} €</p>
                        </div>
                        <button class="btn btn-danger" onclick="unpublishAnnonce(${vehicule.id})">
                            <i class="fas fa-trash"></i> Retirer l'annonce
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

// Approuver une annonce
function approveAnnonce(id) {
    const pendingAnnonces = JSON.parse(localStorage.getItem('pendingAnnonces')) || [];
    const vehicules = JSON.parse(localStorage.getItem('vehicules')) || [];
    
    const annonceIndex = pendingAnnonces.findIndex(a => a.id === id);
    if (annonceIndex !== -1) {
        const annonce = pendingAnnonces[annonceIndex];
        annonce.status = 'published';
        vehicules.push(annonce);
        pendingAnnonces.splice(annonceIndex, 1);
        
        localStorage.setItem('vehicules', JSON.stringify(vehicules));
        localStorage.setItem('pendingAnnonces', JSON.stringify(pendingAnnonces));
        
        displayPendingAnnouncements();
        displayPublishedAnnouncements();
    }
}

// Rejeter une annonce
function rejectAnnonce(id) {
    const pendingAnnonces = JSON.parse(localStorage.getItem('pendingAnnonces')) || [];
    const annonceIndex = pendingAnnonces.findIndex(a => a.id === id);
    
    if (annonceIndex !== -1) {
        pendingAnnonces.splice(annonceIndex, 1);
        localStorage.setItem('pendingAnnonces', JSON.stringify(pendingAnnonces));
        displayPendingAnnouncements();
    }
}

// Retirer une annonce publiée
function unpublishAnnonce(id) {
    const vehicules = JSON.parse(localStorage.getItem('vehicules')) || [];
    const vehiculeIndex = vehicules.findIndex(v => v.id === id);
    
    if (vehiculeIndex !== -1) {
        vehicules.splice(vehiculeIndex, 1);
        localStorage.setItem('vehicules', JSON.stringify(vehicules));
        displayPublishedAnnouncements();
    }
} 