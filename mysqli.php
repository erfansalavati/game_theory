<?php
//$servername = "localhost";
//$dbname = "erfansir_ciw";
//$dbusername = "erfansir_123";
//$dbpassword = "Mihanwebhost6174";

$servername = "localhost";
$dbname = "ciw";
$dbusername = "root";
$dbpassword = "123eri";

$con = mysqli_connect($servername,$dbusername,$dbpassword,$dbname);
if (!$con) {
    die('Could not connect: ' . mysqli_error($con));
}

mysqli_select_db($con,$dbname);
?>