<?php session_start();?>
<?php $_SESSION['mode'] = 0;?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="keywords" content="Master Mind Game Online">
    
    <!-- preso da Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Comic+Neue:ital,wght@0,400;0,700;1,400&display=swap" rel="stylesheet">
    <!---->
    
    <!-- Preso da internet -->
    <link rel="stylesheet" href="CSS/meyer.css">
    <!---->

    <link rel="stylesheet" href="CSS/header.css">
    <link rel="stylesheet" href="CSS/loginPage.css">
    <link rel="stylesheet" href="CSS/language.css">
    <link rel="stylesheet" href="CSS/homePage.css">
    <title>Mastermind</title>
</head>
<body>
    <header>
        <?php include 'PHP/Alloc/headerAlloc.php';?>
    </header>
    <main>
        <button type="button" class="mode" id="single">Single Match</button>
        <?php include 'PHP/loginPage.php'?>
        <?php include 'HTML/languageMod.html'?>
        <button type="button" class="mode" id="compet">Competitive Mode</button>
        <button type="button" class="mode" id="custom">Custom Mode</button>
        <button type="button" class="mode" id="rules">Rules</button>
    </main>
    <script src="JS/cookie.js"></script>
    <script src="JS/language.js"></script>
    <script src="JS/login.js"></script>
    <?php include 'PHP/Alloc/listnerAlloc.php'?>
    <script src="JS/homepage.js"></script>
</body>
</html>