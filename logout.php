<?php
session_start();
require_once "pdo.php";
if((isset($_SESSION['username']))&(!isset($_GET['all']))){
	$username=$_SESSION['username'];
		$sql = "UPDATE users SET loggedin = :loggedin
			WHERE username= :username";
		//print_r($sql);die();
		$stmt = $pdo->prepare($sql);
		$stmt->execute(array(
			':loggedin' => FALSE,
			':username' => $username
		));
session_destroy();
}

if((isset($_GET['all']))&($_SESSION['username']=='erfan')){
		$sql = "UPDATE users SET loggedin = FALSE WHERE username!= 'erfan'";
		$stmt = $pdo->prepare($sql);
		$stmt->execute();
}

header('Location: index.php');
?>