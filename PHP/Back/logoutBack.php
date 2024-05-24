<?php
session_start();
header('Content-Type: application/json; charset=utf-8');
require_once("Const.php");

$back = $_SESSION['mode'];

if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    unset($_SESSION['username']);
    echo json_encode(array("back" => $back));
    return;
}
?>