<?php
//header("Access-Control-Allow-Origin: *");
$req = preg_split("/\//", $_SERVER['REQUEST_URI']);
$url = "http://{$_SERVER['HTTP_HOST']}/{$req[1]}/{$req[2]}/ ";
$escaped_url = htmlspecialchars($url, ENT_QUOTES, 'UTF-8');
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Bikes</title>
    <base id="baseHref" href="<?php echo $escaped_url ?>">
    
    <link rel="stylesheet" href="node_modules/bootstrap/dist/css/bootstrap.min.css">
    <link rel="stylesheet" href="dist/styles/main.min.css">


    <script src="node_modules/angular/angular.min.js"></script>
    <script src="node_modules/angular-ui-router/release/angular-ui-router.min.js"></script>
    <script src="node_modules/three/build/three.min.js"></script>

    <script src="assets/lib/OrbitControls.js"></script>
    <script src="assets/lib/MTLLoader.js"></script>
    <script src="assets/lib/OBJLoader.js"></script>
    <script src="dist/scripts/main.js"></script>

     
</head>
<body ng-app="main" ng-controller="BaseCntrl as base">
<nav role='navigation'>
    <ul>
        <li><a href="#"  ui-sref="home" ui-sref-active="active">Home</a></li>
        <li><a href="#"  ui-sref="contact" ui-sref-active="contact">Contact Us</a></li>
    </ul>
</nav>


<ui-view></ui-view>
</body>
</html>
