document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. Map Initialization ---
    const map = L.map('map').setView([16.41106, 120.59332], 14);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    // --- 2. The "Fake Database" (Replace this with Real DB later) ---
    const locations = [
        {
            id: 1,
            name: "Burnham Park",
            lat: 16.4125,
            lng: 120.5927,
            desc: "The heart of the city.",
            crowdLevel: "High" // Placeholder for API data
        },
        {
            id: 2,
            name: "Mines View Park",
            lat: 16.4234,
            lng: 120.6306,
            desc: "Scenic view of mining towns.",
            crowdLevel: "Medium"
        },
        {
            id: 3,
            name: "Wright Park",
            lat: 16.4168,
            lng: 120.6190,
            desc: "Famous for horseback riding.",
            crowdLevel: "Low"
        },
        {
            id: 4,
            name: "Camp John Hay",
            lat: 16.3920,
            lng: 120.6170,
            desc: "Pine tree wonderland.",
            crowdLevel: "Low"
        },
        {
            id: 5,
            name: "Botanical Garden",
            lat: 16.4143,
            lng: 120.6120,
            desc: "Peaceful gardens and tunnels.",
            crowdLevel: "Medium"
        }
    ];

    // --- 3. Add Pins to Map & Link to Sidebar ---
    const markers = {}; // Store markers to access them later

    locations.forEach(loc => {
        // Create the marker
        const marker = L.marker([loc.lat, loc.lng]).addTo(map);
        
        // Add a Popup (This is where your recommendation will eventually go)
        marker.bindPopup(`
            <b>${loc.name}</b><br>
            Status: ${loc.crowdLevel}<br>
            <button onclick="calculateScore(${loc.id})">Get Recommendation</button>
        `);

        // Save marker reference
        markers[loc.id] = marker;
    });

    // --- 4. Make Sidebar Click Zoom to Pin ---
    // We attach this logic to the existing HTML cards
    // Note: You need to add data-id="1" etc to your HTML cards for this to match!
    
    const cards = document.querySelectorAll('.card');
    cards.forEach((card, index) => {
        card.addEventListener('click', () => {
            // Assuming the order matches the array for now
            // In a real DB, you'd use IDs
            const loc = locations[index]; 
            if (loc) {
                map.flyTo([loc.lat, loc.lng], 17); // Smooth zoom
                markers[loc.id].openPopup();
                
                // On mobile, close the sidebar so they can see the map
                if(window.innerWidth < 500) {
                    document.getElementById('sidebar').classList.remove('active');
                }
            }
        });
    });


    // --- Sidebar Toggle Logic (Keep this) ---
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

// Placeholder for your future algorithm
function calculateScore(id) {
    alert("Fetching data from BestTime, Weather, and Traffic APIs for ID: " + id);
    // This is where we will eventually inject the Math!
}