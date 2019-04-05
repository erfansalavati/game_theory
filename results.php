<?php

session_start();

require_once "pdo.php";





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



<script type="text/javascript" language="javascript">
	username="<?php echo($username) ?>";
    var games =<?php echo json_encode($games); ?>;
	admin=(username=='erfan');
</script>


<?php

$stmt = $pdo->query("SELECT id, game_name, setup, state
FROM sessions
WHERE state!='".json_encode('waiting')."'");


$sessions=$stmt->fetchAll(PDO::FETCH_ASSOC);

?>

<script>
var sessions=<?php echo json_encode($sessions); ?>;

var results_div= document.createElement("div");
results_div.style.backgroundColor="Snow";
document.getElementsByTagName('BODY')[0].appendChild(results_div);
var results_table= document.createElement("table");
results_table.border=1;
results_div.appendChild(results_table);

for (i = 1;i <= sessions.length; i++) {
	var session = sessions[sessions.length-i];
	var game_name=session['game_name'];
	var id=session['id'];
	var setup=JSON.parse(session['setup']);
	var state=JSON.parse(session['state']);
	var score=window['score_'+game_name](setup,state);
	var player1=setup.player1;
	var player1_score=parseInt(score['player1']);
	var player2=setup.player2;
	var player2_score=parseInt(score['player2']);

	var table=results_table;
	var tr=table.insertRow();
	var td = tr.insertCell();
	td.appendChild(document.createTextNode(id));
	var td = tr.insertCell();
	td.appendChild(document.createTextNode(game_name));
	var td = tr.insertCell();
	td.appendChild(document.createTextNode(player1));
	var td = tr.insertCell();
	td.appendChild(document.createTextNode(player1_score));
	var td = tr.insertCell();
	td.appendChild(document.createTextNode(player2));
	var td = tr.insertCell();
	td.appendChild(document.createTextNode(player2_score));
	var td = tr.insertCell();
	td.appendChild(document.createTextNode(JSON.stringify(setup)));
	var td = tr.insertCell();
	td.appendChild(document.createTextNode(JSON.stringify(state)));

}
</script>


</body>
	


</html>
