<?php session_start(); ?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>WanderWise</title>
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" crossorigin=""/>
    <link rel="stylesheet" href="stylesheets.css?v=clean_css">
</head>
<body>

    <div class="header-bar">
        <div class="header-elements">
            <div class="left-menu">
                <div class="menu-btn" id="menuToggle">
                    <img src="https://img.icons8.com/ios-filled/50/ffffff/menu--v1.png" alt="Menu">
                </div>
                <div class="logo">
                    <img src="images/icons8-location-48.png" alt="WanderWise logo">
                </div>
                <div class="header-text">
                    <p id="Wise">Lakative</p>
                    <p id="Tagline">Explore Baguio Together!</p>
                </div>
            </div>
            <div class="right-menu">

                <?php if (isset($_SESSION['role']) && $_SESSION['role'] === 'admin'): ?>
                    <a href="admin_dashboard.php" class="admin-link">
                        <p>Admin Panel</p>
                    </a>
                <?php endif; ?>


                <div class="auth-toggle">
                    <?php if (isset($_SESSION['username'])): ?>
                        <a href="login.php" class="logout-btn">Logout</a>
                    <?php else: ?>
                        <a href="login.php" class="login-btn">Login</a>
                    <?php endif; ?>
                </div>
            </div>
            </div>
            </div>
        </div>
    </div>

<main>
        <div class="sidebar-container" id="sidebar">
            <div class="sidebar-top">
                <img src="" alt="icon">
                <h2>Places</h2>
                <span class="close-btn" id="closeSidebar">&times;</span>
            </div>
            <hr>
            
            <div class="scroll-area" id="cards-container">
            </div>
        </div>

        <div class="map-viewport">
            <div id="map"></div>
        </div>
    </main>


<div id="recommendation-modal" class="modal">
        <div class="modal-content">

            <div class="modal-header">
                <h2 id="modal-title">Analysis Result</h2>
                <span class="modalclose-btn">&times;</span>
            </div>

            <div class="modal-body">
                <div class="comments-section">
                    <h3>User Reviews</h3>
                    <div id="comments-list" class="comments-list">
                        <p>Loading comments...</p>
                    </div>
                    <div class="comment-form-wrapper">
                        <?php if (isset($_SESSION['user_id'])): ?>
                            <textarea id="comment-input" placeholder="Share your experience..."></textarea>
                            <button onclick="postComment()" class="auth-btn" style="width: auto; padding: 8px 15px;">Post</button>
                        <?php else: ?>
                            <p style="font-size: 13px; color: #666;">
                                <a href="login.php" style="color: #3498db;">Login</a> to leave a comment.
                            </p>
                        <?php endif; ?>
                    </div>
                </div>

                <div class="weather-section">
                    <div class="weather-header">
                        <p id="modal-text">Status: Fetching live data...</p>
                        <p id="weather-output">Loading Weather...</p>
                    </div>
                    <div class="forecast-container">
                        <div class="hour-card"><span id="time-0" class="hour-time">--</span><span id="icon-0" class="hour-icon">❓</span><span id="temp-0" class="hour-temp">--°</span></div>
                        <div class="hour-card"><span id="time-1" class="hour-time">--</span><span id="icon-1" class="hour-icon">❓</span><span id="temp-1" class="hour-temp">--°</span></div>
                        <div class="hour-card"><span id="time-2" class="hour-time">--</span><span id="icon-2" class="hour-icon">❓</span><span id="temp-2" class="hour-temp">--°</span></div>
                        <div class="hour-card"><span id="time-3" class="hour-time">--</span><span id="icon-3" class="hour-icon">❓</span><span id="temp-3" class="hour-temp">--°</span></div>
                        <div class="hour-card"><span id="time-4" class="hour-time">--</span><span id="icon-4" class="hour-icon">❓</span><span id="temp-4" class="hour-temp">--°</span></div>
                        <div class="hour-card"><span id="time-5" class="hour-time">--</span><span id="icon-5" class="hour-icon">❓</span><span id="temp-5" class="hour-temp">--°</span></div>
                        <div class="hour-card"><span id="time-6" class="hour-time">--</span><span id="icon-6" class="hour-icon">❓</span><span id="temp-6" class="hour-temp">--°</span></div>
                        <div class="hour-card"><span id="time-7" class="hour-time">--</span><span id="icon-7" class="hour-icon">❓</span><span id="temp-7" class="hour-temp">--°</span></div>
                        <div class="hour-card"><span id="time-8" class="hour-time">--</span><span id="icon-8" class="hour-icon">❓</span><span id="temp-8" class="hour-temp">--°</span></div>
                        <div class="hour-card"><span id="time-9" class="hour-time">--</span><span id="icon-9" class="hour-icon">❓</span><span id="temp-9" class="hour-temp">--°</span></div>
                    </div>
                </div>

                <div class="chart-section">
                    <h3>Crowd Activity Forecast</h3>
                    <div class="chart-wrapper">
                        <canvas id="foot-chart"></canvas>
                    </div>
                </div>

                <div class="algorithm-section">
                    <h3>Recommendation</h3>
                    <div class="score-placeholder">
                        <h1>-- / 100</h1>
                        <p>Score calculation coming soon...</p>
                    </div>
                </div>

            </div> </div>
    </div>

    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js" crossorigin=""></script>
    <script src="index.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>

</body>
</html>