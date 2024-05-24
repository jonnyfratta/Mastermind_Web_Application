<?php
session_start();
header('Content-Type: application/json; charset=utf-8');
require_once("Const.php");

$languageCookie = isset($_COOKIE['language']) ? $_COOKIE['language'] : 'it';
$path = '../../JSON/'.$languageCookie.'.json';

// Leggi il contenuto del file JSON
$translations0 = file_get_contents($path);

// Decodifica il JSON in un array associativo
$translations = json_decode($translations0, true);

$wrongParam  =  $translations['login']['wrongParam'];
$unexUser    =  $translations['login']['unexUser'];
$unexPass    =  $translations['login']['unexPass'];
$success     =  $translations['login']['success'];
$invUsername =  $translations['msg']['invUsername'];
$invPassword =  $translations['msg']['invPassword'];


if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    
    if(isset($_POST['username']) && isset($_POST['password'])){
        $username = $_POST['username'];
        $password = $_POST['password'];
    } else {
        echo json_encode(array("outcome" => false, "message" => $wrongParam, "back" => ""));
        return;
    }

    $RegExp = '/^[\w.]{5,20}$/'; // '/^[a-zA-Z0-9_.]{5,20}$/';
    
    if (preg_match($RegExp, $username) && preg_match($RegExp, $password)) {
        $pdo = new PDO(DATABASE, USER, PASSWORD);
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        
        $query = "SELECT * 
                  FROM user 
                  WHERE username = :username";

        $com = $pdo->prepare($query);
        $com->bindValue(':username', $username);
        $com->execute();

        $record = $com->fetch();
        if (!$record) {
            echo json_encode(array("outcome" => false, "message" => $unexUser, "back" => ""));
            return;
        }
        if(!password_verify($password, $record['password'])) {
            echo json_encode(array("outcome" => false, "message" => $unexPass, "back" => ""));
            return;
        }
        $pdo = null;

        $_SESSION['username'] = $username;

        if (isset($_SESSION['mode'])) {
            $back = $_SESSION['mode'];
        } else {
            $back = "index.php";
        }
        
        echo json_encode(array("outcome" => true, "message" => $success, "back" => $back));
        return;

    } else {
        if(preg_match($RegEXP, $username)){
            echo json_encode(array("outcome" => false, "message" => $invUsername));
            return;
        }
        else{
            echo json_encode(array("outcome" => false, "message" => $invPassword));
            return;
        }   
    }
}
?>