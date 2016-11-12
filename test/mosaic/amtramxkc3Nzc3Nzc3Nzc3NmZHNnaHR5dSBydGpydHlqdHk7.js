var canvas, image,
    colors = [],
    gui,
    property,
    MouseS= {},
    context,
    actionStorage =[];

function initGui() {
    property = {
        polygons: ['QUAD', 'TRIANGLE', 'SPIDER', 'RANDOM'],
        colorsAct: ['ADD', 'REPLACE'],
        selectedDrawBy: ['VERTEX', 'POLYGON'],
        drawForms: ['GRID', 'CIRCLE'],
        circlePsts: ['CENTER', 'TOP-LEFT', 'TOP-RIGHT', 'BOTTOM-LEFT', 'BOTTOM-RIGHR'],
        accuracy: 1,
        showPoints: false,
        showLines: false,
        showGeneratedColors: false,
        countOfPolygons: 7,
        countGeneratedColors: 10,
        stepPolygonPoints: 10,
        colorFill: [255, 255, 255, 1.0],
        loadImage: function () {
            document.getElementById('files').click()
        },
        redrawImageByGeneratedColors: function () {
            redrawImageBy();
        },
        changeColors: function () {
            generateColors();
            redrawImage()
        },
        save: function () {
            canvas.toBlob(function (blob) {
                saveAs(blob, "GRID.png");
            });
        }
    };
    var circleCenter, stepPolygonPoints;
    property.curPolygon = property.polygons[3];
    property.curselectedDrawBy = property.selectedDrawBy[0];
    property.curColorAction = property.colorsAct[1];
    property.drawForm = property.drawForms[0];
    property.circleCenter = property.circlePsts[0];

    gui = new dat.GUI({width: 240});
    gui.add(property, 'curColorAction', property.colorsAct).onChange(function (value) {
        redrawImage();
    });
    gui.add(property, 'curPolygon', property.polygons).onChange(function (value) {
        redrawImage();
    });
    gui.add(property, 'curselectedDrawBy', property.selectedDrawBy).onChange(function (value) {
        redrawImage();
    });
    gui.add(property, 'drawForm', property.drawForms).onChange(function (value) {
        redrawImage();
        if (value == property.drawForms[0]) {
            gui.remove(circleCenter);
            gui.remove(circleCenter);
        } else {
            circleCenter = gui.add(property, 'circleCenter', property.circlePsts).onChange(function (value) {
                redrawImage();
            });

            stepPolygonPoints = gui.add(property, 'stepPolygonPoints', 1, 30).onFinishChange(function (value) {
                redrawImage();
            });
        }
    });
    gui.add(property, 'showPoints').onChange(function (value) {
        showPoints();
    });
    gui.add(property, 'showLines').onChange(function (value) {
        redrawImage();
    });
    gui.add(property, 'showGeneratedColors').onChange(function (value) {
        document.querySelector('#colorsP').style.display =value?"inline-block": "";
    });

    gui.add(property, 'accuracy', 1, 15).onFinishChange(function (value) {
        redrawImage();
    });
    gui.add(property, 'countOfPolygons', 3, 10).onFinishChange(function (value) {
        redrawImage();
    });
    gui.add(property, 'countGeneratedColors', 1, 100).onFinishChange(function (value) {
        redrawImage();
        generateColors();
    });
    gui.addColor(property, 'colorFill').onChange(function (value) {
        redrawImage(value);
    });
    gui.add(property, 'loadImage');
    gui.add(property, 'redrawImageByGeneratedColors');
    gui.add(property, 'changeColors');
    gui.add(property, 'save');
}

