// Données d'exemple pour les véhicules
let vehicules = [
    {
        id: 1,
        marque: 'Renault',
        modele: 'Clio',
        annee: 2020,
        kilometrage: 45000,
        prix: 12500,
        carburant: 'Essence',
        image: 'images/clio.jpg',
        promotion: true,
        status: 'published',
        description: 'Très belle Renault Clio en excellent état. Première main, carnet d\'entretien à jour.'
    },
    {
        id: 2,
        marque: 'Peugeot',
        modele: '3008',
        annee: 2019,
        kilometrage: 62000,
        prix: 19800,
        carburant: 'Diesel',
        image: 'images/3008.jpg',
        status: 'published',
        description: 'Peugeot 3008 bien entretenue, tous les entretiens effectués chez Peugeot.'
    },
    {
        id: 3,
        marque: 'Volkswagen',
        modele: 'Golf',
        annee: 2021,
        kilometrage: 28000,
        prix: 22500,
        carburant: 'Hybride',
        image: 'images/golf.jpg',
        status: 'published',
        description: 'Volkswagen Golf hybride récente, faible consommation, parfait état.'
    }
];

// Annonces en attente de validation
let pendingAnnonces = [];

// Initialiser les filtres au chargement de la page
document.addEventListener('DOMContentLoaded', () => {
    loadAnnonces();
    initializeFilters();
    afficherVehicules(vehicules); // Afficher toutes les annonces
});

// Initialiser les options des filtres
function initializeFilters() {
    // Marques uniques
    const marques = [...new Set(vehicules.map(v => v.marque))];
    const marqueSelect = document.getElementById('marque');
    marqueSelect.innerHTML = '<option value="">Toutes les marques</option>';
    marques.forEach(marque => {
        const option = document.createElement('option');
        option.value = marque;
        option.textContent = marque;
        marqueSelect.appendChild(option);
    });

    // Prix
    const prixSelect = document.getElementById('prix');
    const prixRanges = [10000, 15000, 20000, 25000, 30000];
    prixSelect.innerHTML = '<option value="">Tous les prix</option>';
    prixRanges.forEach(prix => {
        const option = document.createElement('option');
        option.value = prix;
        option.textContent = `${prix.toLocaleString()} € max`;
        prixSelect.appendChild(option);
    });

    // Années
    const anneeSelect = document.getElementById('annee');
    const annees = [...new Set(vehicules.map(v => v.annee))].sort((a, b) => b - a);
    anneeSelect.innerHTML = '<option value="">Toutes les années</option>';
    annees.forEach(annee => {
        const option = document.createElement('option');
        option.value = annee;
        option.textContent = annee;
        anneeSelect.appendChild(option);
    });
}

// Filtrer les annonces
function filtrerAnnonces() {
    const marqueSelectionnee = document.getElementById('marque').value;
    const prixMax = document.getElementById('prix').value;
    const anneeSelectionnee = document.getElementById('annee').value;

    let vehiculesFiltres = vehicules;

    if (marqueSelectionnee) {
        vehiculesFiltres = vehiculesFiltres.filter(v => v.marque === marqueSelectionnee);
    }
    if (prixMax) {
        vehiculesFiltres = vehiculesFiltres.filter(v => v.prix <= parseInt(prixMax));
    }
    if (anneeSelectionnee) {
        vehiculesFiltres = vehiculesFiltres.filter(v => v.annee === parseInt(anneeSelectionnee));
    }

    afficherVehicules(vehiculesFiltres);
}

