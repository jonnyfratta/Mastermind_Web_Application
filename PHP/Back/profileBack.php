<?php
session_start();
header('Content-Type: application/json; charset=utf-8');
require_once("Const.php");

if(isset($_COOKIE['language'])){
$path = '../../JSON/'.$_COOKIE['language'].'.json';


$translations0 = file_get_contents($path);
$translations = json_decode($translations0, true);

$emptyFavMod = $translations['emptyFavMod'];

if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    $username = $_SESSION['username'];

    //Data iscrizione
    $pdo = new PDO(DATABASE, USER, PASSWORD);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        
    $query = "SELECT * 
              FROM user 
              WHERE username = :username";

    $com = $pdo->prepare($query);
    $com->bindValue(':username', $username);
    $com->execute();

    $record = $com->fetch(PDO::FETCH_ASSOC);

    $subDate = ($record['subscription']) ? $record['subscription'] : time();
    $subDate = date("d-M-Y", strtotime($subDate));


    //Totale Vittorie
    $query = $query = "SELECT SUM(level) AS tot 
                       FROM `match` 
                       WHERE player = :username 
                             AND victory = :victory";
    
    $com = $pdo->prepare($query);
    $com->bindValue(":username", $username);
    $com->bindValue(":victory", 1);
    $com->execute();
    
    $record = $com->fetch(PDO::FETCH_ASSOC);
    $totVic = ($record["tot"]) ? $record['tot'] : 0;

    //Totale Partite
    $query = "SELECT SUM(level) AS tot 
              FROM `match` 
              WHERE player = :username";

    $com = $pdo->prepare($query);
    $com->bindValue(":username", $username);
    $com->execute();

    $record = $com->fetch(PDO::FETCH_ASSOC);
    $totMat = ($record['tot']) ? $record['tot'] : 0;


    //Totale Percentuale
    $totPerc = ($totMat) ? round(($totVic*100)/$totMat, 1) : 0;


    //Modalità perferita
    $query = "SELECT mode, SUM(level) AS modeCount 
              FROM `match` 
              WHERE player = :username 
              GROUP BY mode 
              ORDER BY modeCount DESC 
              LIMIT 1";

    $com = $pdo->prepare($query);
    $com->bindValue(":username", $username);
    $com->execute();
    
    $record = $com->fetch(PDO::FETCH_ASSOC);
    $favMod = ($record) ? $record['mode'] : $emptyFavMod;
  

    //fm_totMat
    $query = "SELECT SUM(level) AS tot , COUNT(*) AS attempts
              FROM `match` 
              WHERE mode = :mode 
                    AND player = :username";

    $com = $pdo->prepare($query);
    $com->bindValue(":mode", $favMod);
    $com->bindValue(":username", $username);
    $com->execute();

    $record = $com->fetch(PDO::FETCH_ASSOC);
    $fm_totMat = ($record['tot']) ? $record['tot'] : 0;
    $compAtt = ($record['attempts']) ? $record['attempts'] : 0;  

    //fm_totVit
    $query = "SELECT SUM(level) AS tot 
              FROM `match` 
              WHERE mode = :mode 
                    AND player = :username
                    AND victory = :victory";

    $com = $pdo->prepare($query);
    $com->bindValue(":mode", $favMod);
    $com->bindValue(":username", $username);
    $com->bindValue(":victory", true);
    $com->execute();

    $record = $com->fetch(PDO::FETCH_ASSOC);
    $fm_totVit = ($record['tot']) ? $record['tot'] : 0;

    $fm_perc = ($fm_totMat) ? round(($fm_totVit*100)/$fm_totMat, 1) : 0;

    
    //globalPos
    $query = "SELECT player, SUM(level) AS third
              FROM `match` m
              WHERE victory = true
              GROUP BY player
              ORDER BY third DESC
              LIMIT 20;";

    $com = $pdo->prepare($query);
    $com->execute();
    
    $record = $com->fetchAll(PDO::FETCH_ASSOC);

    $globalPos = 0;

    foreach ($record as $i => $record) {
        if ($record['player'] == $username) {
            $globalPos = $i + 1;
            break;
        }
    }

    //streakPos
    $query = "SELECT player, MAX(level) AS third
              FROM `match` m
              WHERE mode = 'competitive' AND victory = true
              GROUP BY player
              ORDER BY third DESC
              LIMIT 20;";

    $com = $pdo->prepare($query);
    $com->execute();
    
    $record = $com->fetchAll(PDO::FETCH_ASSOC);

    $streakPos = 0;
    $best_streak = 0;

    foreach ($record as $i => $record) {
        if ($record['player'] == $username) {
            $streakPos = $i + 1;
            $best_streak = $record['third'];
            break;
        }
    }

    //scorePos
    $query = "SELECT  u.username AS player, MAX(m.points) AS third
              FROM user u
                    INNER JOIN
                   `match` m ON u.username = m.player
              WHERE m.mode = 'competitive'
              GROUP BY u.username
              ORDER BY third DESC
              LIMIT 20;";

    $com = $pdo->prepare($query);
    $com->execute();
    
    $record = $com->fetchAll(PDO::FETCH_ASSOC);

    $scorePos = 0;

    foreach ($record as $i => $record) {
        if ($record['player'] == $username) {
            $scorePos = $i + 1;
            break;
        }
    }

    $pdo = null;
    echo json_encode(array( "date" => $subDate, 
                            "totVic" => $totVic, 
                            "totMat" => $totMat, 
                            "totPerc" => $totPerc,
                            "favMod" => $favMod,
                            "fm_totMat" => $fm_totMat,
                            "fm_totVit" => $fm_totVit,
                            "fm_perc" => $fm_perc,
                            "globalPos" => $globalPos,
                            "compAtt" => $compAtt,
                            "streakPos" => $streakPos,
                            "best_streak" => $best_streak,
                            "scorePos"  => $scorePos
                        ));
    return;
}
}
?>