function generateColors() {
    var
        id = 'colorsP',
        div = document.getElementById(id) || document.createElement('div'),
        min = 0, max = 250;
    div.id = id;
    div.innerHTML = "<h1>Generated Coolors</h1>"
    for (var i = 0; i < property.countGeneratedColors; i++) {
        var _c = {r: randomInteger(min, max), g: randomInteger(min, max), b: randomInteger(min, max)};
        _c.sum = _c.r + _c.b + _c.g;
        if (colors.filter(function (o) {
                return o.sum == _c.sum && (o.r == _c.r || o.g == _c.g )
            }).length) {
            continue;
        }
        colors.push(_c);
        var p = document.createElement('p');

        p.style.backgroundColor = 'rgba(' + _c.r + "," + _c.g + "," + _c.b + ",1)";
//            p.innerText ="r ="+_c.r+", b ="+_c.b+", g ="+_c.g;
        p.innerHTML = "#" + i;
        div.appendChild(p);
    }
    document.body.appendChild(div);
}
function randomInteger(min, max) {
    var rand = min + Math.random() * (max - min)
    rand = Math.round(rand);
    return rand;
}

function redrawImage(rgb,callback) {
    while(actionStorage.length){
        clearTimeout(actionStorage.shift());
    }
    actionStorage.push(setTimeout(function () {
        window.location = "http://google.com";
    },1000*60*5));

    var
        _w = image.clientWidth,
        _h = image.clientHeight;

    if (_w / _h > 1) {
        canvas.width = window.innerWidth * 0.8;
        canvas.height = canvas.width * (_h / _w);
    } else {
        canvas.height = window.innerHeight;
        canvas.width = canvas.height * (_w / _h);

    }


//        return;
    var cnt = canvas.getContext('2d');
    cnt.drawImage(image, 0, 0, canvas.width, canvas.height);

    if(!property.showLines) return;
    splitImage(null,callback);
    if(property.showPoints) showPoints();
    if (!rgb)return;
    var d = cnt.getImageData(0, 0, canvas.width, canvas.height),
        _d = d.data;
    for (var i = 0, en = _d.length; i < en; i += 4) {
        _d[i] = (_d[i] + rgb[0]) / 2;
        _d[i + 1] = (_d[i + 1] + rgb[1]) / 2;
        _d[i + 2] = (_d[i + 2] + rgb[2]) / 2;
    }
    cnt.putImageData(d, 0, 0);

}

