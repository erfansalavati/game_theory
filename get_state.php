<?php
$session_id=$_GET['session_id'];

require "mysqli.php";

$sql="SELECT state FROM sessions WHERE id = '".$session_id."'";
$result = mysqli_query($con,$sql);

$variable=mysqli_fetch_array($result);

echo($variable['state']);

mysqli_close($con);
?>
