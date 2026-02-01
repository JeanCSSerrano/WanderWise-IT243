<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Login - LAKATIVE</title>
    <link rel="stylesheet" href="stylesheets.css">
</head>
<body class="auth-page">
    <img src="images/LakativeLogo-real.png" class="bg-logo-top-left" alt="Lakative Logo">
    <div class="auth-container">
        <h2>LAKATIVE</h2>
        <p>Explore Baguio City with a smile!</p>
        
        <form action="login_process.php" method="POST" class="auth-form">
            <div class="input-group">
                <label>Username</label>
                <input type="text" name="username" placeholder="Enter username" required>
            </div>
            <div class="input-group">
                <label>Password</label>
                <input type="password" name="password" placeholder="Enter password" required>
            </div>
            <button type="submit" class="auth-btn">Login</button>
        </form>
        
        <div class="auth-footer">
            <p>Don't have an account? <a href="register.php">Sign Up</a></p>
        </div>
    </div>
</body>
</html>