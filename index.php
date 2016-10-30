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


    <script src="node_modules/angular/angular.min.js"></script>
    <script src="node_modules/angular-ui-router/release/angular-ui-router.min.js"></script>
    <script src="node_modules/three/build/three.min.js"></script>
    <script src="node_modules/three-obj-loader/dist/index.js"></script>
    <script src="assets/libs/OrbitControls.js"></script>
    <script src="dist/scripts/main.js"></script>

    <style>
        *{
            padding:0;
            margin: 0;
        }
		.full{
			position:absolute;
			width:100%;
			height:100%;
			background:rgba(0,0,0,0.6);
		}
		3d-view{
			position:absolute;
			width:80%;
			height:50%;
			padding:15px;
			background:#fff;
			left:50%;
			top:50%;
			transform:translate(-50%, -50%);
		}
		.full,nav{
			 z-index: 99999999999999;
		}
        .item-bike{
            text-align: center;
            font-weight: 900;

        }
        img{
            /*height: 250px;*/
            width: 100%;
        }
        img:hover{
            cursor: pointer;
            -webkit-box-shadow: -0px 18px 26px -25px  rgba(0,0,0,0.75);
            -moz-box-shadow: -0px 18px 26px -25px  rgba(0,0,0,0.75);
            box-shadow:-0px 18px 26px -25px  rgba(0,0,0,0.75);
        }
        .item-bike span{
            color: #ffe39d;
        }
        .row{
            padding: 10px 0px;
        }
        .home input[type=text] {
            width: 130px;
            box-sizing: border-box;
            border: 2px solid #ccc;
            border-radius: 4px;
            font-size: 16px;
            background-color: white;
            background-image: url('dist/images/searchicon.png');
            background-position: 10px 10px;
            background-repeat: no-repeat;
            padding: 12px 20px 12px 40px;
            -webkit-transition: width 0.4s ease-in-out;
            transition: width 0.4s ease-in-out;
            float: left;
        }

        .home  input[type=text]:focus {
            width: 100%;
        }
        .contact .contact-content{
            top: 35vh;
            position: absolute;
            width: 40vw;
            left: 50%;
            transform: translateX(-50%);
        }
        .contact .result{
            padding: 15px;
            margin: 0;
            text-align: center;
            font-size: 24px;
            color: #002182;
        }

        /* latin-ext */
        @font-face {
            font-family: 'Lato';
            font-style: normal;
            font-weight: 400;
            src: local('Lato Regular'), local('Lato-Regular'), url(http://fonts.gstatic.com/s/lato/v11/UyBMtLsHKBKXelqf4x7VRQ.woff2) format('woff2');
            unicode-range: U+0100-024F, U+1E00-1EFF, U+20A0-20AB, U+20AD-20CF, U+2C60-2C7F, U+A720-A7FF;
        }
        /* latin */
        @font-face {
            font-family: 'Lato';
            font-style: normal;
            font-weight: 400;
            src: local('Lato Regular'), local('Lato-Regular'), url(http://fonts.gstatic.com/s/lato/v11/1YwB1sO8YE1Lyjf12WNiUA.woff2) format('woff2');
            unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2212, U+2215, U+E0FF, U+EFFD, U+F000;
        }

        *, *:before, *:after{
            -webkit-box-sizing: border-box;
            -moz-box-sizing: border-box;
            box-sizing: border-box;
            padding: 0;
            margin: 0;
            font-family: 'Lato', sans-serif;
        }

        /*| Navigation |*/

        nav{
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            background: #fff;
            box-shadow: 0 3px 10px -2px rgba(0,0,0,.1);
            border: 1px solid rgba(0,0,0,.1);
           
        }
        nav ul{
            list-style: none;
            position: relative;
            float: right;
            /*margin-right: 100px;*/
            display: inline-table;
        }
        nav ul li{
            float: left;
            -webkit-transition: all .2s ease-in-out;
            -moz-transition: all .2s ease-in-out;
            transition: all .2s ease-in-out;
        }

        nav ul li:hover{background: rgba(0,0,0,.15);}
        nav ul li:hover > ul{display: block;}
        nav ul li{
            float: left;
            -webkit-transition: all .2s ease-in-out;
            -moz-transition: all .2s ease-in-out;
            transition: all .2s ease-in-out;
        }
        nav ul li a{
            display: block;
            padding: 30px 20px;
            color: #222;
            font-size: .9em;
            letter-spacing: 1px;
            text-decoration: none;
            text-transform: uppercase;
        }
        nav ul ul{
            display: none;
            background: #fff;
            position: absolute;
            top: 100%;
            box-shadow: -3px 3px 10px -2px rgba(0,0,0,.1);
            border: 1px solid rgba(0,0,0,.1);
        }
        nav ul ul li{float: none; position: relative;}
        nav ul ul li a {
            padding: 15px 30px;
            border-bottom: 1px solid rgba(0,0,0,.05);
        }
        nav ul ul ul {
            position: absolute;
            left: 100%;
            top:0;
        }
        ui-view{
            position: absolute;
            left: 50%;
            transform: translateX(-50%);
            padding-top: 25px;
        }
    </style>
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
