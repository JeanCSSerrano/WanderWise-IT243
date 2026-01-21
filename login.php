<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Login - Lakative</title>
    <link rel="stylesheet" href="stylesheets.css">
</head>
<body class="auth-page">
    <div class="auth-container">
        <h2>Welcome!</h2>
        <p>Login to manage Lakative</p>
        
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