<?php
require_once "pdo.php";

if(isset($_GET['game_name']) ) {
	$game_name=$_GET['game_name'];
	unset($_GET['game_name']);
} else {
	header('Location: login.php');
}
echo('<script type="text/javascript" src="game_'.$game_name.'.js"></script>');
?>


<script>
var game_name =<?php echo("'".$game_name."'"); ?>;
</script>

<?php
include("standalone.html");
?>
