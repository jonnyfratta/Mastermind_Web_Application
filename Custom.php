<?php session_start();
$_SESSION["mode"] = 3;
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mastermind</title>

    <!-- from Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Comic+Neue:ital,wght@0,400;0,700;1,400&display=swap" rel="stylesheet">
    <!---->

    <!-- from the web -->
    <link rel="stylesheet" href="CSS/meyer.css">
    <!---->

    <link rel="stylesheet" href="CSS/header.css">
    <link rel="stylesheet" href="CSS/loginPage.css">
    <link rel="stylesheet" href="CSS/language.css">
    <link rel="stylesheet" href="CSS/GameScreen.css">
    <link rel="stylesheet" href="CSS/customScreen.css">
</head>
<body>
    <header>
        <div id="return"></div>
        <?php include 'PHP/Alloc/headerAlloc.php';?>
    </header>

    <main>
        <div id="screen_left">
            <div id="settings">
                <button type="button" id="start">Start Game</button>

                <label for="rows" id="rowLabel">Number of Attempts: </label>
                <input type="number" name="rows" id="rows" min="1" max="20" value="10">

                <label for="columns" id="columnLabel">Number of Colors in Combination: </label>
                <select id="columns">
                    <option value="2">2</option>
                    <option value="4" selected>4</option>
                    <option value="6">6</option>
                </select>
            </div>
            <div class="tutorial legend">
                <div class="legend-item">
                    <span class="legend-pin legend-black" aria-hidden="true"></span>
                    <span id="case1"></span>
                </div>
                <div class="legend-item">
                    <span class="legend-pin legend-white" aria-hidden="true"></span>
                    <span id="case2"></span>
                </div>
                <div class="legend-item">
                    <span class="legend-pin legend-empty" aria-hidden="true"></span>
                    <span id="case3"></span>
                </div>
                <div class="legend-item">
                    <span class="legend-pin legend-mixed" aria-hidden="true"></span>
                    <span id="case4"></span>
                </div>
            </div>
        </div>

        <div id="screen_center">
            <table id="board">
                <thead>
                    <tr>
                        <td class="attempt" id="hidden"></td>
                        <td class="outcome" id="none"></td>
                    </tr>
                </thead>
                <tbody id="box">
                </tbody>
                <tfoot>
                    <tr>
                        <td class="attempt" id="current"></td>
                        <td class="outcome" id="color_selection"></td>
                    </tr>
                </tfoot>
            </table>
        </div>

        <div id="screen_right">
            <?php include 'PHP/loginPage.php'?>
            <?php include 'HTML/languageMod.html'?>

            <?php require 'PHP/Alloc/multiColorAlloc.php';?>

            <?php require 'PHP/Alloc/buttonsAlloc.php'; ?>
        </div>
    </main>

    <script src="JS/cookie.js"></script>
    <script src="JS/language.js"></script>
    <script src="JS/login.js"></script>
    <?php include 'PHP/Alloc/listenerAlloc.php'?>
    <script src="JS/allocation.js"></script>
    <script src="JS/game.js"></script>
</body>
</html>
