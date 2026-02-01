<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Sign Up - Lakative</title>
    <link rel="stylesheet" href="stylesheets.css">
</head>
<body class="auth-page">
    <img src="images/LakativeLogo-real.png" class="bg-logo-top-left" alt="Lakative Logo">
    <div class="auth-container">
        <h2>Join Lakative</h2>
        <p>Explore Baguio with us!</p>
        
        <form action="register_process.php" method="POST" class="auth-form" id="regForm">
            <div class="input-group">
                <label>Username</label>
                <input type="text" name="username" placeholder="Choose a username" required>
            </div>
            <div class="input-group">
                <label>Password</label>
                <input type="password" name="password" id="password" placeholder="Create a password" required>
            </div>
            <div class="input-group">
                <label>Confirm Password</label>
                <input type="password" name="confirm_password" id="confirm_password" placeholder="Repeat password" required>
            </div>
            <button type="submit" class="auth-btn">Create Account</button>
        </form>
        
        <div class="auth-footer">
            <p>Already have an account? <a href="login.php">Login</a></p>
        </div>
    </div>

    <script>
        
        const form = document.getElementById('regForm');
        form.onsubmit = function() {
            const pass = document.getElementById('password').value;
            const confirm = document.getElementById('confirm_password').value;
            if (pass !== confirm) {
                alert("Passwords do not match!");
                return false;
            }
            return true;
        };
    </script>
</body>
</html>