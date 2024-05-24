<?php
session_start();
header('Content-Type: application/json; charset=utf-8');
require_once("Const.php");

if($_SERVER['REQUEST_METHOD'] == 'GET'){
    if(!isset($_SESSION['mode'])){
        echo json_encode(array('error'=> 'No Mode was found'));
        return;
    }

    $scoreView = $_GET['scoreView'];

    $pdo = new PDO(DATABASE,USER,PASSWORD);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $query = "";

    switch($_SESSION['mode']){
        case 1:
            $query = "SELECT player, SUM(level) AS third
                      FROM `match` m
                      WHERE victory = true
                      GROUP BY player
                      ORDER BY third DESC
                      LIMIT 20;";
            break;

        case 2:
            if($scoreView == "true"){
                $query = "SELECT  u.username AS player, MAX(m.points) AS third
                          FROM user u
                                INNER JOIN
                               `match` m ON u.username = m.player
                          WHERE m.mode = 'competitive'
                          GROUP BY u.username
                          ORDER BY third DESC
                          LIMIT 20;";
            }
            else {
                $query = "SELECT player, MAX(level) AS third
                          FROM `match` m
                          WHERE mode = 'competitive' AND victory = true
                          GROUP BY player
                          ORDER BY third DESC
                          LIMIT 20;";
            }
            break;

        default: echo json_encode(null);
            return;  
    }

    $com = $pdo->prepare($query);
    $com->execute();
    $records = $com->fetchAll(PDO::FETCH_ASSOC);

    $position = 1;
    foreach ($records as &$record) {
        $record['position'] = $position++;
    }

    echo json_encode($records);

    $pdo = null;
    return;
}

?>