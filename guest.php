<?php

session_start();

require_once "pdo.php";

$stmt = $pdo->query("SELECT game_name FROM games");
$games=$stmt->fetchAll(PDO::FETCH_ASSOC);

?>
<body>

<script>
var games =<?php echo json_encode($games); ?>;

var guest_div= document.createElement("div");
guest_div.style.backgroundColor="Aquamarine";
document.getElementsByTagName('BODY')[0].appendChild(guest_div);

var create_games_table= document.createElement("table");
create_games_table.border=1;
guest_div.appendChild(create_games_table);
for (i = 1;i <= games.length; i++) {
	var game_name=Array();
	game_name[i]=games[games.length-i]['game_name'];
	var table=create_games_table;
	var tr=table.insertRow();
	var td = tr.insertCell();
	td.appendChild(document.createTextNode(game_name[i]));
	var link = document.createElement("a");
	link.text="Play";
	var td = tr.insertCell();
	td.appendChild(link);
	link.href = "standalone.php?game_name="+game_name[i];
}
</script>

</body>