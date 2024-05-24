<?php
session_start();
header('Content-Type: application/json; charset=utf-8');
require_once("Const.php");

$path = '../../JSON/'.$_COOKIE['language'].'.json';

$translations0 = file_get_contents($path);
$translations = json_decode($translations0, true);

$invName     =  $translations['registration']['invName'];
$invSurname  =  $translations['registration']['invSurname'];
$invUser     =  $translations['msg']['invUsername'];
$invEmail    =  $translations['msg']['regInvEmail'];
$invPass     =  $translations['msg']['invPassword'];
$invCpass    =  $translations['registration']['invCpass'];
$difPass     =  $translations['msg']['regInvCpw'];
$alExEmail   =  $translations['registration']['alExEmail'];
$alExUser    =  $translations['registration']['alExUser'];
$success     =  $translations['registration']['success'];
$error       =  $translations['registration']['error'];

if ($_SERVER['REQUEST_METHOD'] == 'POST') {

    $rExp = '/^[\w.]{5,20}$/';

    $name = $_POST['name'];
    $surname = $_POST['surname'];
    $username = $_POST['username'];
    $email = $_POST['mail'];
    $password = $_POST['pw'];
    $cpassword = $_POST['cpw'];
    $subscription = date('Y-m-d', time());

    if(!isset($name) || !is_string($name)) {
        echo json_encode(array('outcome'=> false, 'message' => $invName));
        return;
    }

    elseif(!isset($surname) || !is_string($surname)) {
        echo json_encode(array('outcome'=> false, 'message' => $invSurname));
        return;
    }

    elseif(!isset($username) || !preg_match($rExp, $username)) {
        echo json_encode(array('outcome'=> false, 'message' => $invUser));
        return;
    }

    elseif(!isset($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)){
        echo json_encode(array('outcome'=> false, 'message' => $invEmail));
        return;
    }

    elseif(!isset($password) || !preg_match($rExp, $password)){
        echo json_encode(array('outcome'=> false, 'message' => $invPass));
        return;
    }

    elseif(!isset($cpassword)) {
        echo json_encode(array('outcome'=> false, 'message' => $invCpass));
        return;
    }
    
    elseif(($cpassword !== $password)){
        echo json_encode(array('outcome'=> false, 'message' => $difPass));
        return;
    }

    $pdo = new PDO(DATABASE, USER, PASSWORD);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $query = "SELECT * 
              FROM user 
              WHERE email = :email";
    $com = $pdo->prepare($query);
    $com->bindValue(':email', $email);
    $com->execute();
    $record = $com->fetch();

    $query2 = "SELECT * 
               FROM user 
               WHERE username = :username";
    $com2 = $pdo->prepare($query2);
    $com2->bindValue(':username', $username);
    $com2->execute();
    $record2 = $com2->fetch();

    if ($record) {
        echo json_encode(array("outcome" => false, "message" => $alExEmail));
        return;
    }
    elseif($record2) {
        echo json_encode(array("outcome"=> false, "message" => $alExUser));
        return;
    }
    else{
        $password_hash = password_hash($password, PASSWORD_BCRYPT);

        $newProfile = "INSERT INTO user (username, email, password, name, surname, subscription) 
                       VALUES (:username, :email, :password, :name, :surname, :subscription)";
        $com = $pdo->prepare($newProfile);
        $com->bindValue(":username", $username);
        $com->bindValue(":email", $email);
        $com->bindValue(":password", $password_hash);
        $com->bindValue(":name", $name);
        $com->bindValue(":surname", $surname);
        $com->bindValue(":subscription", $subscription);
        $com->execute();

        $pdo = null;

        if($com->rowCount()) {
            $_SESSION["username"] = $username;
            echo json_encode(array("outcome"=> true, "message"=> $success));
            return;
        }
        else{
            echo json_encode(array("outcome"=> false, "message"=> $error));
            return;
        }
    }
}
?>