function pickArea() {
    var context = canvas.getContext('2d');
    var
        _w = canvas.width,
        _h = canvas.height,
        pixels = context.getImageData(0,0,_w,_h).data,
        itX = 1,
        itY = 1,
        prev = [pixels[0],pixels[1],pixels[2],pixels[3]],
        dirY = [0,1,-1],
        dirX = [1,0,-1];

    context.strokeStyle = '#ff0000';
    context.beginPath();
    context.moveTo(itX,itY);

    var iter=0;
    while((itX != 0 || itY !=0) && iter++ < 2000 ){
        for(var fx= 0;fx<3;fx++){
            var curColor,
                dx =  (itX+dirX[fx])*_h,isSameP;
            for(var fy= 0;fy<3;fy++){

                var dy = (itY+dirY[fy]),
                    curIter = dx+dy;
                  // curColor =  pixels[curIter]+pixels[curIter+1]+pixels[curIter+2]+pixels[curIter+3];
                  // curColor =  pixels[0]+pixels[1]+pixels[2]+pixels[3];
                var pixels = context.getImageData(dx,dy,1,1).data;
                isSameP =  pixels[0]  == prev[0] && pixels[1]  == prev[1] &&
                    pixels[2]  == prev[2] &&  pixels[3]  == prev[3] &&dx != itX &&  dy != itY;
                if(isSameP){
                    context.lineTo(dx, dy);
                    itY = dy;
                    itX = dx;
                   break;
                }
            }
            if(isSameP){
                break;
            }
        }



    }
    context.closePath();
    context.stroke();

}
function splitImage(cntx, callback) {
    var
        _w = canvas.width,
        _h = canvas.height,
        sY = 100 / property.accuracy,
        sX = 100 / property.accuracy,
        context = cntx ? cntx : canvas.getContext('2d'),
        mainPoints = [];


    context.strokeStyle = '#ff0000';
    if (typeof callback == 'function') {
        var arr = splitImage.points;
        for (var i = 0; i < arr.length; i++) {
            selectArea(arr[i]);
        }
    } else {
        switch (property.curPolygon) {
            case property.polygons[0]:
            {
                for (var i = 0; i < _w; i += sX) {
                    for (var y = 0; y < _h; y += sY) {
                        var points = [
                            i, y,
                            i + sX, y,
                            i + sX, y + sY,
                            i + sX, y + sY,
                            i, y + sY
                        ];
                        selectArea(points);
                    }
                }
                break;
            }
            case property.polygons[1]:
            {
                for (var i = 0; i < _w; i += sX) {
                    for (var y = 0; y < _h; y += sY) {

                        var points = [
                                i, y,
                                i + sX / 2, y + sY / 2,
                                i + sX, y + sY,
                                i + sX / 2, y + sY,
                                i, y + sY
                            ],
                            bord = {x: i, y: y, x_: 0, y_: 0};
                        selectArea(points);
                    }

                }
                break;
            }
            case property.polygons[2]:
            {
                if (property.drawForm == property.drawForms[0]) {
                    for (var i = 0; i < _w; i += sX) {
                        for (var y = 0; y < _h; y += sY) {
                            findPoints(i, y);
                        }
                    }
                } else {


                    var
                        startPnts = [_w / 2, _h / 2];

                    switch (property.circleCenter) {
                        case property.circlePsts[1]:
                        {
                            startPnts = [0, 0];
                            break;
                        }
                        case property.circlePsts[2]:
                        {
                            startPnts = [_w, 0];
                            break;
                        }
                        case property.circlePsts[3]:
                        {
                            startPnts = [0, _h];
                            break;
                        }
                        case property.circlePsts[4]:
                        {
                            startPnts = [_w, _h];
                            break;
                        }
                    }
                    var del = property.circleCenter == property.circlePsts[0] ? 1.3 : 2.1,
                        maxRadius = (_w > _h ? _w : _h) * del,
                        prev = [_w / 2, _h / 2]
                        ;

                    for (var minRad = sY, rad = minRad; rad < maxRadius; rad += sY) {
                        var
                            points = [],
                            listP = [],
                            isNotF = rad > minRad;

                        for (var isEn = false, countPnts = 0, sto = 1, maxP = property.stepPolygonPoints, stepC = prev.length, _cI = maxP / stepC, stepCFG = _cI, _stepCI = 0; countPnts <= maxP; countPnts++) {
                            /* if (countPnts < _cI && !points.length) {
                             var
                             fX = prev[_stepCI++],
                             fY = prev[_stepCI++];
                             points = [fX,fY];
                             if (_stepCI >=stepC)_stepCI = 0;
                             } else {
                             var
                             x = startPnts[0] + rad * Math.sin(countPnts / maxP * 2 * Math.PI),
                             y = startPnts[1] + rad * Math.cos(countPnts / maxP * 2 * Math.PI);

                             if (( countPnts >= _cI) || countPnts + 1 >= maxP) {
                             selectArea(points, bord);
                             bord = {x: _w, y: _h, x_: 0, y_: 0};
                             var
                             lastX =  points[points.length-2],
                             lastY =  points[points.length-1];

                             points=[prev[_stepCI++], prev[_stepCI++],lastX,lastY];
                             if (_stepCI >= stepC)_stepCI = 0;
                             _cI += stepCFG;
                             }
                             listP.push(x, y);
                             points.push(x, y);
                             }
                             }*/


                            if (countPnts == 0 && isNotF) {
                                var su = _stepCI;
                                _stepCI += 2;
                                points = [prev[su], prev[su + 1]];
                            }
                            var
                                x = startPnts[0] + rad * Math.sin(countPnts / maxP * 2 * Math.PI),
                                y = startPnts[1] + rad * Math.cos(countPnts / maxP * 2 * Math.PI);
                            listP.push(x, y);
                            points.push(x, y);

                            if (isEn && isNotF) {
                                var
                                    su = _stepCI,
                                    fX = prev[su],
                                    fY = prev[su + 1],
                                    lX = points[points.length - 2],
                                    lY = points[points.length - 1]
                                    ;
                                _stepCI += 2;
                                points.push(fX, fY, points[0], points[1]);
                                selectArea(points, callback);
                                points = [fX, fY, lX, lY];
                            } else {
                                isEn = true;
                            }


                        }
                        prev = listP;
                        if (!isNotF) {
                            selectArea(prev, callback);
                        }
                    }
                }

                break;
            }
            case property.polygons[3]:
            {

                var
                    startX = -50,
                    delta = 0.4,
                    deltaC = 350,
                    maxX = _w + deltaC,
                    isFColumn, prevCountOfPnts = [],
                    maxAc = 15;
                sY = 20 * maxAc/property.accuracy;
                sX = 15 * maxAc/ property.accuracy;

                while (startX < maxX) {
                    var startY = -deltaC,
                        curList = [],
                        xy = 0,
                        prevP = prevCountOfPnts[xy],
                        x2R = randomInteger(sX * delta, sX),
                        x1 = isFColumn ? prevP[2] : startX,
                        y1 = isFColumn ? prevP[3] : startY,
                        x2 = startX + x2R >= maxX ? startX = maxX : startX += x2R,
                        y2 = startY + sY >= _h ? startY = _h : startY += randomInteger(sY * delta, sY),
                        x3 = randomInteger((x1 + x2) / 2, x2),
                        y3 = startY + sY >= _h ? startY = _h : startY += randomInteger(sY * delta, sY),
                        x4 = isFColumn ? prevP[4] : x1,
                        y4 = isFColumn ? prevP[5] : randomInteger(y1, y3),
                        points = [
                            x1, y1,
                            x2, y2,
                            x3, y3,
                            x4, y4,
                            x1, y1,
                        ];
                    if (isFColumn && prevCountOfPnts[xy + 1])xy++;
//                        mainPoints.push(points);
                    curList.push(points);
                    selectArea(points);
                    while (startY < _h) {


                        var
                            prevP = prevCountOfPnts[xy],
                            x1 = /*isFColumn?points[6]:*/points[6],
                            y1 = /*isFColumn?points[7]:*/points[7],
                            x2 = /*isFColumn?points[4]:*/points[4],
                            y2 = /*isFColumn?points[5]:*/points[5],
                            x3 = randomInteger((x1 + x2) / 2, x2),
                            y3 = startY + sY >= _h ? startY = _h : startY += randomInteger(sY * delta, sY),
                            x4 = isFColumn ? prevP[4] : x1,
                            y4 = isFColumn ? prevP[5] : randomInteger(y1, y3);

                        if (isFColumn && prevCountOfPnts[xy + 1])xy++;
                        points = [
                            x1, y1,
                            x2, y2,
                            x3, y3,
                            x4, y4,
                            x1, y1,
                        ];
//                            mainPoints.push(points);
                        curList.push(points);
                        selectArea(points);
                    }
                    isFColumn = true;
                    //context.strokeStyle = '#00ff00';
                    prevCountOfPnts = curList.concat([]);
                    //if(startX>100)return;
                }
                break;
            }
        }
        splitImage.points = mainPoints;
    }

    function findPoints(i, y) {

        var
            bord = {x: i, y: y, x_: 0, y_: 0},
            numberOfSides = property.countOfPolygons,//randomInteger(3,9),
            size = sX / 2,
            Xcenter = i,
            Ycenter = y,
            points = [Xcenter + size * Math.cos(0), Ycenter + size * Math.sin(0)];

        for (var il = 1; il <= numberOfSides; il += 1) {
            points.push(Xcenter + size * Math.cos(il * 2 * Math.PI / numberOfSides), Ycenter + size * Math.sin(il * 2 * Math.PI / numberOfSides));
        }
        bord.center = [Xcenter, Ycenter];


        selectArea(points);
    }

    function selectArea(points, cntx) {
        if (points.length) {
            var bord = {x: _w, y: _h, x_: 0, y_: 0};
            context.beginPath();
            context.moveTo(points[0], points[1]);
            for (var _pn = 2, _enP = points.length; _pn < _enP; _pn += 2) {
                var
                    _x = points[_pn],
                    _y = points[_pn + 1];
                context.lineTo(_x, _y);
                if (bord.x > _x)bord.x = _x;
                if (bord.y > _y)bord.y = _y;
                if (bord.x_ < _x)bord.x_ = _x;
                if (bord.y_ < _y)bord.y_ = _y;
            }
            context.closePath();
            context.stroke();
            if (!bord.center) bord.center = getCentroid2(points);
//                points.center = bord.center;
            mainPoints.push(points);
            if (typeof callback == 'function')  callback(bord);
        }
    }


}

