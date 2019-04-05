<?php

session_start();

require_once "pdo.php";



if (isset($_POST['play']) && isset($_POST['session_id']) ) {
	// $_SESSION['game_name']=$_POST['game_name'];
	$game_name=$_POST['game_name'];
	$session_id=$_POST['session_id'];
	unset($_POST['game_name']);
	unset($_POST['session_id']);
	header("Location: game_".$game_name.".php?session_id=".$session_id."&game_name=".$game_name);
}


$username=$_SESSION['username'];


$stmt = $pdo->query("SELECT game_name,num_players FROM games");
$games=$stmt->fetchAll(PDO::FETCH_ASSOC);


?>
<html>

<head>
<meta content="text/html;charset=utf-8" http-equiv="Content-Type">
<meta content="utf-8" http-equiv="encoding">

<meta http-equiv="refresh" content="10">


<!-- Javascript file -->
<script src="main.js?newversion"></script>


<!-- Font -->
<link href='https://fonts.googleapis.com/css?family=Open+Sans:400,300,300italic,400italic,600,700,600italic,700italic,800,800italic' rel='stylesheet' type='text/css'>
<link href='https://fonts.googleapis.com/css?family=Montserrat:400,700' rel='stylesheet' type='text/css'>
<!-- Font -->

<!-- Style Sheets -->
<link rel="stylesheet" href="style.css">
<link rel="stylesheet" href="responsive.css">
<!-- Style Sheets -->

<?php
foreach ($games as $game) {
echo('<script src="game_'.$game['game_name'].'.js?newversion"></script>');
}
?>
</head>


<body>

<header class="header">

<div class="nav_bar">
<ul>
  <li style="float:right"><a href="logout.php">Logout</a></li>
</ul>
</div>
			
</header>



<script type="text/javascript" language="javascript">
	username="<?php echo($username) ?>";
    var games =<?php echo json_encode($games); ?>;
	admin=(username=='erfan');
</script>


<script> 

var games_div= document.createElement("div");
games_div.style.backgroundColor="Aquamarine";
document.getElementsByTagName('BODY')[0].appendChild(games_div);
if (admin) {
	var list_input=document.createElement("input");
	list_input.type="text";
	list_input.value="";
	list_input.name="list_input";
	games_div.appendChild(list_input);
}
var create_games_table= document.createElement("table");
create_games_table.border=1;
games_div.appendChild(create_games_table);
for (i = 1;i <= games.length; i++) {
	var game_name=Array();
	game_name[i]=games[games.length-i]['game_name'];
	num_players=games[games.length-i]['num_players'];
	var table=create_games_table;
	var tr=table.insertRow();
	var td = tr.insertCell();
	td.appendChild(document.createTextNode(game_name[i]));

	var td=tr.insertCell();
	var link = document.createElement("a");
	td.appendChild(link);
	link.innerHTML="Online Match";
	link.href = 'match.php?game_name='+game_name[i];

	if (admin) {
		var button = document.createElement("BUTTON");
		var td = tr.insertCell();
		td.appendChild(button);
		button.onclick = new Function("{var participants=list_input.value.split(' '); if(validatePlayers(participants)) {var all_players=preparePlayers(participants,'"+game_name[i]+"',"+num_players+");createGameBatch('"+game_name[i]+"',all_players);}else {alert('Users are not valid.')}}");
		button.id="but"+i;
		button.innerText="Create";
	}
}


function validatePlayers(participants) {
<?php
	$stmt = $pdo->query("SELECT username FROM users");
	$users=$stmt->fetchAll(PDO::FETCH_ASSOC);
?>
	var users=<?php echo json_encode($users); ?>;
	for (i = 1;i <= users.length; i++){
		users[i-1]=users[i-1]['username'];
	}
	return participants.every(elem => users.indexOf(elem) > -1);
}


</script>


<?php

