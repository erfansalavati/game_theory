<?php
require_once "pdo.php";

if(isset($_GET['session_string']) ) {
	$game_name=$_GET['game_name'];
	unset($_GET['game_name']);
	$session_string=$_GET['session_string'];
	$players_string=$_GET['players_string'];
//	$batch=$_GET['batch'];
	unset($_GET['session_string']);
	unset($_GET['players_string']);
//	unset($_GET['batch']);
} else {
//	header('Location: dashboard.php');
}
$players=json_decode($players_string);
$session=json_decode($session_string);

//$session->setup->player1=$players[0];
//$session->setup->player2=$players[1];

$setup_string=json_encode($session->setup);
$state_string=json_encode($session->state);

$sql = "INSERT INTO sessions (game_name,setup,state)
	VALUES (:name, :setup, :state)";
// print_r($sql);
$stmt = $pdo->prepare($sql);
$stmt->execute(array(
	':name' => $game_name,
	':setup' => $setup_string,
	':state' => $state_string));

$sql = "SELECT id FROM sessions ORDER by id DESC LIMIT 1";
// print_r($sql);
$stmt = $pdo->query($sql);
$rows=$stmt->fetchAll(PDO::FETCH_ASSOC);	
$session_id=$rows[0]['id'];

//	$players_array=json_decode($players);

foreach($players as $player) {
	$sql = "INSERT INTO session_users (id,username)
		VALUES (:session_id, :username )";
	$stmt = $pdo->prepare($sql);
	$stmt->execute(array(
		':session_id' => $session_id,
		':username' => $player));
}

header("Location: dashboard.php"); die();

?>