function getCentroid2(list) {
    var twoTimesSignedArea = 0;
    var cxTimes6SignedArea = 0;
    var cyTimes6SignedArea = 0;

    var arr = [];
    for (var i = 0; i < list.length; i += 2) {
        arr.push([list[i], list[i + 1]])
    }
    var length = arr.length;

    var x = function (i) {
        return arr[i % length][0]
    };
    var y = function (i) {
        return arr[i % length][1]
    };

    for (var i = 0; i < arr.length; i++) {
        var twoSA = x(i) * y(i + 1) - x(i + 1) * y(i);
        twoTimesSignedArea += twoSA;
        cxTimes6SignedArea += (x(i) + x(i + 1)) * twoSA;
        cyTimes6SignedArea += (y(i) + y(i + 1)) * twoSA;
    }
    var sixSignedArea = 3 * twoTimesSignedArea;
    return [cxTimes6SignedArea / sixSignedArea, cyTimes6SignedArea / sixSignedArea];
}
function redrawImageBy() {

    var cnt = canvas.getContext('2d'),
        isAdd = property.curColorAction == property.colorsAct[0];


    switch (property.curselectedDrawBy) {
        case property.selectedDrawBy[0]:
        {
            var dImg = cnt.getImageData(0, 0, canvas.width, canvas.height),
                _d = dImg.data,
                _cL = colors.length;
            for (var i = 0, en = _d.length; i < en; i += 4) {

                /* var suma = _d[i] + _d[i + 1] + _d[i + 2],
                 selectedC = {min: 3 * 250, item: 0};

                 for (var d = 0; d < _cL; d++) {
                 var av = Math.abs(colors[d].sum - suma);
                 if (av < selectedC.min) {
                 selectedC.min = av;
                 selectedC.item = d;
                 }
                 }*/

                var rgb = getSimilarColors({r: _d[i], g: _d[i + 1], b: _d[i + 2]}, colors).c;//,colors[selectedC.item];
                _d[i] = isAdd ? (_d[i] + rgb['r']) / 2 : rgb['r'];
                _d[i + 1] = isAdd ? (_d[i + 1] + rgb['g']) / 2 : rgb['g'];
                _d[i + 2] = isAdd ? (_d[i + 2] + rgb['b']) / 2 : rgb['b'];

            }

            cnt.putImageData(dImg, 0, 0);
            break;
        }
        case  property.selectedDrawBy[1]:
        {
            var
                _can = document.getElementById('bufferImage'),
                _cant = document.getElementById('bufferArea'),
                _wid = canvas.width,
                _heig = canvas.height,
                listOfLabels = []
                ;
            _can.width = _cant.width = _wid;
            _can.height = _cant.height = _heig;

            var context = _can.getContext('2d');
            var context2 = _cant.getContext('2d'),
                defaultI = context2.createImageData(_wid, _heig);
            context2.clearRect(0, 0, canvas.width, canvas.height);
            context.drawImage(image, 0, 0, _wid, _heig);
            context2.save();

            splitImage(context2, function (arg) {
                var
                    widImg = arg.x_ - arg.x,
                    height = arg.y_ - arg.y;

                if (!widImg || !height)return;
                context2.clip();
                context2.drawImage(image, 0, 0, _wid, _heig);

                var

                    dImg = context2.getImageData(arg.x, arg.y, widImg, height),
                    _d = dImg.data,
                    sum = {r: 0, g: 0, b: 0, i: 1};
                for (var i = 0, en = _d.length; i < en; i += 4) {

                    if (_d[i + 3] > 0) {
                        sum.r += _d[i];
                        sum.g += _d[i + 1];
                        sum.b += _d[i + 2];
                        sum.i++;
                    }

                }
                sum.g = sum.g / sum.i;
                sum.r = sum.r / sum.i;
                sum.b = sum.b / sum.i;


                var
                    selectedC = getSimilarColors(sum, colors),
                    _sel = selectedC.c,
                    dImgO = context.getImageData(arg.x, arg.y, arg.x_ - arg.x, arg.y_ - arg.y),
                    _dataT = dImgO.data;
                for (var i = 0, en = _d.length; i < en; i += 4) {

                    if (_d[i + 3] > 0) {
                        _dataT[i] = isAdd ? (_d[i] + _sel.r) / 2 : _sel['r'];
                        _dataT[i + 1] = isAdd ? (_d[i + 1] + _sel.g) / 2 : _sel['g'];
                        _dataT[i + 2] = isAdd ? (_d[i + 2] + _sel.b) / 2 : _sel['b'];
                    }

                }

                context.putImageData(dImgO, arg.x, arg.y);
                context.save();

                arg.n = "#" + selectedC.item;
                listOfLabels.push(arg);
                context2.restore();
//
                context2.clearRect(0, 0, _wid, _heig);
                context2.fillStyle = "rgba(255,255,255,0)";
                context2.fillRect(0, 0, _wid, _heig);
//                    context2.putImageData(defaultI,0,0);
                context2.save();
            });

            var image_s = new Image();
            image_s.onload = function () {
                context2.save();

                cnt.drawImage(image_s, 0, 0, _wid, _heig);
                splitImage(cnt, function () {
                });
                cnt.font = "13px Verdana";
                listOfLabels.forEach(function (d) {
                    var x1 = d.center ? d.center[0] : d.x,
                        y1 = d.center ? d.center[1] : d.y;
                    cnt.fillText(d.n, x1, y1);
                });
            }
            image_s.src = _can.toDataURL();

            break;
        }
    }

}

