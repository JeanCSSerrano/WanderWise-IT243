// --- 1. GLOBAL VARIABLES ---
const locations = [
    { id: 1, name: "Burnham Park", lat: 16.4123795, lng: 120.5929704, desc: "The heart of the city.", crowdLevel: "High" },
    { id: 2, name: "Mines View Observation Deck", lat: 16.4195651, lng: 120.6278588, desc: "Scenic view.", crowdLevel: "Medium" },
    { id: 3, name: "Wright Park", lat: 16.4156997, lng: 120.6172233, desc: "Horseback riding.", crowdLevel: "Low" },
    { id: 4, name: "Camp John Hay Art Park", lat: 16.399424, lng: 120.613264, desc: "Pine trees.", crowdLevel: "Low" },
    { id: 5, name: "Botanical Garden", lat: 16.4150118, lng: 120.6129064, desc: "Gardens.", crowdLevel: "Medium" }
];

let modal;
let openModal; // Define globally

document.addEventListener('DOMContentLoaded', () => {
    
    // --- MAP SETUP ---
    const map = L.map('map').setView([16.41106, 120.59332], 14);
    
    const streetmap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    const satelliteMap = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles &copy; Esri'
    });

    const MapLayers = {
        "Street View": streetmap,
        "Satellite View": satelliteMap
    };

    L.control.layers(MapLayers).addTo(map);

    // --- MODAL SETUP (FIXED) ---
    // Fix 1: Match the ID in your HTML
    modal = document.getElementById("recommendation-modal");

    // Fix 2: Use querySelector because your HTML uses a class, not an ID
    const close = document.querySelector(".modalclose-btn");

    openModal = function() {
        modal.style.display = "block";
    }

    if (close) {
        close.onclick = function() {
            modal.style.display = "none";
        }
    }
    
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    };
    
    // --- MARKERS & SIDEBAR (These will work now that the crash is gone) ---
    const markers = {}; 

    locations.forEach(loc => {
        const marker = L.marker([loc.lat, loc.lng]).addTo(map);
        
        marker.bindPopup(`
            <b>${loc.name}</b><br>
            Status: ${loc.crowdLevel}<br>
            <button onclick="calculateScore(${loc.id})">Get Recommendation</button>
        `);

        markers[loc.id] = marker;
    });

    const cards = document.querySelectorAll('.card');
    cards.forEach((card, index) => {
        card.addEventListener('click', () => {
            const loc = locations[index]; 
            if (loc) {
                map.flyTo([loc.lat, loc.lng], 17);
                markers[loc.id].openPopup();
                if(window.innerWidth < 500) {
                    document.getElementById('sidebar').classList.remove('active');
                }
            }
        });
    });

    // --- SIDEBAR TOGGLE ---
    const menuBtn = document.getElementById('menuToggle');
    const closeBtn = document.getElementById('closeSidebar');
    const sidebar = document.getElementById('sidebar');

    if (menuBtn && sidebar) {
        menuBtn.addEventListener('click', () => {
            sidebar.classList.toggle('active');
        });
    }

    if (closeBtn && sidebar) {
        closeBtn.addEventListener('click', () => {
            sidebar.classList.remove('active');
        });
    }
});

// --- THE CALCULATE FUNCTION ---
function calculateScore(id) {
    console.log("Opening for ID: " + id);
    openModal();
}