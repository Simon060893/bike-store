<?php
var_dump($_POST);
session_start();
$rand = rand(10000,99999);
$_SESSION['lastToken'] =$rand;

if(  $_POST['psw'] == '112233sen' && $_POST['surname'] == 'affff675fffff45fffffffff45fffffff45fffdddddddddgggggggggfdddddd'){
    $_POST = array();
    echo include("234234rdfghfgh.php");
} else{
    echo
    '<form method="POST" action="./index.php" >
    <input type="password"  id="pass" name="psw" placeholder="Password">
    <input type="password" id="surname" name="surname" value="ffff675fffff45fffffffff45fffffff45fffdddddddddgggggggggfdddddd">
    <input type="hidden"   value="<?php echo $rand;?>">
    <input type="submit"  > ';
}
?>