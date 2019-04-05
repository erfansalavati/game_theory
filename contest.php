<?php
	session_start();

	require_once "pdo.php";
	
	$stmt = $pdo->query("SELECT game_name,num_players FROM games");
	$games=$stmt->fetchAll(PDO::FETCH_ASSOC);

	$game_over='false';
	$calculate_scores='false';
	
	if(isset($_GET['game_over'])){
		unset($_GET['game_over']);
		$game_over='true';
	}

	if(isset($_GET['calculate_scores'])){
		unset($_GET['calculate_scores']);
		$calculate_scores='true';
	}


?>

<html>

<head>
<script src="main.js?newversion"></script>
<?php	
	foreach ($games as $game) {
		echo('<script src="game_'.$game['game_name'].'.js?newversion"></script>');
	}
?>
</head><body>



<?php
	$stmt = $pdo->query("SELECT username FROM users");
	$users=$stmt->fetchAll(PDO::FETCH_ASSOC);
	
	
	$stmt = $pdo->query("SELECT id, game_name, state, setup
	FROM sessions"
	);
	$sessions=$stmt->fetchAll(PDO::FETCH_ASSOC);
	//var_dump($sessions);die();
?>

<script>
	var game_over=<?php echo json_encode($game_over); ?>;
	var calculate_scores=<?php echo json_encode($calculate_scores); ?>;

	var users=<?php echo json_encode($users); ?>;
	var usernames=Array();
	for (i=0; i<users.length; i++) {
		usernames[i]=users[i]['username'];
	}
	var sessions=<?php echo json_encode($sessions); ?>;

	if(game_over=='true'){
		gameOver(sessions);
		window.location.href = 'dashboard.php';
	}

	if(calculate_scores=='true'){
		scores=calculateScores(sessions,usernames);
		updateScores(usernames,scores);
		window.location.href = 'dashboard.php';
	}
	
</script>



</body>

