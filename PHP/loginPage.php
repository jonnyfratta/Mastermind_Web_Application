<div id="mod">
    <button type="button" id="close">✕</button>
    <h3 id="welcome"></h3>
        <form id="loginForm">
            <label for="username" id="usernameLabel"></label>
            <input type="text" name="username" id="username" placeholder="Username" required>
            
            <label for="password" id="pwLabel"></label>
            <input type="password" name="password" id="password" placeholder="Enter Password" required>
            
            <button type="submit" class="button" id="log"></button>
            
            <a id ="reg" href="HTML/regPage.html?return=<?php echo isset($_SESSION['mode']) ? $_SESSION['mode'] : ''; ?>">Sign Up</a>
            
            <div id="msg"></div>
        </form>
</div>