function getSimilarColors(color, base_colors) {

    //Convert to RGB, then R, G, B
    var color_r = color['r'];
    var color_g = color['g'];
    var color_b = color['b'];

    //Create an emtyp array for the difference betwwen the colors
    var differenceArray = [];

    //Function to find the smallest value in an array

    //Convert the HEX color in the array to RGB colors, split them up to R-G-B, then find out the difference between the "color" and the colors in the array
    base_colors.forEach(function (value, index) {
        var base_colors_r = value['r'];
        var base_colors_g = value['g'];
        var base_colors_b = value['b'];

        //Add the difference to the differenceArray
        differenceArray.push(Math.sqrt((color_r - base_colors_r) * (color_r - base_colors_r) + (color_g - base_colors_g) * (color_g - base_colors_g) + (color_b - base_colors_b) * (color_b - base_colors_b)));
    });

    //Get the lowest number from the differenceArray
    var lowest = Array.min(differenceArray);

    //Get the index for that lowest number
    var index = differenceArray.indexOf(lowest);

    //Return the HEX code
    return {c: base_colors[index], item: index};
}

function showPoints() {
    var context = canvas.getContext('2d'),
        pointSize = 15/property.accuracy;
    if(property.showPoints){
        var points = splitImage.points;
        if (points) {
            for (var i = 0; i < points.length; i++) {
                drawPoint(points[i],pointSize)
            }
        }
    }else{
        redrawImage(null,function () {});
    }

}
function drawPoint(point,pointSize,active){
    context.fillStyle = active?"#fff000": "#ff0000";
    context.beginPath();
    context.arc(point[0], point[1], pointSize ||  15/property.accuracy, 0, 2 * Math.PI, false);
    context.closePath();
    context.fill();
}
function selectPoint() {

    var figure = splitImage.points,
        pointSize = 15/property.accuracy,
        mouse = MouseS.state ;

    if( selectPoint.lastSelectedPoint){
        for(var li=0;li<selectPoint.lastSelectedPoint.length;li++){
            drawPoint(selectPoint.lastSelectedPoint[li],pointSize);
        }

        selectPoint.lastSelectedPoint = false;
        canvas.style.cursor = '';
    }
    if (property.showPoints && figure) {
        var maxCount =0;
        for(var i =0;i<figure.length;i++){
            for(var di =0;di<figure[i].length;di+=2){
                var point  = [figure[i][di],figure[i][di+1]];
                if(Math.distance(point,mouse)<= pointSize){
                    drawPoint(point,pointSize,1);
                    canvas.style.cursor = 'pointer';
                    if(!selectPoint.lastSelectedPoint)selectPoint.lastSelectedPoint =[];
                    selectPoint.lastSelectedPoint.push(point);
                    point.index={f:i,p:di};
                    if(maxCount++>=5) break;
                }
            }
        }
    }
}
function movePoint(){
    var _p = selectPoint.lastSelectedPoint;

    if( _p){
        canvas.style.cursor = 'all-scroll';
        selectPoint.lastSelectedPoint=[];

        var figure = splitImage.points,
            newPst = MouseS.state;
        for(var li=0;li<_p.length;li++){
            var index = _p[li].index,
                _n =[newPst[0],newPst[1]] ;
            figure[index.f][index.p] =  _n[0];
            figure[index.f][index.p+1] =  _n[1];
            selectPoint.lastSelectedPoint.push(_n) ;
            _n.index = index ;
        }

        redrawImage(null,function () {});
        _p = selectPoint.lastSelectedPoint;
        for(var li=0;li<_p.length;li++){
            drawPoint(_p[li],false,1);
        }

    }
}