$stmt = $pdo->query("SELECT s.id, s.game_name 
FROM sessions s, 
     session_users su
WHERE su.username ='".$username."'
AND su.id=s.id
AND s.state!='".json_encode('waiting')."'");

$sessions=$stmt->fetchAll(PDO::FETCH_ASSOC);

$stmt = $pdo->query("SELECT s.id, s.game_name 
FROM sessions s, 
     session_users su
WHERE su.username ='".$username."'
AND su.id=s.id
AND s.state='".json_encode('waiting')."'");
$waiting_sessions=$stmt->fetchAll(PDO::FETCH_ASSOC);

?>

<script>
var sessions=<?php echo json_encode($sessions); ?>;
var waiting_sessions=<?php echo json_encode($waiting_sessions); ?>;

var user_div= document.createElement("div");
user_div.style.backgroundColor="Snow";
document.getElementsByTagName('BODY')[0].appendChild(user_div);
var games_table= document.createElement("table");
games_table.border=1;
user_div.appendChild(games_table);
for (i = 1;i <= waiting_sessions.length; i++) {
	var name=waiting_sessions[waiting_sessions.length-i]['game_name'];
	var id=waiting_sessions[waiting_sessions.length-i]['id'];
	var table=games_table;
	var tr=table.insertRow();
	var td = tr.insertCell();
	td.appendChild(document.createTextNode(id));
	var td = tr.insertCell();
	td.appendChild(document.createTextNode(name));
	var td = tr.insertCell();
	td.appendChild(document.createTextNode("Waiting for another player..."));
}
for (i = 1;i <= sessions.length; i++) {
	var name=sessions[sessions.length-i]['game_name'];
	var id=sessions[sessions.length-i]['id'];
	var table=games_table;
	var tr=table.insertRow();
	var td = tr.insertCell();
	td.appendChild(document.createTextNode(id));
	var td = tr.insertCell();
	td.appendChild(document.createTextNode(name));
	var button = document.createElement("BUTTON");
	var td = tr.insertCell();
	td.appendChild(button);
	button.onclick = new Function("window.location.href = 'game.php?session_id="+id
		+"&game_name="+name+"'");
	button.innerText="Play";
}
</script>


<script>
// All Users Div
if(admin) {
	<?php
	$stmt = $pdo->query("SELECT username, score
	FROM users WHERE loggedin=TRUE;"
	);
	$loggedin_users=$stmt->fetchAll(PDO::FETCH_ASSOC);
	
	$stmt = $pdo->query("SELECT username, score
	FROM users WHERE loggedin=FALSE;"
	);
	$other_users=$stmt->fetchAll(PDO::FETCH_ASSOC);
	?>
	var loggedin_users=<?php echo json_encode($loggedin_users);
	?>;
	var other_users=<?php echo json_encode($other_users);
	?>;
	var all_users_div= document.createElement("div");
	all_users_div.style.backgroundColor="rgb(160, 260, 360)";
	document.getElementsByTagName('BODY')[0].appendChild(all_users_div);

	var link = document.createElement("a");
	all_users_div.appendChild(link);
	link.innerHTML="<big>Delete all users</big>";
	link.href = "update_users.php?delete_all=true";
	all_users_div.appendChild(document.createElement("p"));

	var link = document.createElement("a");
	all_users_div.appendChild(link);
	link.innerHTML="<big>Results</big>";
	link.href = "results.php";
	all_users_div.appendChild(document.createElement("p"));

	var link = document.createElement("a");
	all_users_div.appendChild(link);
	link.innerHTML="<big>Log off all users</big>";
	link.href = "logout.php?all=true";
	var all_users_table= document.createElement("table");
	all_users_table.border=1;
	all_users_div.appendChild(all_users_table);
	for (i = 1;i <= loggedin_users.length; i++) {
		var user=loggedin_users[loggedin_users.length-i]['username'];
		var score=loggedin_users[loggedin_users.length-i]['score'];
		var table=all_users_table;
		var tr=table.insertRow();
		var td = tr.insertCell();
		td.appendChild(document.createTextNode(user));
		var td = tr.insertCell();
		td.appendChild(document.createTextNode(score));
		var td = tr.insertCell();
		td.appendChild(document.createTextNode("logged in"));
	}
	for (i = 1;i <= other_users.length; i++) {
		var user=other_users[other_users.length-i]['username'];
		var score=other_users[other_users.length-i]['score'];
		var table=all_users_table;
		var tr=table.insertRow();
		var td = tr.insertCell();
		td.appendChild(document.createTextNode(user));
		var td = tr.insertCell();
		td.appendChild(document.createTextNode(score));
		var td = tr.insertCell();
		td.appendChild(document.createTextNode(""));
	}
	var link = document.createElement("a");
	all_users_div.appendChild(link);
	link.innerHTML="<big>Game Over</big>";
	link.href = "contest.php?game_over=true";

	all_users_div.appendChild(document.createElement("p"));
	var link = document.createElement("a");
	all_users_div.appendChild(link);
	link.innerHTML="<big>Calculate Scores</big>";
	link.href = "contest.php?calculate_scores=true";

	all_users_div.appendChild(document.createElement("p"));
	var link = document.createElement("a");
	all_users_div.appendChild(link);
	link.innerHTML="<big>Reset all scores</big>";
	link.href = "contest.php?reset_scores=true";
}

</script>


<script>
// All Sessions Div
if(admin) {
	<?php
	$stmt = $pdo->query("SELECT s.id, s.game_name, s.state, s.setup, su.username
	FROM sessions s, session_users su WHERE s.id=su.id"
	);
	$all_sessions=$stmt->fetchAll(PDO::FETCH_ASSOC);
	?>
	var all_sessions=<?php echo json_encode($all_sessions); ?>;
	var all_sessions_div= document.createElement("div");
	all_sessions_div.style.backgroundColor="rgb(240, 240, 240)";
	document.getElementsByTagName('BODY')[0].appendChild(all_sessions_div);
	var button = document.createElement("BUTTON");
	all_sessions_div.appendChild(button);
	button.innerText="Delete all sessions";
	button.onclick = new Function("window.location.href = 'delete_sessions.php?all=true'");
	var all_sessions_table= document.createElement("table");
	all_sessions_table.border=1;
	all_sessions_div.appendChild(all_sessions_table);
	for (i = 1;i <= all_sessions.length; i++) {
		var name=all_sessions[all_sessions.length-i]['game_name'];
		var id=all_sessions[all_sessions.length-i]['id'];
		var user=all_sessions[all_sessions.length-i]['username'];		
		var state=JSON.parse(all_sessions[all_sessions.length-i]['state']);
		var setup=JSON.parse(all_sessions[all_sessions.length-i]['setup']);
		var turn=setup[state.turn];
		var table=all_sessions_table;
		var tr=table.insertRow();
		var td = tr.insertCell();
		td.appendChild(document.createTextNode(id));
		var td = tr.insertCell();
		td.appendChild(document.createTextNode(name));
		var td = tr.insertCell();
		td.appendChild(document.createTextNode(user));
		var td = tr.insertCell();
		td.appendChild(document.createTextNode(turn));
	}
}
</script>








		<footer>
			<div class="container">
				<div class="row">
				
					<!-- Single Footer -->
					<div class="col-sm-3">
						<div class="single-footer">
						</div>
					</div>
					<!-- Single Footer -->
										
				</div>
			</div>
			
		</footer>
		
		<!-- footer -->
		
		

        <script src="https://code.jquery.com/jquery-1.12.0.min.js"></script>		
		
		
        <!-- Google Analytics: change UA-XXXXX-X to be your site's ID. -->
        <script>
            (function(b,o,i,l,e,r){b.GoogleAnalyticsObject=l;b[l]||(b[l]=
            function(){(b[l].q=b[l].q||[]).push(arguments)});b[l].l=+new Date;
            e=o.createElement(i);r=o.getElementsByTagName(i)[0];
            e.src='https://www.google-analytics.com/analytics.js';
            r.parentNode.insertBefore(e,r)}(window,document,'script','ga'));
            ga('create','UA-XXXXX-X','auto');ga('send','pageview');
        </script>
    </body>
	


</html>