// Afficher les véhicules
function afficherVehicules(vehiculesAfficher) {
    const container = document.getElementById('vehicules-list');
    container.innerHTML = '';

    if (vehiculesAfficher.length === 0) {
        container.innerHTML = '<div class="col-12 text-center mt-4"><p>Aucune annonce ne correspond à vos critères</p></div>';
        return;
    }

    vehiculesAfficher.forEach(vehicule => {
        const card = document.createElement('div');
        card.className = 'col-md-4 mb-4';
        card.innerHTML = `
            <div class="card vehicle-card">
                ${vehicule.promotion ? '<span class="badge-promotion">Promotion</span>' : ''}
                <img src="${vehicule.image}" class="card-img-top" alt="${vehicule.marque} ${vehicule.modele}" onerror="this.src='images/default-car.jpg'">
                <button class="favorite-btn" onclick="toggleFavorite(this)">
                    <i class="far fa-heart"></i>
                </button>
                <div class="card-body">
                    <h5 class="card-title">${vehicule.marque} ${vehicule.modele}</h5>
                    <p class="price">${vehicule.prix.toLocaleString()} €</p>
                    <div class="vehicle-details">
                        <p><i class="fas fa-calendar"></i> ${vehicule.annee}</p>
                        <p><i class="fas fa-road"></i> ${vehicule.kilometrage.toLocaleString()} km</p>
                        <p><i class="fas fa-gas-pump"></i> ${vehicule.carburant}</p>
                    </div>
                    <p class="card-text text-muted">${vehicule.description || ''}</p>
                    <button class="btn btn-primary w-100 mt-3" onclick="voirDetails(${vehicule.id})">
                        <i class="fas fa-info-circle"></i> Voir les détails
                    </button>
                </div>
            </div>
        `;
        container.appendChild(card);
    });
}

// Gérer les favoris
function toggleFavorite(button) {
    const icon = button.querySelector('i');
    if (icon.classList.contains('far')) {
        icon.classList.replace('far', 'fas');
    } else {
        icon.classList.replace('fas', 'far');
    }
}

// Voir les détails d'une annonce
function voirDetails(id) {
    const vehicule = vehicules.find(v => v.id === id);
    if (vehicule) {
        // À implémenter : afficher les détails dans un modal ou rediriger vers une page de détails
        alert('Fonctionnalité à venir : voir les détails de l\'annonce');
    }
}

// Afficher le modal d'ajout d'annonce
function showAddAnnonceModal() {
    const modal = new bootstrap.Modal(document.getElementById('addAnnonceModal'));
    modal.show();
}

// Soumettre une nouvelle annonce
function submitAnnonce() {
    const form = document.getElementById('annonceForm');
    const formData = new FormData(form);
    
    const nouvelleAnnonce = {
        id: Date.now(),
        marque: formData.get('marque'),
        modele: formData.get('modele'),
        annee: parseInt(formData.get('annee')),
        kilometrage: parseInt(formData.get('kilometrage')),
        prix: parseInt(formData.get('prix')),
        carburant: formData.get('carburant'),
        description: formData.get('description'),
        status: 'pending',
        dateCreation: new Date().toISOString()
    };

    // Gérer l'image
    const fileInput = form.querySelector('input[type="file"]');
    const file = fileInput.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            nouvelleAnnonce.image = 'images/default-car.jpg'; // Par défaut, utiliser une image temporaire
            pendingAnnonces.push(nouvelleAnnonce);
            saveAnnonces();
            
            const modal = bootstrap.Modal.getInstance(document.getElementById('addAnnonceModal'));
            modal.hide();
            form.reset();
            alert('Votre annonce a été soumise et est en attente de validation.');
        };
        reader.readAsDataURL(file);
    }
}

// Sauvegarder les annonces dans le localStorage
function saveAnnonces() {
    localStorage.setItem('vehicules', JSON.stringify(vehicules));
    localStorage.setItem('pendingAnnonces', JSON.stringify(pendingAnnonces));
}

// Charger les annonces depuis le localStorage
function loadAnnonces() {
    const savedVehicules = localStorage.getItem('vehicules');
    const savedPending = localStorage.getItem('pendingAnnonces');
    
    if (savedVehicules) {
        vehicules = JSON.parse(savedVehicules);
    }
    if (savedPending) {
        pendingAnnonces = JSON.parse(savedPending);
    }
} 