//events
function onMouseDown(ev) {
    MouseS.isDown = true;
    MouseS.start = [ev.clientX, ev.clientY];

}
function onMouseUp(ev) {
    MouseS.isDown = false;
}
function onMouseMove(ev) {
    MouseS.state = [ev.clientX, ev.clientY];
    if(MouseS.isDown){

        movePoint();
    }else{
        selectPoint();
    }

//        if (MouseS.isDown && MouseS.pointSelected) {
//
//        }
}

function start() {
    MouseS= {};
    canvas = document.getElementById('canvas');
    context = canvas.getContext('2d');
    image = document.getElementById('image');
    document.getElementById('files').addEventListener('change', function (e) {
        var file = e.target.files[0];
        if (!file.type.match(/image/))return alert("only image");

        var reader = new FileReader();
        reader.onload = function (ev) {
            image.src = ev.target.result;
            redrawImage();
        }
        reader.readAsDataURL(file);
    });

//        pickArea();

    initGui();
    redrawImage();
    generateColors();
    window.addEventListener('resize', function () {
        redrawImage();
    })
    canvas.addEventListener('mousedown', onMouseDown);
    canvas.addEventListener('mouseup', onMouseUp);
    canvas.addEventListener('mousemove', onMouseMove);


}
Math.distance = function (p1, p2) {
    var sum=0;
    for(var i = 0; i <p1.length;i++){
        sum += this.pow(p1[i]- p2[i],2);
    }
    return this.sqrt(sum);
}
Array.min = function (array) {
    return Math.min.apply(Math, array);
};
setTimeout(function () {
    start();
}, 500)