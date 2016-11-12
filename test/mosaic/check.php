<?php
/**
 * Created by PhpStorm.
 * User: Админ
 * Date: 09.11.2016
 * Time: 22:39
 */
header( 'Cache-Control: no-store, no-cache, must-revalidate' );
header( 'Cache-Control: post-check=0, pre-check=0', false );
header( 'Pragma: no-cache' );
//var_dump($_SESSION['lastToken']);
if(  $_POST['psw'] == '112233sen' && $_POST['surname'] == 'affff675fffff45fffffffff45fffffff45fffdddddddddgggggggggfdddddd'){
    $_POST = array();
    echo include("234234rdfghfgh.php");
}else{
    header( "Location: /" );
}