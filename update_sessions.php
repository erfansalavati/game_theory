<?php
require_once "pdo.php";


if(isset($_GET['new_state_string']) ) {
$new_state_string=$_GET['new_state_string'];
unset($_GET['new_state_string']);

$session_id=$_GET['session_id'];

//print_r($session_id);
//die();
unset($_GET['session_id']);



//Update session state
$sql = "UPDATE sessions SET state = :state
	WHERE id= :session_id";
// print_r($sql);
$stmt = $pdo->prepare($sql);
$stmt->execute(array(
	':state' => $new_state_string,
	':session_id' => $session_id,
));

$_SESSION[$session_id]=time();

header('Location: game.php?session_id='.$session_id);
}

?>

