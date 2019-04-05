<?php
require_once "pdo.php";


if(isset($_GET['all']) ) {
	$all=$_GET['all'];
	unset($_GET['all']);
	if ($all=='true') {
		$sql = "DELETE FROM sessions; DELETE FROM session_users;";
		// print_r($sql);
		$stmt = $pdo->prepare($sql);
		$stmt->execute();
	}
	header('Location: dashboard.php');
}

if(isset($_GET['session_id'])) {
	$session_id=$_GET['session_id'];
	unset($_GET['session_id']);
	$sql = "DELETE FROM sessions WHERE id=".$session_id."; DELETE FROM session_users WHERE id=".$session_id.";";
	// print_r($sql);
	$stmt = $pdo->prepare($sql);
	$stmt->execute();
	
}

?>
