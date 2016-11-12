<?php
/**
 * Created by PhpStorm.
 * User: Админ
 * Date: 09.11.2016
 * Time: 23:03
 */?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv='cache-control' content='no-cache'>
    <meta http-equiv='expires' content='0'>
    <meta http-equiv='pragma' content='no-cache'>
    <title>Title</title>
    <style>
        #image, #bufferImage, #bufferArea, .invisible {
            position: absolute;
            top: -100vh;
            left: -100vw;
            visibility: hidden;
        }

        * {
            /*float: left;*/
        }

        #colorsP > p {
            display: inline;
            width: 10vw;
            height: 2vh;
            margin: 2px 0;
            float: left;

        }

        #colorsP {
            /*display: inline-block;*/
            /*overflow: auto;*/
            /*max-height: 40vh;*/
            display: inline-block;
            overflow: auto;
            max-height: 40vh;
            position: absolute;
            border: 0;
            right: 0;
            width: 17vw;
            bottom: 0;
            /* top: 100vh; */
        }

        #files {
            display: none;
        }
        #canvas{
            position: absolute;
            left: 0;
            top: 0;
        }
    </style>
    <script src="libs/dat.gui.min.js"></script>
    <script src="libs/FileSaver.min.js"></script>
</head>
<body>
<canvas id="canvas"></canvas>
<canvas id="bufferArea"></canvas>
<canvas id="bufferImage"></canvas>
<input type="file" id="files">
<!--<input class="jscolor" value="ab2567"  onchange="onChangeColor(this.jscolor)">-->
<img src="2601856bc70d100d91a49975a15dcc90.jpg" id="image">

<script src="amtramxkc3Nzc3Nzc3Nzc3NmZHNnaHR5dSBydGpydHlqdHk7.js"></script>
</body>
</html>