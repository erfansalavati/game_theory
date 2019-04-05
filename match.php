<?php
	session_start();
	require_once "pdo.php";
	$stmt = $pdo->query("SELECT game_name,num_players FROM games");
	$games=$stmt->fetchAll(PDO::FETCH_ASSOC);

	$username=$_SESSION['username'];
	$game_name=$_GET['game_name'];
	unset($_GET['game_name']);

	$match_with_others=false;
	$others_waiting=array();
	
	$stmt = $pdo->query("SELECT s.id 
		FROM sessions s, 
			 session_users su
		WHERE su.username ='".$username."'
		AND su.id=s.id
		AND s.game_name='".$game_name."'
		AND s.state='".json_encode('waiting')."'");
	$waiting=$stmt->fetchAll(PDO::FETCH_ASSOC);

	if(($waiting==false)) {
		$stmt = $pdo->query("SELECT s.id, su.username
			FROM sessions s, 
				 session_users su
			WHERE su.username !='".$username."'
			AND su.id=s.id
			AND s.game_name='".$game_name."'
			AND s.state='".json_encode('waiting')."'");
		$others_waiting=$stmt->fetchAll(PDO::FETCH_ASSOC);
		if(($others_waiting==false)) {
			$session=array('setup'=>'','state'=>'waiting');
			$session_string=json_encode($session);
			$players_string=json_encode(array($username));

			header("Location: create_sessions.php?session_string=".$session_string.
				"&game_name=".$game_name.
				"&players_string=".$players_string);
			die();
		} else {
			$match_with_others='true';
		}
	}
	
?>

<html>

<head>
<?php	
	foreach ($games as $game) {
		echo('<script src="game_'.$game['game_name'].'.js?newversion"></script>');
	}
?>
<script src="main.js?newversion"></script>

</head><body>


<script>
	var username="<?php echo($username) ?>";
	var game_name="<?php echo($game_name) ?>";	
	var match_with_others="<?php echo($match_with_others) ?>";
	if(match_with_others) {
		var others_waiting =<?php echo json_encode($others_waiting); ?>;
		var players=[others_waiting[0]['username'], username];
		createGame(game_name,players);
		deleteSession(others_waiting[0]['id']);
	}
	window.location.href = 'dashboard.php';
</script>


</body>

