const ALGO_CONFIG = {
    CROWD_EXPONENT: 2.5,       
    MAX_CROWD_PENALTY: 100,  
    W_SUNNY: 1.0,            
    W_CLOUDY: 0.90,           
    W_FOG: 0.75,
    W_DRIZZLE: 0.60,
    W_FREEZING_DRIZZLE: 0.60,
    W_RAIN: 0.40,   
    W_HEAVY_RAIN: 0.30,        
    W_STORM: 0.20,            
    CLOSING_SOON_PENALTY: 30, 
    CLOSED_SCORE: 0,
    CURRENT_WEIGHT: 0.7, 
    FUTURE_WEIGHT: 0.3   
}

// Global Variables
let locations = [];
let modal;
let openModal;
let myChart;
let hourlyWeather = []; 


// DARK MODE FUNCTION
function toggleTheme() {
    const body = document.body;
    const icon = document.getElementById('themeIcon');
    
    body.classList.toggle('dark-mode');
    
    if (body.classList.contains('dark-mode')) {
        if(icon) icon.innerText = '☀️';
        localStorage.setItem('theme', 'dark'); 
    } else {
        if(icon) icon.innerText = '🌙';
        localStorage.setItem('theme', 'light'); 
    }
}


document.addEventListener('DOMContentLoaded', () => {
    
    const savedTheme = localStorage.getItem('theme');
    const icon = document.getElementById('themeIcon');
    
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        if(icon) icon.innerText = '☀️';
    }

    // MAP SETUP 
    if (document.getElementById('map')) {
        
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


        // FETCH LOCATIONS
        fetch('database.php')
            .then(response => response.json())
            .then(data => {
                locations = data;
                const markers = {}; 
                const cardsContainer = document.getElementById('cards-container'); 

                if(cardsContainer) cardsContainer.innerHTML = '';

                locations.forEach((loc) => {
                    const marker = L.marker([loc.lat, loc.lng]).addTo(map);

                    const popupContent = `
                    <div class="custom-popup">
                        <img src="${loc.image}" alt="${loc.name}" style="width:100%; border-radius:5px; margin-bottom:10px;">
                        <h3 style="margin:0 0 5px 0;">${loc.name}</h3>
                        <p style="font-size:13px; color:#555; line-height:1.4;">${loc.desc}</p>
                        <hr style="border:0; border-top:1px solid #eee; margin:10px 0;">
                        <div style="display:flex; justify-content:center; align-items:center;">
                            <button onclick="calculateScore(${loc.id})" class="popup-btn" style="width:100%; padding:8px; background:#3498db; color:white; border:none; border-radius:4px; cursor:pointer;">Analyze Live</button>
                        </div>
                    </div>
                    `;

                    marker.bindPopup(popupContent, {
                        maxWidth: 400,
                        maxHeight: 500
                    });

                    markers[loc.id] = marker;

                    // SIDEBAR CARD
                    if (cardsContainer) {
                        const card = document.createElement('div');
                        card.className = 'card';
                        card.innerHTML = `
                            <h3>${loc.name}</h3>
                            <p>${loc.venue_address}</p>
                        `;

                        card.addEventListener('click', () => {
                            map.flyTo([loc.lat, loc.lng], 17);
                            markers[loc.id].openPopup();
                            
                            if(window.innerWidth < 500) {
                                document.getElementById('sidebar').classList.remove('active');
                            }
                        });

                        cardsContainer.appendChild(card);
                    }
                });

            }) 
            .catch(error => console.error("Database Error:", error));
    }


    // MODAL SETUP 
    modal = document.getElementById("recommendation-modal");
    const close = document.querySelector(".modalclose-btn");

    openModal = function() {
        if(modal) modal.style.display = "block";
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
    
    // SIDEBAR UI
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


// ------------------------------- ALGORITHM & FUNCTIONS -------------------------------------

function calculateScore(id) {
    const place = locations.find(loc => loc.id == id);
    console.log("Getting Data for: " + id);
    loadComments(id);

    if (typeof openModal === "function") {
        document.getElementById("modal-title").innerText = `Analysis for ${place.name}`;
        document.getElementById("modal-text").innerText = `Fetching Live Data for ${place.name}...`;
        openModal();
    }

    const api_key_private = "pri_7dc8d4ae59904a658f8ecb9488cded6b";
    
    const safe_name = encodeURIComponent(place.name);
    const safe_address = encodeURIComponent(place.venue_address);
    
    const crowdUrl = `https://besttime.app/api/v1/forecasts?venue_name=${safe_name}&venue_address=${safe_address}&api_key_private=${api_key_private}`;
    
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${place.lat}&longitude=${place.lng}&hourly=temperature_2m,relative_humidity_2m,weather_code&timezone=auto&current_weather=true`;
    
    let code;

    // FETCHING WEATHER DATA
    fetch(weatherUrl)
        .then(response => response.json())
        .then((weatherResult) => {
            
            code = weatherResult.current_weather.weathercode;
            hourlyWeather = weatherResult.hourly.weather_code; 
            
            const currentHour = new Date().getHours();
            
            // --- FIX: USE HOURLY TEMP TO MATCH CARDS ---
            // Old line: const temp = weatherResult.current_weather.temperature;
            const temp = weatherResult.hourly.temperature_2m[currentHour];
            // -------------------------------------------

            const status = weatherStatus(code, currentHour); 
            
            document.getElementById("weather-output").innerHTML = `<b>Current Weather:</b> ${status}, ${temp}°C`;
            updateForecast(weatherResult.hourly);
            
        })
        .catch(err => console.error("Weather API Error:", err)); 

    const requestOptions = {
        method: "POST",
        redirect: "follow"
    };

    // FETCHING CROWD DATA
    fetch(crowdUrl, requestOptions)
        .then(response => response.json())
        .then((liveData) => {
            console.log("Crowd API Success:", liveData);
    
            if (liveData.status === "OK") {
                document.getElementById("modal-text").innerText = `Here is the forecast for today:`
                
                let jsDay = new Date().getDay(); 
                let apiIndex = (jsDay + 6) % 7; 
                
                const todayData = liveData.analysis[apiIndex];
                const crowdNumbers = todayData.day_raw;
                const hourMap = todayData.hour_analysis; 
                const currentHour = new Date().getHours();
                
                const openTime = place.open_time;
                const closeTime = place.close_time;
                
                // FUTURE CROWD DATA
                let futureCrowds = [];

                // HOUR 1
                const h1Index = hourMap.findIndex(data => data.hour === (currentHour + 1) % 24);
                if (h1Index !== -1) futureCrowds.push(crowdNumbers[h1Index]);

                // HOUR 2
                const h2Index = hourMap.findIndex(data => data.hour === (currentHour + 2) % 24);
                if (h2Index !== -1) futureCrowds.push(crowdNumbers[h2Index]);

                let futureCrowdVal = 0;
                if (futureCrowds.length > 0) {
                    futureCrowdVal = Math.max(...futureCrowds);
                }

                const foundIndex = hourMap.findIndex(data => data.hour === currentHour);
                let currentCrowdVal = 0;
                if (foundIndex !== -1) {
                    currentCrowdVal = crowdNumbers[foundIndex];
                }

                const w1 = hourlyWeather[currentHour + 1] || code;
                const w2 = hourlyWeather[currentHour + 2] || code;

                let futureWeatherCode = w1; 

                if (w2 > 50) futureWeatherCode = w2; 
                if (w1 > 50) futureWeatherCode = w1; 
                if (w2 > 90) futureWeatherCode = w2; 
                if (w1 > 90) futureWeatherCode = w1; 

                generateRecommendation(code, currentCrowdVal, openTime, closeTime, futureWeatherCode, futureCrowdVal);
                
                drawGraph(crowdNumbers);
                
            } else {
                document.getElementById("modal-text").innerText = "Crowd Data Error: " + liveData.message;
            }
        })
        .catch((error) => {
            console.error("API ERROR:", error);
            document.getElementById("modal-text").innerText = "Failed to fetch crowd data.";
        });
}


function weatherStatus(code) {
    if (code === 0) {
        return "☀️ Sunny";
    } else if (code === 1) {
        return "🌤️ Mainly Sunny"; 
    } else if (code === 2) {
        return "⛅ Partly Cloudy"; 
    } else if (code === 3) {
        return "☁️ Overcast";      
    } else if (code >= 45 && code <= 48) {
        return "🌫️ Foggy";
    } else if (code >= 51 && code <= 55) {
        return "🌦️ Drizzle";
    } else if (code >= 61 && code <= 65) {
        return "🌧️ Rainy";
    } else if (code >= 80 && code <= 82) {
        return "🌧️ Showers";
    } else if (code >= 95) {
        return "⛈️ Thunderstorm";
    } else {
        return "🌡️ Weather Normal"; 
    }
}


function updateForecast(hourlyData) {
    
    const currentHour = new Date().getHours(); 

    for (let i = 0; i < 10; i++) {
        
        let futureIndex = currentHour + i;

        if (!hourlyData.temperature_2m[futureIndex]) break;

        let temp = hourlyData.temperature_2m[futureIndex];
        let code = hourlyData.weather_code[futureIndex];

        let rawHour = futureIndex % 24;
        let timeLabel = "";

        if (rawHour === 0) {
            timeLabel = "12 AM";
        } else if (rawHour === 12) {
            timeLabel = "12 PM";
        } else if (rawHour > 12) {
            timeLabel = (rawHour - 12) + " PM";
        } else {
            timeLabel = rawHour + " AM";
        }

        let status = weatherStatus(code);
        let emoji = status.substring(0, 2);

        const timeEl = document.getElementById("time-" + i);
        const iconEl = document.getElementById("icon-" + i);
        const tempEl = document.getElementById("temp-" + i);

        if (timeEl) timeEl.innerText = timeLabel;
        if (iconEl) iconEl.innerText = emoji;
        if (tempEl) tempEl.innerText = temp + "°C";
    }
}


function drawGraph(crowdData) {
    const ctx = document.getElementById('foot-chart');

    if (myChart) {
        myChart.destroy();
    }

    const hours = [
        "6AM", "7AM", "8AM", "9AM", "10AM", "11AM", "12PM", 
        "1PM", "2PM", "3PM", "4PM", "5PM", "6PM", 
        "7PM", "8PM", "9PM", "10PM", "11PM", "12AM", 
        "1AM", "2AM", "3AM", "4AM", "5AM"
    ];

    const backgroundColors = crowdData.map((value) => {
        if (value >= 75) {
            return 'rgba(231, 76, 60, 0.7)';
        } else if (value >= 40) {
            return 'rgba(241, 196, 15, 0.7)';
        } else {
            return 'rgba(46, 204, 113, 0.7)';
        }
    });

    myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: hours,
            datasets: [{
                label: 'Intensity of Crowd (%)',
                data: crowdData,
                borderWidth: 1,
                backgroundColor: backgroundColors
            }]
        },
        options: {responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true
                }                                               
            }
        }
    }); 
}


function getWeatherScore(code) {
    if (code === 0) {
        return { val: ALGO_CONFIG.W_SUNNY, desc: "Clear Sky", type: "pro" };
    } 
    else if (code >= 1 && code <= 3) {
        return { val: ALGO_CONFIG.W_CLOUDY, desc: "Cloudy", type: "pro" };
    }
    else if (code >= 45 && code <= 48) {
        return { val: ALGO_CONFIG.W_FOG, desc: "Foggy", type: "neutral" };
    }
    else if ((code >= 51 && code <= 55)) {
        return { val: ALGO_CONFIG.W_DRIZZLE, desc: "Drizzle", type: "con" };
    }
    else if ((code >= 56 && code <= 57)) {
        return { val: ALGO_CONFIG.W_FREEZING_DRIZZLE, desc: "Freezing Drizzle", type: "con"};
    }
    else if (code >= 61 && code <= 65) {
        return { val: ALGO_CONFIG.W_RAIN, desc: "Raining currently", type: "con" };
    }
    else if ((code >= 71 && code <= 77)) {
        return { val: ALGO_CONFIG.W_RAIN, desc: "Cold/Snowy conditions", type: "con" };
    }
    else if ((code >= 80 && code <= 82)) {
        return { val: ALGO_CONFIG.W_HEAVY_RAIN, desc: "Heavy Rain", type: "con"};
    }
    else if (code >= 95) {
        return { val: ALGO_CONFIG.W_STORM, desc: "Thunderstorms active", type: "con" };
    }
    return { val: 1.0, desc: "Weather data unavailable", type: "neutral" };
}

function getCrowdScore(percentage) {
    if (percentage === undefined || percentage === null) {
        return { val: 1.0, desc: "Crowd data unavailable", type: "neutral" };
    }
    if (percentage <= 30) {
        return { val: 1.0, desc: "Low crowd levels", type: "pro" };
    } 
    else if (percentage <= 60) {
        return { val: 0.8, desc: "Moderate foot traffic", type: "con" }; 
    } 
    else if (percentage <= 85) {
        return { val: 0.5, desc: "High foot traffic", type: "con" };
    } 
    else {
        return { val: 0.2, desc: "Extremely busy", type: "con" };
    }
}


function generateRecommendation(weatherCode, crowdPercent, openTime, closeTime, futureWeatherCode, futureCrowdPercent) {
    const currentHour = new Date().getHours();

    
   if (openTime !== 0 || closeTime !== 24) {
        if (currentHour < openTime || currentHour >= closeTime) {
            const scoreH1 = document.querySelector(".score-placeholder h1");
            if (scoreH1) scoreH1.innerText = "0 / 100";
            const scoreP = document.querySelector(".score-placeholder p");
            if (scoreP) {
                scoreP.innerHTML = `<b style="color:#ff4757">CLOSED</b><br>
                                   Operational Hours: ${openTime}:00 - ${closeTime}:00`;
            }
            return; 
        }
    }

    // ALGORITHM
    let pros = [];
    let cons = [];

    
    let blendedCrowd = (crowdPercent * ALGO_CONFIG.CURRENT_WEIGHT) + (futureCrowdPercent * ALGO_CONFIG.FUTURE_WEIGHT);
    let crowdRatio = blendedCrowd / 100;
    let crowdPenalty = Math.pow(crowdRatio, ALGO_CONFIG.CROWD_EXPONENT) * ALGO_CONFIG.MAX_CROWD_PENALTY;
    let baseScore = 100 - crowdPenalty;

    
    const wNow = getWeatherScore(weatherCode);
    const wFuture = getWeatherScore(futureWeatherCode);
    let effectiveWeatherVal = Math.min(wNow.val, wFuture.val);

    
    if (closeTime - currentHour === 1) {
        baseScore = baseScore - ALGO_CONFIG.CLOSING_SOON_PENALTY;
        cons.push(`Closing soon (${closeTime}:00)`);
    }

    
    let finalScore = baseScore * effectiveWeatherVal;
    if (finalScore < 0) finalScore = 0;

    // FILL BUCKETS
    const cResult = getCrowdScore(blendedCrowd); 

   
    if (cResult.type === "pro") {
        pros.push(cResult.desc);
    } else {
        cons.push(cResult.desc); 
    }

    
    if (wNow.type === "pro") pros.push(wNow.desc);
    if (wNow.type === "con") cons.push(wNow.desc);

    
    if (wFuture.val < wNow.val) {
        if (wFuture.val < wNow.val && wFuture.val < 0.9) {
            cons.push(`Weather worsening soon (${wFuture.desc})`);
        }
    } else if (wNow.val === 1.0 && wFuture.val === 1.0) {
        pros.push("Consistent dry weather ahead");
    }

    // UPDATE UI
    const scoreBox = document.querySelector(".score-placeholder h1");
    if (scoreBox) scoreBox.innerText = `${Math.round(finalScore)} / 100`;

    const descBox = document.querySelector(".score-placeholder p");
    if (descBox) {
        descBox.innerHTML = `<b>Pros:</b> ${pros.join(", ") || "None"} <br> <b>Cons:</b> ${cons.join(", ") || "None"}`;
    }
}


//COMMENTS

let currentLocationId = null; 

function loadComments(id) {
    currentLocationId = id; 
    const list = document.getElementById("comments-list");
    list.innerHTML = "<p style='text-align:center; padding:10px; color:#888;'>Loading discussion...</p>";

    fetch(`get_comments.php?location_id=${id}`)
        .then(response => response.json())
        .then(data => {
            list.innerHTML = ""; 
            
            if (data.length === 0) {
                list.innerHTML = "<p style='text-align:center; color:#888; font-style:italic; margin-top:20px;'>No comments yet. Start the conversation!</p>";
                return;
            }

        
            const parents = data.filter(c => c.parent_id === null || c.parent_id === "null" || !c.parent_id);
            const replies = data.filter(c => c.parent_id && c.parent_id !== "null");

        
            parents.forEach(p => {
                const item = `
                    <div class="comment-item" id="comment-${p.id}">
                        <div class="comment-header">
                            <span class="comment-user">${p.username}</span>
                            <span class="comment-date">${formatDate(p.created_at)}</span>
                        </div>
                        <p class="comment-body">${p.comment_text}</p>
                        
                        <div class="comment-actions">
                            <button onclick="showReplyBox(${p.id})" class="reply-btn">Reply</button>
                        </div>
                        
                        <div id="reply-box-${p.id}" class="reply-input-area" style="display:none;">
                            <input type="text" id="reply-input-${p.id}" placeholder="Write a reply..." class="reply-field">
                            <button onclick="postReply(${p.id})" class="send-reply-btn">Send</button>
                        </div>

                        <div class="replies-container" id="replies-${p.id}"></div>
                    </div>
                `;
                list.innerHTML += item;
            });

           
            replies.forEach(r => {
                
                const parentDiv = document.getElementById(`replies-${r.parent_id}`);
                
                if (parentDiv) {
                    const replyItem = `
                        <div class="comment-reply-item">
                             <div class="comment-header">
                                <span class="comment-user sub-user">${r.username}</span>
                                <span class="comment-date">${formatDate(r.created_at)}</span>
                            </div>
                            <p class="comment-body">${r.comment_text}</p>
                            
                            <button onclick="replyToUser(${r.parent_id}, '${r.username}')" class="reply-btn small-btn">Reply</button>
                        </div>
                    `;
                    parentDiv.innerHTML += replyItem;
                }
            });
        })
        .catch(err => console.error("Error loading comments:", err));
}



// SHOW INPUT BOX
function showReplyBox(threadId) {
    const box = document.getElementById(`reply-box-${threadId}`);
    const input = document.getElementById(`reply-input-${threadId}`);
   
    if (box.style.display === "none") {
        box.style.display = "flex"; 
        input.focus();
    } else {
        box.style.display = "none";
    }
}

// REPLY TO USER GAMIT TAGGING
function replyToUser(threadId, username) {
    
    const box = document.getElementById(`reply-box-${threadId}`);
    const input = document.getElementById(`reply-input-${threadId}`);
    
    box.style.display = "flex";
    
    
    input.value = `@${username} `;
    input.focus();
}

// SEND NG DATA TO PHP
function postReply(parentId) {
    const input = document.getElementById(`reply-input-${parentId}`);
    const text = input.value;

    if (!text.trim()) {
        alert("Please write a message first.");
        return;
    }

    const formData = new FormData();
    formData.append("location_id", currentLocationId);
    formData.append("comment_text", text);
    formData.append("parent_id", parentId); 

    fetch("submit_comment.php", {
        method: "POST",
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === "success") {
            input.value = ""; 
            document.getElementById(`reply-box-${parentId}`).style.display = "none"; 
            loadComments(currentLocationId);
        } else {
            alert(data.message);
        }
    })
    .catch(err => console.error("Post Error:", err));
}

// --- ADDED MISSING FUNCTION HERE ---
function postComment() {
    const input = document.getElementById('comment-input');
    const text = input.value;

    if (!text.trim()) {
        alert("Please write a message first.");
        return;
    }

    const formData = new FormData();
    formData.append("location_id", currentLocationId);
    formData.append("comment_text", text);
    // Explicitly sending empty string for parent_id so PHP handles it as NULL
    formData.append("parent_id", ""); 

    fetch("submit_comment.php", {
        method: "POST",
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === "success") {
            input.value = ""; 
            loadComments(currentLocationId); 
        } else {
            alert(data.message || "Error posting comment");
        }
    })
    .catch(err => console.error("Post Error:", err));
}
// -----------------------------------


function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
}




// GLOBAL CHAT LOGIC


let chatInterval = null;
const currentUserId = "<?php echo $_SESSION['user_id'] ?? 0; ?>"; 

function toggleChat() {
    const chatWindow = document.getElementById('chat-window');
    
    if (chatWindow.style.display === "none") {
        chatWindow.style.display = "flex";
        loadGlobalMessages();
        
        chatInterval = setInterval(loadGlobalMessages, 2000);
    } else {
        chatWindow.style.display = "none";
        
        if (chatInterval) clearInterval(chatInterval);
    }
}

function loadGlobalMessages() {
    fetch('global_chat_api.php?action=fetch')
        .then(res => res.json())
        .then(data => {
            const container = document.getElementById('chat-messages');
            
            const isScrolledToBottom = container.scrollHeight - container.scrollTop === container.clientHeight;

            container.innerHTML = ""; 

            data.forEach(msg => {
                
                
                const bubble = `
                    <div class="chat-msg others">
                        <span class="msg-user">${msg.username}</span>
                        ${msg.message}
                    </div>
                `;
                container.innerHTML += bubble;
            });

            
            if (isScrolledToBottom) {
                container.scrollTop = container.scrollHeight;
            }
        })
        .catch(err => console.error(err));
}

function sendGlobalMessage() {
    const input = document.getElementById('global-chat-input');
    const msg = input.value.trim();
    if (!msg) return;

    const formData = new FormData();
    formData.append('action', 'send');
    formData.append('message', msg);

    fetch('global_chat_api.php', { method: 'POST', body: formData })
        .then(res => res.json())
        .then(data => {
            if (data.status === 'success') {
                input.value = "";
                loadGlobalMessages(); 
                
                const container = document.getElementById('chat-messages');
                container.scrollTop = container.scrollHeight;
            } else {
                alert("Login required or error: " + data.message);
            }
        });
}


document.getElementById('global-chat-input').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        sendGlobalMessage();
    }
});