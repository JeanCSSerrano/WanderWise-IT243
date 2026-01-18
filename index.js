// TEMPORARY LANG ITONG MGA VARIABLES, LALAGAY DIN NATIN SA DATABASE
/*const locations = [
    { 
        id: 1, 
        name: "Burnham Park", 
        lat: 16.4123795, 
        lng: 120.5929704, 
        venue_address: "Jose Abad Santos Dr Baguio 2600 Benguet Philippines", 
        desc: "Burnham Park, officially known as the Burnham Park Reservation, is a historic urban park located in downtown Baguio, Philippines. The park's design is influenced from the City Beautiful movement; It has a small pond or lagoon situated at the green space's center and has regimented rows of grass and sidewalk.", 
        crowdLevel: "High", 
        image: "images/burnham_park.jpg"
    },
    { 
        id: 2, 
        name: "Mines View Observation Deck", 
        lat: 16.4195651, 
        lng: 120.6278588, 
        venue_address: "Mines View Baguio Benguet Philippines", 
        desc: "Mines View Park is an overlook park on the northeastern outskirts of Baguio in the Philippines. Located on a land promontory 4 kilometres (2.5 mi) from downtown Baguio, the park overlooks the mining town of Itogon, particularly the abandoned gold and copper mines of the Benguet Corporation, and offers a glimpse of the Amburayan Valley.", 
        crowdLevel: "Medium",
        image: "images/mines_view.jpg"
    },
    { 
        id: 3, 
        name: "Wright Park", 
        lat: 16.4156997, 
        lng: 120.6172233, 
        venue_address: "The Mansion Romulo Dr Baguio Benguet, Philippines", 
        desc: "Wright Park is a wooded area in Baguio which became known for its horseback riding services for tourists.", 
        crowdLevel: "Low",
        image: "images/wright_park.jpg"
    },
    { 
        id: 4, 
        name: "Camp John Hay Picnic Area", 
        lat: 16.3996743, 
        lng: 120.6163387, 
        venue_address: "9JX8+VG8 Camp John Hay, Baguio Benguet Philippines", 
        desc: "Camp John Hay is a mixed-used development which serves as a tourist destination and forest watershed reservation in Baguio, Philippines. Camp John Hay features historic sites like the Bell House and Bell Amphitheater, along with gardens such as the History Trail, Secret Garden, and a symbolic “Cemetery of Negativism.” The area also includes a golf course, now managed by the Bases Conversion and Development Authority.", 
        crowdLevel: "Low",
        image: "images/art_park.jpg"
    },
    { 
        id: 5, 
        name: "Botanical Garden", 
        lat: 16.4150118, 
        lng: 120.6129064, 
        venue_address: "37 Leonard Wood Rd Baguio 2600 Benguet Philippines", 
        desc: "The Baguio Botanical Garden, formerly known as Imelda Park, is a botanical garden in Baguio, Philippines, located on Leonard Wood Road between Wright Park and Teacher's Camp. The park has art galleries provided by the Baguio Arts Guild, and sculptures displaying the culture of the Igorot people. A statue by Ben Hur Villanueva commemorating the people who built Baguio can also be found. One of the garden's main attractions is a 150 m (490 ft) long tunnel which was dug out by Japanese Imperial Army soldiers during World War II for use as storage, treatment, and a bunker.", 
        crowdLevel: "Medium",
        image: "images/botanical_garden.png"
    }
];
*/


const ALGO_CONFIG = {
   
    CROWD_EXPONENT: 2.5,       // Gentler curve
    MAX_CROWD_PENALTY: 100,  
    
    
    W_SUNNY: 1.0,            
    W_CLOUDY: 1.0,           
    W_FOG: 0.85,             
    W_RAIN: 0.65,            
    W_STORM: 0.30,            
    CLOSING_SOON_PENALTY: 30, 
    CLOSED_SCORE: 0,

    
    CURRENT_WEIGHT: 0.7, 
    FUTURE_WEIGHT: 0.3   
}



let locations = [];

