<?php
//$servername = "localhost";
//$dbname = "erfansir_ciw";
//$dbusername = "erfansir_123";
//$dbpassword = "Mihanwebhost6174";

$servername = "localhost";
$dbname = "ciw";
$dbusername = "root";
$dbpassword = "123eri";

try {
    $pdo = new PDO("mysql:host=$servername;dbname=$dbname", $dbusername, $dbpassword);
    // set the PDO error mode to exception
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
#    echo "Connected successfully"; 
    }
catch(PDOException $e)
    {
    echo "Connection failed: " . $e->getMessage();
    }
?>