<?php session_start();?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Profile</title>

    <!-- preso da Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Comic+Neue:ital,wght@0,400;0,700;1,400&display=swap" rel="stylesheet">
    <!---->

    <!-- Preso da internet -->
    <link rel="stylesheet" href="../CSS/meyer.css">
    <!---->

    <link rel="stylesheet" href="../CSS/header.css">
    <link rel="stylesheet" href="../CSS/language.css">
    <link rel="stylesheet" href="../CSS/profilePage.css">
</head>
<body>
    <header>
        <div id="return"></div>
        <?php echo '<h2 id="user">'.$_SESSION['username'].'</h2>';?>
        <i id="langButton"></i>
        <i id="logout"></i>

    </header>
    <main>
        <div class="since">
            <h3 id="dateLabel"></h3>
            <span id='date'></span>
        </div>

        <div id="langMod">
            <div id="it" class="language">
                <img class="flag" src="../PNG/BANDIERE/italy.png" alt="italy's flag">
                <p>IT</p>
            </div>
            <div id="en" class="language">
                <img class="flag" src="../PNG/BANDIERE/united-kingdom.png" alt="uk's flag">
                <p>EN</p>
            </div>
            <div id="es" class="language">
                <img class="flag" src="../PNG/BANDIERE/spain.png" alt="spain's flag">
                <p>ES</p>
            </div>
            <div id="fr" class="language">
                <img class="flag" src="../PNG/BANDIERE/france.png" alt="france's flag">
                <p>FR</p>
            </div>
            <div id="de" class="language">
                <img class="flag" src="../PNG/BANDIERE/germany.png" alt="germany's flag">
                <p>DE</p>
            </div>
        </div>
        
        <div class="pos">
            <div class="boardBox" id="global"></div>
            <div class="boardBox" id="comp">
                <div id = "streak"></div>
                <div id = "score"></div>
            </div>
        </div>

        <div class="stats">
            <div id="VT">
                <h4 id="glStats"></h4>
            </div>
            <div id="FM">
                <h4 id="fmStats"></h4>
            </div>
        </div>
    </main>
    <script src="../JS/cookie.js"></script>
    <script src="../JS/language.js"></script>
    <script src="../JS/profile.js"></script>
</body>
</html>