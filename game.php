<?php
require_once "pdo.php";
session_start();


$username=$_SESSION['username'];
$session_id=$_GET["session_id"];


$stmt = $pdo->query("SELECT game_name,num_players FROM games");
$games=$stmt->fetchAll(PDO::FETCH_ASSOC);

$compose='false';
if (isset($_POST['new_state_string'])) {
	$compose='true';
	$new_state_string=$_POST['new_state_string'];
	unset($_POST['new_state_string']);
	$session_id=$_POST['session_id'];
	unset($_POST['session_id']);
}

?>
<html>
<head>

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
echo('<script type="text/javascript" src="game_'.$game['game_name'].'.js?newversion"></script>');
}
?>

</head>


<!------------------------------------------------------------------------------------>
<!--                                 Get Session Data                               -->
<!------------------------------------------------------------------------------------>

<?php
$sql = "SELECT * FROM sessions WHERE id=".$session_id;
$stmt = $pdo->query($sql);
$rows=$stmt->fetchAll(PDO::FETCH_ASSOC);
$session_setup_string=$rows[0]['setup'];
$session_state_string=$rows[0]['state'];
$game_name=$rows[0]['game_name'];

$remaining_time=60;
if (isset($_SESSION[$session_id])) {
	$last_move_time=$_SESSION[$session_id];
	$remaining_time=$remaining_time-(time()-$last_move_time);
}

$time_is_up='false';
if ($remaining_time<=0) {
	$time_is_up='true';
}

?>

<script>
	var time_is_up=<?php echo $time_is_up; ?>;

	if (time_is_up==true) {gameIsOver();}
	var remaining_time=<?php echo $remaining_time; ?>;
	window.setInterval(function(){gameIsOver();}, remaining_time*1000);

	function gameIsOver() {
		var xhttp; 
		xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = function() {
			if (this.readyState == 4 && this.status == 200) {
				var get_state=JSON.parse(this.responseText);
				var is_game_over=window['isGameOver_'+game_name](setup,state,player,get_state);
				if(!is_game_over) {
					var new_state=window['gameOver_'+game_name](setup,state,player,get_state);
					new_state_string=JSON.stringify(new_state);
					window.location.href = 'update_sessions.php?session_id='+session_id
					+'&new_state_string='+new_state_string;
				}
			}
		}
		xhttp.open("GET", "get_state.php?session_id="+session_id, true);
		xhttp.send();
	}
</script>



<script>
	var username = "<?php echo $username; ?>";
	var game_name = "<?php echo $game_name; ?>";
	var session_id = <?php echo $session_id; ?>;
	var compose = <?php echo $compose; ?>;
	if (compose==true) {
		new_state=<?php if(isset($new_state_string)) {echo($new_state_string);} else {echo("''");} ?>;
		old_state=<?php echo $session_state_string; ?>;
		composed_state=window['composeState_'+game_name](old_state,new_state);
		if (composed_state==null) {
			alert("Your choice is no longer valid.");
			window.location.href = 'game.php?session_id='+session_id;
		} else {
		new_state_string=JSON.stringify(composed_state);
		window.location.href = 'update_sessions.php?session_id='+session_id
		+'&new_state_string='+new_state_string;
		}
	}
</script>






<body>

<header class="header">

<div class="nav_bar">
<ul>
  <li style="float:right"><a href="dashboard.php">Home</a></li>
</ul>
</div>
			
</header>

  
  
<div style="background-color:lightblue">
<p> Username: <?php echo $username; ?> </p>
</div>

<script>
var session_setup_string = <?php echo $session_setup_string; ?>;
var session_state_string = <?php echo $session_state_string; ?>;
var setup = session_setup_string;
var state = session_state_string;
var player=(username==setup.player1) ? 'player1' : 'player2';

var body=document.getElementsByTagName('BODY')[0];
body.appendChild(window['setupContent_'+game_name](setup,player));
body.appendChild(window['stateContent_'+game_name](setup,state,player));

action_content=window['actionContent_'+game_name](setup,state,player);
action_div=action_content.action_div;
input=action_content.input;
//form=action_content.form;
//new_state=action_content.new_state;
//session_id=action_content.session_id;

body.appendChild(action_div);
form=document.getElementById("submit_form");
if (form!=null) {
	submit_but=document.getElementById("submit_but");
	submit_but.style.visibility = "hidden";
	form.onsubmit=function() {
		var action=window['getAction_'+game_name](input);
		if(window['validate_'+game_name](setup,state,player,action)) {
			var new_state=window['newState_'+game_name](setup,state,player,action);
			var new_state_string = JSON.stringify(new_state);
			document.getElementsByName("new_state_string")[0].value=new_state_string;
	//		alert(document.getElementsByName("new_state_string")[0].value);
			document.getElementsByName("session_id")[0].value=session_id;
			return true;
		} else 	{ alert('Input is not valid.'); return false;};
	}
}
</script>


<script>
window.setInterval(function(){
  var xhttp; 
  xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
		var get_state=JSON.parse(this.responseText);
		if(window['refresh_'+game_name](setup,state,player,get_state)) {
			window.location.href = 'game.php?session_id='+session_id;
		};
    };
  };
  xhttp.open("GET", "get_state.php?session_id="+session_id, true);
  xhttp.send();
}, 5000);
</script>
