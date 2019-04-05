<?php
session_start();

require_once "pdo.php";
$validUser = False;
// Now we check if the data was submitted, isset will check if the data exists.
if ( isset($_POST['sub'])) {
if ( !isset($_POST['username'], $_POST['password']) ) {
	// Could not get the data that should have been sent.
	die ('Username and/or password does not exist!');
}
// Prepare our SQL 
$sql='SELECT username FROM users WHERE username = :username AND password = :password';
$stmt = $pdo->prepare($sql);
	$stmt->execute(array(
        ':username' => $_POST['username'], 
        ':password' => $_POST['password']));
	$row = $stmt->fetch(PDO::FETCH_ASSOC);

	if (!($row == FALSE)) {
		$validUser = True;
		$username=$row['username'];
	}
}
	if(!$validUser) $errorMsg = "Invalid username or password.";
	else {$_SESSION["loggedin"] = true;
		$_SESSION['username'] = $username;
	}
	
	if($validUser) {
		$sql = "UPDATE users SET loggedin = :loggedin
			WHERE username= :username";
		$stmt = $pdo->prepare($sql);
		$stmt->execute(array(
			':loggedin' => TRUE,
			':username' => $username
		));
	header("Location: dashboard.php"); die();
}


if(isset($_SESSION['loggedin'])) {
	if($_SESSION['loggedin']){
		header("Location: dashboard.php"); die();
	}
}
?>



<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8">
		<title>Login Form Tutorial</title>
		<style>
		.login-form {
			width: 300px;
			margin: 0 auto;
			font-family: Tahoma, Geneva, sans-serif;
		}
		.login-form h1 {
			text-align: center;
			color: #4d4d4d;
			font-size: 24px;
			padding: 20px 0 20px 0;
		}
		.login-form input[type="password"],
		.login-form input[type="text"] {
			width: 100%;
			padding: 15px;
			border: 1px solid #dddddd;
			margin-bottom: 15px;
			box-sizing:border-box;
		}
		.login-form input[type="submit"] {
			width: 100%;
			padding: 15px;
			background-color: #535b63;
			border: 0;
			box-sizing: border-box;
			cursor: pointer;
			font-weight: bold;
			color: #ffffff;
		}
		</style>
	</head>
	<body>
		<div class="login-form">
			<h1>Login Form</h1>
			<form action="" method="post">
				<input type="text" name="username" placeholder="Username">
				<input type="password" name="password" placeholder="Password">
				<input type="submit" name="sub" text="Login">
				<h4> -OR- </h4>
				<a href="guest.php">Play as a guest</a>
			</form>
		</div>
	</body>
</html>