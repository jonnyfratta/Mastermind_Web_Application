<?php
session_start();
require_once("Const.php");

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if(!isset($_SESSION['username'])){
        echo json_encode(array('status' => 'No logged account'));
        return;
    } 
    $username = $_SESSION['username'];

    $pdo = new PDO(DATABASE, USER, PASSWORD);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $data = json_decode(file_get_contents('php://input'), true);
    
    $query = "INSERT INTO `match` (`player`, `mode`, `level`, `points`, `date`, `victory`) 
                            VALUES (:player, :mode, :level, :points, :date, :victory)";

    $com = $pdo->prepare($query);
    $com->bindParam(':player', $username);
    $com->bindParam(':mode', $data['mode']);
    $com->bindParam(':level', $data['level']);
    // $points = $data['points'];
    // $com->bindParam(':points', intval($points));
    $com->bindParam(':points', $data['points']);
    $com->bindParam(':date', $data['date']);
    $com->bindParam(':victory', $data['victory']);

    $com->execute();

    echo json_encode(array('status' => 'success'));
}
$pdo = null;
?>