let modal;
let openModal;
let myChart;
let hourlyWeather = []; 


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


    //FETCHING LOCATIONS FROM DATABASE
    fetch('database.php')
        .then (response => response.json())
        .then (data => {
            locations = data;

            const markers = {}; 
            

            // MARKERS AND SIDEBAR DESIGN
            locations.forEach(loc => {
                const marker = L.marker([loc.lat, loc.lng]).addTo(map);

                // FOR THE DESCRIPTIONS OF THE MARKERS
                const popupContent = `
                <div class="custom-popup">
                    <img src="${loc.image}" alt="${loc.name}" style="width:100%; border-radius:5px; margin-bottom:10px;">
                    <h3 style="margin:0 0 5px 0;">${loc.name}</h3>
                    <p style="font-size:13px; color:#555; line-height:1.4;">${loc.desc}</p>
                    <hr style="border:0; border-top:1px solid #eee; margin:10px 0;">
                    <div style="display:flex; justify-content:center; align-items:center;">
                        <button onclick="calculateScore(${loc.id})" class="popup-btn">Analyze Live</button>
                    </div>
                </div>
            `;

        marker.bindPopup(popupContent, {
            maxWidth: 400,
            maxHeight: 500
        });

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

}) 
    .catch(error => console.error("Database Error:", error)); 


    // MODAL SETUP 
    modal = document.getElementById("recommendation-modal");

    
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





// ------------------------------- ALGORITHM & FUNCTIONS NGANI -------------------------------------




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
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${place.lat}&longitude=${place.lng}&hourly=temperature_2m,relative_humidity_2m,weather_code&timezone=Asia%2FManila&current_weather=true`;
    let code;

    // FETCHING WEATHER DATA
    fetch(weatherUrl)
        .then(response => response.json())
        .then((weatherResult) => {
            code = weatherResult.current_weather.weathercode;
            hourlyWeather = weatherResult.hourly.weather_code; 
            const temp = weatherResult.current_weather.temperature;  
            const status = weatherStatus(code); 
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
            console.log("API Success:", liveData);
    
            if (liveData.status === "OK") {
                document.getElementById("modal-text").innerText = `Data Received Successfully! Here is the forecast for today:`
                
                let jsDay = new Date().getDay(); 
                let apiIndex = (jsDay + 6) % 7; 
                
                const todayData = liveData.analysis[apiIndex];
                const crowdNumbers = todayData.day_raw;
                const hourMap = todayData.hour_analysis; 
                const currentHour = new Date().getHours();
                
                const openTime = place.open_time;
                const closeTime = place.close_time;
                
            
                
                // FUTURE CROWDS:
                let futureCrowds = [];

                // hour 1
                const h1Index = hourMap.findIndex(data => data.hour === (currentHour + 1) % 24);
                if (h1Index !== -1) futureCrowds.push(crowdNumbers[h1Index]);

                // hour 2
                const h2Index = hourMap.findIndex(data => data.hour === (currentHour + 2) % 24);
                if (h2Index !== -1) futureCrowds.push(crowdNumbers[h2Index]);

                
                let futureCrowdVal = 0;
                if (futureCrowds.length > 0) {
                    futureCrowdVal = Math.max(...futureCrowds);
                }

                // Find index for Current Hour
                const foundIndex = hourMap.findIndex(data => data.hour === currentHour);
                let currentCrowdVal = 0;
                if (foundIndex !== -1) {
                    currentCrowdVal = crowdNumbers[foundIndex];
                }


                // 2. FUTURE WEATHER: Check Hour+1 and Hour+2, pick the WORST
                const w1 = hourlyWeather[currentHour + 1] || code;
                const w2 = hourlyWeather[currentHour + 2] || code;

                // Default to first hour
                let futureWeatherCode = w1; 

                // Logic: If either hour has rain (>50) or storm (>90), use that code
                if (w2 > 50) futureWeatherCode = w2; // If Hour 2 is rainy, warn about that
                if (w1 > 50) futureWeatherCode = w1; // If Hour 1 is rainy, warn about that (priority)
                if (w2 > 90) futureWeatherCode = w2; // If Hour 2 is a STORM, definitely warn that
                if (w1 > 90) futureWeatherCode = w1; // If Hour 1 is a STORM, definitely warn that


                generateRecommendation(code, currentCrowdVal, openTime, closeTime, futureWeatherCode, futureCrowdVal);
                
                drawGraph(crowdNumbers);
                
            } else {
                document.getElementById("modal-text").innerText = "API Error: " + liveData.message;
            }
        })
        .catch((error) => {
            console.error("API ERROR:", error);
            document.getElementById("modal-text").innerText = "Failed to fetch data. Please try again.";
        });
}






function weatherStatus(code) {
    if (code === 0) {
        return "☀️ Sunny";
    } else if (code >= 1 && code <= 3) {
        return "☁️ Cloudy";
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
        return { val: 1.0, desc: "Perfect sunny weather", type: "pro" };
    } 
    else if (code >= 1 && code <= 3) {
        return { val: 1.0, desc: "Cloudy", type: "pro" };
    }
    else if (code >= 45 && code <= 48) {
        return { val: 0.8, desc: "Foggy conditions", type: "neutral" };
    }
    else if ((code >= 51 && code <= 55) || (code >= 80 && code <= 82)) {
        return { val: 0.7, desc: "Light rain/showers", type: "con" };
    }
    else if (code >= 61 && code <= 65) {
        return { val: 0.4, desc: "Raining currently", type: "con" };
    }
    else if (code >= 95) {
        return { val: 0.2, desc: "Thunderstorms active", type: "con" };
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

    let testCrowd = (crowdPercent * ALGO_CONFIG.CURRENT_WEIGHT) + (futureCrowdPercent * ALGO_CONFIG.FUTURE_WEIGHT);
    console.log(`Current: ${crowdPercent}, Future: ${futureCrowdPercent}, BLENDED SCORE: ${testCrowd}`);
    
    
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

    // THE BLENDED CROWD MATH ---
    let blendedCrowd = (crowdPercent * ALGO_CONFIG.CURRENT_WEIGHT) + (futureCrowdPercent * ALGO_CONFIG.FUTURE_WEIGHT);
    let crowdRatio = blendedCrowd / 100;
    let crowdPenalty = Math.pow(crowdRatio, ALGO_CONFIG.CROWD_EXPONENT) * ALGO_CONFIG.MAX_CROWD_PENALTY;

    let baseScore = 100 - crowdPenalty;

    // THE BLENDED WEATHER MATH ---
    const wNow = getWeatherScore(weatherCode);
    const wFuture = getWeatherScore(futureWeatherCode);
    let effectiveWeatherVal = Math.min(wNow.val, wFuture.val);

    //  FIXED PENALTIES ---
    if (closeTime - currentHour === 1) {
        baseScore = baseScore - ALGO_CONFIG.CLOSING_SOON_PENALTY;
        cons.push(`Closing soon (${closeTime}:00)`);
    }

    // FINAL SCORE ---
    let finalScore = baseScore * effectiveWeatherVal;
    if (finalScore < 0) finalScore = 0;

    // FILL BUCKETS ---
    const cResult = getCrowdScore(blendedCrowd); 

   
    if (cResult.type === "pro") {
        pros.push(cResult.desc);
    } else {
        cons.push(cResult.desc); 
    }

    
    if (wNow.type === "pro") pros.push(wNow.desc);
    if (wNow.type === "con") cons.push(wNow.desc);

    
    if (wFuture.val < wNow.val) {
        
        cons.push(`Weather worsening soon (${wFuture.desc})`);
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
    list.innerHTML = "<p>Loading comments...</p>";

    fetch(`get_comments.php?location_id=${id}`)
        .then(response => response.json())
        .then(data => {
            list.innerHTML = ""; 
            
            if (data.length === 0) {
                list.innerHTML = "<p style='color:#888; font-size:13px;'>Enter Comment</p>";
                return;
            }

            
            data.forEach(c => {
                const item = `
                    <div class="comment-item">
                        <div class="comment-header">
                            <span class="comment-user">${c.username}</span>
                            <span class="comment-date">${c.created_at}</span>
                        </div>
                        <p class="comment-body">${c.comment_text}</p>
                    </div>
                `;
                list.innerHTML += item;
            });
        })
        .catch(err => console.error("Comment Error:", err));
}

function postComment() {
    const input = document.getElementById("comment-input");
    const text = input.value;

    if (!text.trim()) {
        alert("Please write something first!");
        return;
    }

    const formData = new FormData();
    formData.append("location_id", currentLocationId);
    formData.append("comment_text", text);

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
            alert(data.message);
        }
    })
    .catch(err => console.error("Post Error:", err));
}