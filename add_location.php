<?php
session_start();
include 'db_connect.php'; // Include DB to fetch list

// Security Check
if (!isset($_SESSION['role']) || $_SESSION['role'] !== 'admin') {
    header("Location: login.php");
    exit();
}

// FETCH ALL LOCATIONS
$sql = "SELECT * FROM locations ORDER BY id DESC"; // Newest first
$stmt = $conn->prepare($sql);
$stmt->execute();
$locations = $stmt->fetchAll(PDO::FETCH_ASSOC);
$total_locations = count($locations);
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Manage Locations - Admin</title>
    <link rel="stylesheet" href="stylesheets.css?v=<?php echo time(); ?>">
    <script>
        function confirmDelete(id) {
            if (confirm("Are you sure you want to delete this location? This will also delete all user comments associated with it.")) {
                window.location.href = "delete_location.php?id=" + id;
            }
        }
    </script>
</head>
<body class="admin-page-body">

    <div class="header-bar">
        <div class="header-elements">
            <div class="left-menu">
                <div class="logo"><img src="images/icons8-location-48.png" alt="Logo"></div>
                <div class="header-text">
                    <p id="Wise">Lakative</p>
                    <p id="Tagline">Admin Panel</p>
                </div>
            </div>
            <div class="right-menu">
                <a href="admin_dashboard.php" class="login-btn">Back to Dashboard</a>
            </div>
        </div>
    </div>

    <div class="admin-container">
        <div class="admin-form-wrapper">
            
            <?php if(isset($_SESSION['error'])): ?>
                <div class="alert alert-error"><?php echo $_SESSION['error']; unset($_SESSION['error']); ?></div>
            <?php endif; ?>
            
            <?php if(isset($_SESSION['success'])): ?>
                <div class="alert alert-success"><?php echo $_SESSION['success']; unset($_SESSION['success']); ?></div>
            <?php endif; ?>

            <div class="admin-header">
                <h2>Add New Location</h2>
            </div>

            <form action="process_add_location.php" method="POST">
                
                <div class="form-group form-full">
                    <label>Venue Name</label>
                    <input type="text" name="name" class="form-control" placeholder="e.g., Baguio Cathedral" required>
                </div>

                <div class="form-group form-full">
                    <label>Venue Address</label>
                    <input type="text" name="address" class="form-control" placeholder="e.g., Mount Mary, Cathedral Loop, Baguio" required>
                </div>

                <div class="form-grid">
                    <div class="form-group">
                        <label>Latitude</label>
                        <input type="text" name="manual_lat" class="form-control" placeholder="e.g. 16.4123" required>
                    </div>
                    <div class="form-group">
                        <label>Longitude</label>
                        <input type="text" name="manual_lng" class="form-control" placeholder="e.g. 120.5929" required>
                    
                    </div>
                </div>

                <div class="form-group form-full">
                    <label>Description</label>
                    <textarea name="description" class="form-control"></textarea>
                </div>

                <div class="form-group form-full">
                    <label>Image URL</label>
                    <input type="text" name="image_url" class="form-control" placeholder="images/example.jpg">
                </div>

                <div class="form-grid">
                    <div class="form-group">
                        <label>Opening Time (24h)</label>
                        <input type="number" name="open_time" class="form-control" min="0" max="23" placeholder="8">
                    </div>
                    <div class="form-group">
                        <label>Closing Time (24h)</label>
                        <input type="number" name="close_time" class="form-control" min="0" max="24" placeholder="20">
                    </div>
                </div>

                <button type="submit" class="btn-primary">Add Location</button>
            </form>

            <div class="list-section">
                <div class="admin-header" style="margin-top: 40px; border-top: 1px solid #eee; padding-top: 20px;">
                    <h2>Existing Places (<?php echo $total_locations; ?>)</h2>
                </div>

                <div class="table-scroll-wrapper">
                    <table class="admin-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Coords</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php foreach ($locations as $loc): ?>
                            <tr>
                                <td><?php echo $loc['id']; ?></td>
                                <td><strong><?php echo htmlspecialchars($loc['name']); ?></strong></td>
                                <td style="font-size: 12px; color: #666;">
                                    <?php echo round($loc['lat'], 4) . ", " . round($loc['lng'], 4); ?>
                                </td>
                                <td>
                                    <button onclick="confirmDelete(<?php echo $loc['id']; ?>)" class="btn-delete">Delete</button>
                                </td>
                            </tr>
                            <?php endforeach; ?>

                            <?php if($total_locations == 0): ?>
                                <tr><td colspan="4" style="text-align:center; color:#888;">No locations found.</td></tr>
                            <?php endif; ?>
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    </div>

</body>
</html>