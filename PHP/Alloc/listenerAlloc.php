<?php
    if(isset($_SESSION['username'])){
        echo '<script> document.getElementById("loginButton").addEventListener("click", function () {
            window.location.href="PHP/profilePage.php";
            let loginForm = document.getElementById("loginForm");
            loginForm.style.opacity = "0";
            loginForm.style.visibility = "hidden";
        }); </script>';}
?>