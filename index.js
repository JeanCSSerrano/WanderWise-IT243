
document.addEventListener('DOMContentLoaded', () => {
    // Ensure the map container exists
    const mapEl = document.getElementById('map');
    if (!mapEl) return;

    // Initialize map centered on provided coordinates
    const map = L.map('map').setView([16.41106, 120.59332], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);
});

