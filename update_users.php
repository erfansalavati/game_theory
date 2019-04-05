<?php
	session_start();

	require_once "pdo.php";
	if(isset($_GET['delete_all'])){
		unset($_GET['delete_all']);
		$sql = "DELETE FROM users WHERE username NOT IN ('erfan','kasra','zahra')";
		$stmt = $pdo->prepare($sql);
		$stmt->execute();
		header("Location: dashboard.php"); die();
	}
	if(isset($_GET['reset'])) {
		unset($_GET['reset']);
		$sql = "UPDATE users SET score = 0";
			$stmt = $pdo->prepare($sql);
			$stmt->execute();
		header("Location: dashboard.php"); die();
	}
	if(isset($_GET['update_scores'])) {
		unset($_GET['update_scores']);
		$user_string=$_GET['user_string'];
		unset($_GET['user_string']);
		$user = json_decode($user_string);
		//var_dump($user);
		//die();
		$sql = "UPDATE users SET score = :score
			WHERE username= :username";
		$stmt = $pdo->prepare($sql);
		$stmt->execute(array(
			':score' => $user->score,
			':username' => $user->username
		));
	}
?>