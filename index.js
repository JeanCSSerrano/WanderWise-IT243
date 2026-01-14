// GLOBAL VARIABLES
const locations = [
    { 
        id: 1, 
        name: "Burnham Park", 
        lat: 16.4123795, 
        lng: 120.5929704, 
        venue_address: "Jose Abad Santos Dr Baguio 2600 Benguet Philippines", 
        desc: "The heart of the city.", 
        crowdLevel: "High" 
    },
    { 
        id: 2, 
        name: "Mines View Observation Deck", 
        lat: 16.4195651, 
        lng: 120.6278588, 
        venue_address: "Mines View Baguio Benguet Philippines", 
        desc: "Scenic view.", 
        crowdLevel: "Medium" 
    },
    { 
        id: 3, 
        name: "Wright Park", 
        lat: 16.4156997, 
        lng: 120.6172233, 
        venue_address: "The Mansion Romulo Dr Baguio Benguet, Philippines", 
        desc: "Horseback riding.", 
        crowdLevel: "Low" 
    },
    { 
        id: 4, 
        name: "Camp John Hay Art Park", 
        lat: 16.399424, 
        lng: 120.613264, 
        venue_address: "9JX7+Q86 Camp John Hay, Baguio 2600 Benguet Philippines", 
        desc: "Pine trees.", 
        crowdLevel: "Low" 
    },
    { 
        id: 5, 
        name: "Botanical Garden", 
        lat: 16.4150118, 
        lng: 120.6129064, 
        venue_address: "37 Leonard Wood Rd Baguio 2600 Benguet Philippines", 
        desc: "Gardens.", 
        crowdLevel: "Medium" 
    }
];

let modal;
let openModal;

document.addEventListener('DOMContentLoaded', () => {
    
    // MAP SETUP 
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

    // MODAL SETUP 
    modal = document.getElementById("recommendation-modal");

    // FIX 1: Use the specific selector so it finds the correct close button (not the sidebar one)
    const close = document.querySelector(".close-btn");

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
    
    // MARKERS AND SIDEBAR DESIGN
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

    // SIDEBAR FUNCTIONALITY
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

// ALGORITHM NGANI
function calculateScore(id) {

    const place = locations.find(loc => loc.id === id);
    console.log("Getting Data for: " + id);

    // FIX 2: Move this to the TOP. 
    // You want the modal to open and say "Loading..." BEFORE you fetch the data.
    if (typeof openModal === "function") {
        // FIX 3: Changed double quotes "" to backticks `` so ${place.name} actually works
        document.getElementById("modal-title").innerText = `Analysis for ${place.name}`;
        // FIX 4: Changed ID to "modal-body" to match your HTML (you had "modal-text")
        document.getElementById("modal-body").innerText = `Fetching Live Data for ${place.name}...`; 
        openModal();
    }

    const api_key_private = "pri_7dc8d4ae59904a658f8ecb9488cded6b";
    const safe_name = encodeURIComponent(place.name);
    const safe_address = encodeURIComponent(place.venue_address);
    
    // For the API request
    const url = `https://besttime.app/api/v1/forecasts?venue_name=${safe_name}&venue_address=${safe_address}&api_key_private=${api_key_private}`;

    const requestOptions = {
        method: "POST",
        redirect: "follow"
    };

    fetch(url, requestOptions)
        .then(response => response.json())
        .then((result) => { // FIX 5: Added missing parentheses around (result)
            console.log("API Success:", result);

            // FIX 6: Added parentheses around the IF condition
            if (result.status === "OK") {
                document.getElementById("modal-body").innerText = "Test Success! Data Received.";
            } else {
                document.getElementById("modal-body").innerText = "API Error: " + result.message;
            }
        })
        .catch((error) => {
            console.error("API ERROR:", error);
            document.getElementById("modal-body").innerText = "Failed to fetch data.";
        }); // FIX 7: Removed the random '})' and '{' that were crashing the script
}