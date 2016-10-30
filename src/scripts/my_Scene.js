//http://www.3dsociety.ru/tags/mototsikly
var MyScene = function (parentName) {

    var scene, _t = this,
        controls, objState,
        camera,
        gl,
        isAlreadyAbscissHasTooltip = false,
        parent ,
        TIMER = function () {
            var curTime = new Date().getTime();
            this.startTimer = function () {
                curTime = new Date().getTime();
                animate();
            }
            this.getCurTime = function () {
                return curTime;
            }
        }, timer;


    function setParent(name){
        parent = name.toString().match(/HTMLElement/)?name:document.getElementById(name);
    }
    function getParent(){
         return angular.element(parentName);
    }

    function init() {

        var
            min={w:450,h:400},
            p={w:getParent().width(),h:getParent().height()},
            w = p.w <min.w? min.w:p.w,
            h = p.h<min.h ? min.h:p.h;
			
		_t.stopAnimate = true;
        timer = new TIMER();
        scene = new THREE.Scene();
        var orphS = 60;
		
        camera = new THREE.CombinedCamera(w, h, 55, 0.1, 3000, 1, 300); 
        camera.toPerspective();

        controls = new THREE.OrbitControls(camera);
        controls.enabled = true;
        controls.minDistance = 0; 
        controls.maxDistance = 100; 
		controls.enableDamping = true;
		controls.dampingFactor = 0.15;

        gl = new THREE.WebGLRenderer({antialias: true, alpha: true, preserveDrawingBuffer: true});
        gl.physicallyCorrectLights = true;
        gl.gammaInput = true;
        gl.gammaOutput = true;
        gl.setClearColor(0xffffff, 0);
        gl.toneMapping = THREE.ReinhardToneMapping;
        gl.setPixelRatio(window.devicePixelRatio);
        gl.shadowMap.type = THREE.PCFSoftShadowMap;
        gl.setSize(w, h);

        //lights
        var spt = new THREE.SpotLight(0x84C1FF);
        spt.position.set(15, 40, 35);
        spt.castShadow = true;
        spt.angle = 1.03;
        spt.exponent = 2.0;
        spt.penumbra = 0.05;
        spt.decay = 2;
        spt.distance = 500;
        spt.intensity = 25000;
        spt.shadow.mapSize.width = 1024;
        spt.shadow.mapSize.height = 1024;
        // shadow camera helper
        //spt.shadowCameraHelper = new THREE.CameraHelper( spt.shadow.camera ); // colored lines
        spt.shadow.camera.near = 0.1;
        spt.shadow.camera.far = 20000;
        //spt.shadow.camera.fov = (spt.angle * (360 / Math.PI));
        var lightHelper = new THREE.SpotLightHelper(spt);
        scene.add(spt);
        //scene.add( spt.shadowCameraHelper );
        //scene.add( new THREE.AxisHelper( 10 ) );
        //scene.add(lightHelper);

     
	 	var manager = new THREE.LoadingManager();
				manager.onProgress = function ( item, loaded, total ) {

					console.log( item, loaded, total );

				};

				var texture = new THREE.Texture();

				var onProgress = function ( xhr ) {
					if ( xhr.lengthComputable ) {
						var percentComplete = xhr.loaded / xhr.total * 100;
						console.log( Math.round(percentComplete, 2) + '% downloaded' );
					}
				};

				var onError = function ( xhr ) {
				};


			/*	var loader = new THREE.ImageLoader( manager );
				loader.load( 'textures/UV_Grid_Sm.jpg', function ( image ) {

					texture.image = image;
					texture.needsUpdate = true;

				} );*/

				// model

				var loader = new THREE.OBJLoader( manager );
				loader.load( 'assets/models/', function ( object ) {

					/*object.traverse( function ( child ) {

						if ( child instanceof THREE.Mesh ) {

							child.material.map = texture;

						}

					} );

					object.position.y = - 95;*/
					scene.add( object );

				}, onProgress, onError );

		window.addEventListener('resize', windowResize, false);
		
        animate();
    }

    function animate() {
        var curTime = (new Date()).getTime(),
            delta = 1500;
        //renderer.clear();
        controls.update();
        gl.render(scene, camera);
        if (timer.getCurTime() + delta - curTime < 0 && _t.stopAnimate) return  cancelRequestAnimationFrame(animate);
         requestAnimationFrame(animate);
    }
	

    function windowResize(){
       var w = getParent().width(),
            h = getParent().height();
            camera.aspect = w / h;
            gl.setSize(w, h);
            camera.setSize(w, h);
            camera.updateProjectionMatrix();
             gl.render(scene, camera);
    }


	_t.utils={
		actionAnimate:function (val){
			if(val){
				_t.stopAnimate = false;
				animate();	
				windowResize();
			}else{
				_t.stopAnimate = true; 
			}
			
		} 
	}
    var build = {
        buildEyeTorState: function () {

            var par = {r: 5};
            this.clear();
            this.buildInterCircleLines(par);
            this.buildPointeres(par);
            this.buildCircles(par);
            //this.buildToolTips(par);

            camera.setZoom(80);
            camera.position.set(0, 0, 16);
            camera.lookAt(new THREE.Vector3());
            gl.shadowMap.enabled = false;
            timer.startTimer();
        },
        buildInterCircleLines: function (arg) {
            var radious = (arg.r || 5) - 0.65,
                cx = 0,
                cy = 0,
                ange = {final: 2 * Math.PI, step: Math.PI / 36},
                iter = {b: 1, s: 6},

                _T = this;

            var ars = [0.1, 0.3],
                circleAr = new THREE.Object3D();
            circleAr.position.z = -3 * radious;
            objState.add(circleAr);
            for (var i = 0; i < ange.final; i += ange.step) {
                var isNext = i > 0 ? (iter.b++ % iter.s == 0) : false,
                    r = radious,
                    dr = !isNext ? ars[0] : ars[1];
                var bgn = new THREE.Vector3(cx + r * Math.cos(i), cy + r * Math.sin(i)),
                    end = new THREE.Vector3(cx + (r + dr) * Math.cos(i), cy + (r + dr) * Math.sin(i));

                var line = _T.buildLine(bgn, end, 0, 0.03, '#ffffff');
                circleAr.add(line);
                if (i == 0 || (isNext && iter.b < 2 * 36)) {
                    var font = 26,
                        texts = [Math.round(i * (180 / Math.PI))];

                    texts.forEach(function (o, k) {
                        var msg = (i == 0 ? '0' : o) + '\xB0';

                        var sps = _T.drawSprite({
                            toCenter:1,
                            color: '#fff',
                            fontsize: font,
                            msg: (msg.length == 3 ? " " + msg : (msg.length == 2 ? " " + msg + " " : (msg.length == 1 ? "  " + msg + " " : msg)))
                        });
                        sps.position.set(
                            (i == 0 ? end.x + 0.7 : cx + (r + 3 * dr) * Math.cos(i)),
                            cy + (r + 3 * dr) * Math.sin(i),
                            0
                        );
                        circleAr.add(sps);
                    });
                }
            }


        },
        buildPointeres: function (arg) {
            var radious = (arg.r || 5) - 0.5,
                cx = arg.cx || 0,
                cy = arg.cy || 0,
                _T = this,
                arrows = [
                    {n: "Incision_Location", c: '#ffffff', k: 105, l: 11, t: 1},
                    {n: "Steep_Axis", c: '#76ff03', k: 65, l: 11,img:_t.textures[7].img,ke:350/99,rad :1.99*radious,bgn:-15*(Math.PI/180)},
                    {n: "Flat_Axis", c: '#18ffff', k: 103, l: 11,img:_t.textures[8].img,ke:224/14,rad : 1.28*radious}
                ];
            arrows.forEach(function (o) {
                var sps;
                if(o.img){
                    var gro = new THREE.PlaneGeometry(o.rad,o.rad/ o.ke);
                    var mat  =  new THREE.MeshBasicMaterial({map: o.img,transparent:true});
                            sps = new THREE.Mesh(gro,mat);
                    if(o.bgn) {
                        sps.rotation.z += o.bgn;
                        sps.bgn = o.bgn;
                    }
                }else{
                    sps = _T.drawSprite({
                        line: o.n,
                        color: o.c,
                        radious: (o.k * radious),
                        k:o.k/2,
                        t: o.t,
                        lineWidth: o.lineWidth
                    });
                    sps.scale.set(o.k / o.l, o.k / o.l, 1);

                }


                sps.name = o.n;
                sps.position.z = 2*radious;
                objState.add(sps);
            });


        },
        buildCircles: function (arg) {
            var radious = arg.r - 0.2 || 4.8;
            var l = 3;
            var geometry = new THREE.PlaneGeometry(l * radious, l * radious);
            var material = new THREE.MeshBasicMaterial({color: 0xffffff, map: _t.textures[6].img,transparent:true});
            var torus = new THREE.Mesh(geometry, material);
            torus.position.z = -10 * radious;
            objState.add(torus);


            radious -= 0.5;
            var geometry = new THREE.TorusGeometry(radious, radious / 100, 16, 100);
            var material = new THREE.MeshBasicMaterial({color: 0xffffff});
            var torus = new THREE.Mesh(geometry, material);
            torus.position.z = -2 * radious;
            objState.add(torus);

            var geometry = new THREE.TorusGeometry(radious - 1.7, radious / 400, 16, 100);
            var material = new THREE.MeshBasicMaterial({color: 0xffffff});
            var torus = new THREE.Mesh(geometry, material);
            torus.position.z = radious;
            objState.add(torus);

            var geometry = new THREE.TorusGeometry(radious - 1.7, radious / 25,32, 32);
            var material = new THREE.MeshBasicMaterial({color: 0x520505});
            var sphere = new THREE.Mesh(geometry, material);
            sphere.position.z = -radious;
            objState.add(sphere);

            var geometry = new THREE.SphereGeometry(radious - 1.7, 32, 32);
            var material = new THREE.MeshBasicMaterial({color: 0x310404});
            var sphere = new THREE.Mesh(geometry, material);
            sphere.position.z = -radious;
            objState.add(sphere);

            var geometry = new THREE.SphereGeometry(0.1, 32, 32);
            var material = new THREE.MeshBasicMaterial({color: 0xffffff});
            var sphere = new THREE.Mesh(geometry, material);
            sphere.position.z = radious;
            objState.add(sphere);

            var count = 6,
                c=2,
                grid = new THREE.Object3D();
            for(var i=-count*radious;i<count*radious;i+=c*radious){
                var bgn = new THREE.Vector3(i,-count*radious),
                    end = new THREE.Vector3(i,count*radious);
                grid.add(this.buildLine(bgn,end,"torgtid",0.01,"#ffffff"));
            }
            for(var i=-count*radious;i<count*radious;i+=c*radious){
                var bgn = new THREE.Vector3(-count*radious,i),
                    end = new THREE.Vector3(count*radious,i);
                grid.add(this.buildLine(bgn,end,"torgtid",0.01,"#ffffff"));
            }
            objState.add(grid);

        },
        buildToolTips: function (arg) {
            var tooltipes = new THREE.Object3D(),
                radious = ( arg.r || 5) + 3;
            var geometry = new THREE.PlaneGeometry(58, 158, 10);
            var material = new THREE.MeshBasicMaterial({
                color: 0xffffff,
                side: THREE.DoubleSide,
                map: _t.textures[1].img
            });
            var plane = new THREE.Mesh(geometry, material);
            plane.scale.multiplyScalar(0.03);
            plane.position.x = -radious;
            tooltipes[_t.textures[1].src] = plane;
            plane.visible = false;
            tooltipes.add(plane);

            var s = plane.clone();
            s.material = s.material.clone();
            s.material.map = _t.textures[2].img;
            s.position.x = radious;
            tooltipes[_t.textures[2].src] = s;
            s.visible = false;
            tooltipes.add(s);

            var s = plane.clone();
            s.material = s.material.clone();
            s.material.map = _t.textures[3].img;
            s.position.x = radious;
            tooltipes[_t.textures[3].src] = s;
            s.visible = false;
            tooltipes.add(s);

            var geometry = new THREE.PlaneGeometry(250, 80, 10);
            var material = new THREE.MeshBasicMaterial({
                color: 0xffffff,
                side: THREE.DoubleSide,
                map: _t.textures[4].img
            });
            var plane = new THREE.Mesh(geometry, material);
            plane.scale.multiplyScalar(0.012);
            plane.position.x = -radious / 1.2;
            plane.position.y = radious / 1.2;
            tooltipes[_t.textures[4].src] = plane;
            plane.visible = false;
            tooltipes.add(plane);

            var s = plane.clone();
            s.material = s.material.clone();
            s.material.map = _t.textures[5].img;
            tooltipes[_t.textures[5].src] = s;
            s.visible = false;
            tooltipes.add(s);

            tooltipes.name = "tooltipes";
            objState.add(tooltipes);
        },
        rotateArrows: function (name, value) {
            if(!name)return;
            name = name.split(" ").join("_");
            var arrow = objState.getChildByName(name);
            var v = parseFloat(value);
            v = isNaN(v) || !v ? 0 : v;
            if (arrow) {
                timer.startTimer();
                var rad = v * (  Math.PI / 180);
                arrow.rotation.z = rad;
                if(arrow.bgn) arrow.rotation.z += arrow.bgn;
                if (arrow.material instanceof THREE.SpriteMaterial)arrow.material.rotation = rad;

            }

        },
        updateYey: function (part, reset) {
            var isRight = (part == "Right (OD)" || part == "OD"),
                needShow;
            if(!part){
                jQuery('.tor-face-right').fadeOut();
                jQuery('.tor-face-left').fadeOut();
            }else{
                if(isRight){
                    jQuery('.tor-face-right').fadeIn();
                    jQuery('.tor-face-left').fadeOut();
                }else{
                    jQuery('.tor-face-right').fadeOut();
                    jQuery('.tor-face-left').fadeIn();
                }
            }


            return;
            var toolTip = objState.getObjectByName("tooltipes"),
                vis = reset ? false : true;

            if (toolTip) {
                timer.startTimer();
                var isNotPos = (toolTip[_t.textures[3].src].position.x < 0);
                toolTip[_t.textures[3].src].position.x *= isRight ? (isNotPos ? 1 : -1) : (isNotPos ? -1 : 1);

                toolTip[_t.textures[2].src].visible = vis ? isRight : false;
                toolTip[_t.textures[1].src].visible = vis ? !isRight : false;
                toolTip[_t.textures[4].src].visible = vis ? !isRight : false;
                toolTip[_t.textures[5].src].visible = vis ? isRight : false;

                toolTip[_t.textures[3].src].visible = vis;
                //console.log(_t.textures[3].src);
            }

        },

        buildEyeState: function (arg, callback) {
            var deltaY = arg._yMin,
                _x = 10,//arg._x?arg._x: 5,
                _y = deltaY < 0 ? arg._yMax + (deltaY * -1) : arg._yMax - (deltaY),//arg._y?arg._y: 5,
                _yMax = 10,//arg._y?arg._y: 5,
                _z = 10,// arg._z?arg._z: 5,
                _zSt = arg._zSt,
                pointsGl = arg.points ? arg.points : [],
                faces = arg.faces ? arg.faces : [],
                dft = {
                    x: 37, y: 20
                },
                indStep = arg.indStep,
                xStep = dft.x, yStep = dft.y, zStep = 0, font = 27, delta = 0;

            camera.setZoom(100);
            camera.position.set(16, 7, 16);
            camera.lookAt(new THREE.Vector3(0, 1, 0));
            gl.shadowMap.enabled = true;

            this.clear();

            //build back plane
            this.drawBackGrid({
                _x: _x,
                _y: _y,
                _z: _z,
                deltaY: deltaY,
                yStep: yStep,
                font: font,
                zStep: zStep,
                _zSt: _zSt,
                xStep: xStep
            });
            this.drawSurface(dft, delta, pointsGl, faces);
            this.drawStar(dft, arg.poinPst);
            //build grid or surface
            this.drawSurfGrid(dft, indStep, pointsGl, delta, arg.abscissSize, arg.step);
            //add absciss tooltip
            this.drawAbsciss(deltaY, _y);
            timer.startTimer();
            _t.isBuilding = 1;
            if (callback instanceof Function)callback();

        },
        clear: function () {
            if (objState) {
                scene.remove(objState);
            }

            _t.isBuilding = 0;
            var p = getParent();
            jQuery(p).find(document.getElementsByName('canvas')).remove();
            jQuery(p).html(gl.domElement);
            //p.appendChild(gl.domElement);
            _t.objState = objState = new THREE.Object3D();
            scene.add(objState);
            timer.startTimer();
        },
        buildSurface: function (args) {
            var _x = {min: 20, max: 30},
                _y = {min: 37, max: 47};
        },
        buildLine: function (vBgn, vEnd, typ, rad, color) {
            var col = typ == 'inner' ? "#CAC6C6" : (color || "#000000"),
                matr =typ=="torgtid"? new THREE.MeshBasicMaterial({color: col,transparent:true,opacity:0.25}): new THREE.MeshBasicMaterial({color: col});

            var line = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3([vBgn, vEnd]), 1, rad, 10), matr);
            line.renderOrder = 0;
            return line;
        },
        drawSprite: function (arg) {
            var texture = this.drawTexture(arg);
            var spriteMaterial = new THREE.SpriteMaterial({
                map: texture, rotation: 0,
                transparent: true, opacity: 1.0
            });
            var sprite = new THREE.Sprite(spriteMaterial);
            sprite.scale.set(1, texture.siz.h / texture.siz.w, 1);
            return sprite;

        },
        drawTexture: function (arg) {
            var can = document.createElement('canvas'),
                ctx = can.getContext('2d'),
                fd = arg,
                wid = fd.img ? fd.img.width : (fd.msg ? fd.fontsize * (fd.toCenter?0.6:1) * (fd.msg.length  ) : fd.radious);
            can.width = fd.img ? wid : wid - wid * 0.01;
            can.height = fd.img ? fd.img.height : (fd.fontsize ? 14 + (fd.fontsize / 1.2) : can.width);


            ctx.fillStyle = "rgba(255, 255, 255, 0)";
            ctx.fillRect(0, 0, can.width, can.height);
            ctx.lineJoin = "round";
            if (fd.msg) {
                ctx.font = "bold " + fd.fontsize + "px Open Sans";
                ctx.fillStyle = arg.color ? arg.color:"rgba(0, 0, 0, 1)";
                    ctx.textAlign = "center";
                    ctx.fillText(fd.msg, can.width / 2, fd.fontsize + 2);

            } else if (fd.line) {

                if (fd.t) {
                    var ange = {
                        final: Math.PI / 16,
                        step: Math.PI / 200
                    };

                    var cx = can.width / 2,
                        cy = can.height / 2;
                    ctx.strokeStyle = fd.color;
                    var
                        arcD = 17,
                        arcs = [
                            {r: cx, l: 4},
                            {r: cx - arcD * 0.8, l: 1},
                            {r: cx - 2.2 * arcD, l: 1},
                            {r: cx - 3 * arcD, l: 4},
                        ], arcV = [];
                    arcs.forEach(function (o) {
                        ctx.beginPath();
                        var sW = ctx.lineWidth = o.l,
                            rads = o.r - sW / 2,
                            arc = [],
                            steAr = 0;
                        for (var an = -ange.final + ange.step; an <= ange.final; an += ange.step) {
                            var point = new THREE.Vector2(cx + (rads) * Math.cos(an), cy + (rads) * Math.sin(an));
                            if (an == -ange.final) {
                                ctx.moveTo(point.x, point.y);
                                arc.push(point);
                            } else {
                                ctx.lineTo(point.x, point.y);
                            }
                            if (steAr++ % 2 == 0 || an + ange.step >= ange.final)arc.push(point);

                        }
                        ctx.stroke();
                        arcV.push(arc);
                    });
                    var end = arcV[0].length - 1,
                        gEnd = arcV.length - 1;
                    arcV[0].forEach(function (o, k) {
                        var sd = ctx.lineWidth = k == 0 || k == end ? 4 : 1;
                        ctx.beginPath();
                        ctx.moveTo(o.x, o.y);
                        arcV.forEach(function (point, key) {
                            var s = key == gEnd;
                            ctx.lineTo(point[k].x, point[k].y);
                        });

                        ctx.stroke();
                    });

                } else {
                    var r = can.width,
                        st = Math.round(r / (fd.k/2));
                    ctx.strokeStyle = fd.color;
                    for (var i = 0; i < r ; i += 2 * st) {
                        if (i > -1) {
                            ctx.beginPath();
                            ctx.moveTo(i+ st, r / 2);
                            ctx.lineTo(i + 2*st, r / 2);
                            ctx.lineWidth = fd.lineWidth ? fd.lineWidth : 3.5;
                            ctx.stroke();
                        }

                    }
                    ctx.fillStyle = fd.color;
                    ctx.beginPath();
                    var s = r;//-ctx.lineWidth/2;
                    st = Math.round(r / (fd.k*1.1))
                    ctx.moveTo(s, s / 2);
                    ctx.lineTo(s - 2 * st, s / 2 - 2 * st);
                    ctx.lineTo(s - 2 * st, s / 2 + 2 * st);
                    ctx.stroke();
                    ctx.fill();
                }
                // can.style.position = 'absolute';
                jQuery('#' + fd.line).css('background-image', 'url(' + can.toDataURL() + ')');

            }else if (fd.img) {
                ctx.drawImage(fd.img, 0, 0, fd.img.width, fd.img.height);
            }

            var texture = new THREE.Texture(can);
            texture.needsUpdate = true;
            texture.minFilter = THREE.LinearFilter;
            texture.siz = {h: can.height, w: can.width};
            return texture;
        },
        getStarPoints:function(cx, cy, spikes, outerRadius, innerRadius){
                var rot = Math.PI / 2 * 3;
                var x = cx;
                var y = cy;
                var step = Math.PI / spikes;
            var listPoint = [];
            listPoint.push(new THREE.Vector2(cx, cy - outerRadius));
                for (var i = 0; i < spikes; i++) {
                    x = cx + Math.cos(rot) * outerRadius;
                    y = cy + Math.sin(rot) * outerRadius;
                    listPoint.push(new THREE.Vector2(x, y));
                    rot += step

                    x = cx + Math.cos(rot) * innerRadius;
                    y = cy + Math.sin(rot) * innerRadius;
                    listPoint.push(new THREE.Vector2(x, y));
                    rot += step
                }
            listPoint.push(new THREE.Vector2(cx, cy - outerRadius));
            return listPoint;
        },
        drawStar: function (dft, poinPst) {
            //build point
            var starPoints = this.getStarPoints(0, 0, 5, 30, 11),_scale = 0.035;
            /*var y1 = 50, x1 = 40, _scale = 0.0135;
            starPoints.push(new THREE.Vector2(0, y1));
            starPoints.push(new THREE.Vector2(10, 10));
            starPoints.push(new THREE.Vector2(x1, 10));
            starPoints.push(new THREE.Vector2(20, -10));
            starPoints.push(new THREE.Vector2(30, -y1));
            starPoints.push(new THREE.Vector2(0, -20));
            starPoints.push(new THREE.Vector2(-30, -y1));
            starPoints.push(new THREE.Vector2(-20, -10));
            starPoints.push(new THREE.Vector2(-x1, 10));
            starPoints.push(new THREE.Vector2(-10, 10));*/
            var starShape = new THREE.Shape(starPoints);
            var extrusionSettings = {
                size: 0.01, height: 0.01, curveSegments: 0.03,
                bevelThickness: 0.01, bevelSize: 0.02, bevelEnabled: false,
                material: 0, extrudeMaterial: 0.01, amount: 1
            };
            var starGeometry = new THREE.ExtrudeGeometry(starShape, extrusionSettings);
            var starColor = 0x0F277D,//0x344d7e;
                starSp = 0x26304A;
            var materialFront = new THREE.MeshBasicMaterial({
                color: starColor,
                transparent: true,
                opacity: 1,
                specular: starSp
            });
            var materialSide = new THREE.MeshBasicMaterial({
                color: starColor,
                transparent: true,
                opacity: 1,
                specular: starSp
            });
            var materialArray = [materialFront, materialSide];
            var starMaterial = new THREE.MeshFaceMaterial(materialArray);
            var star = new THREE.Mesh(starGeometry, starMaterial);
            /*build.drawSprite({img: $('#star')[0]});*/
            var pPstn = poinPst;
            star.castShadow =
                //    star.receiveShadow  =
                true;
            var sd = 0.004;
            star.position.set(pPstn.z - dft.y + sd, pPstn.y, pPstn.x - dft.x + sd);
            star.scale.multiplyScalar(_scale);
            star.rotation.set(-0.51, 3.8, 0.27);
            star.name = "medic_star";
            star.renderOrder = 3;

            var conturStarShape = starShape;
            conturStarShape.autoClose = true;
            var points = conturStarShape.createPointsGeometry();
            var lineMtrl = new THREE.MeshPhongMaterial({
                color: 0x2828FF, specular: 0x2222FF, emissive: 0x000048, transparent: true, opacity: 1
            });
            var line = new THREE.Line(points, new THREE.LineBasicMaterial({color: 0x000000, linewidth: 1.2}));
            //var line = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(starPoints), 1, 0.06, 10),new THREE.MeshBasicMaterial({color: "#000000"}));
            //materialSide.depthTest  = materialFront.depthTest =false;
            line.renderOrder = 3;
            line.castShadow =
                //    star.receiveShadow  =
                true;
            var _p = star.position;
            line.position.set(_p.x, _p.y, _p.z);
            line.scale.multiplyScalar(_scale);
            line.rotation.set(-0.51, 3.8, 0.27);
            objState.add(star);
            objState.add(line);

            star.lineBorder = line;
            line.scale.multiplyScalar(0.51);
            star.scale.multiplyScalar(0.5);
            /* var _text = this.drawStarText(55, 55, 5, 50, 20);
             //console.log(_text);
             var material = new THREE.SpriteMaterial( { map: _text } );
             var sprite = new THREE.Sprite( material );
             sprite.castShadow =
             //    star.receiveShadow  =
             true;

             sprite.position.set( poinPst.z - dft.y + 0.4, poinPst.y, poinPst.x - dft.x + 0.4);
             sprite.renderOrder =3;
             objState.add( sprite );*/

        },
        drawSurfGrid: function (dft, indStep, pointsGl, delta, abscissSize, step) {
            var grid = new THREE.Group(), st = 1 + indStep, /* step = indStep,*/ flag = true;
            var abscissSize = abscissSize, v1 = [], v2 = [],
                step = step,
                indx = 0,
                id = 0,
                ih = 0,
                stp = 21,//41,
                strt = 0,
                maxDist=0;
            for (var i = strt; i <= abscissSize; i += step) {
                var geometry = new THREE.Geometry(), v1 = [], v2 = [],
                    vG = new THREE.Geometry();
                vG.vertices.push(
                    pointsGl[ih]
                );
                for (var k = strt; k <= abscissSize; k += step) {

                    v1.push(pointsGl[indx]);
                    geometry.vertices.push(
                        pointsGl[indx++]
                    );
                    if (ih + stp < pointsGl.length) {
                        vG.vertices.push(
                            pointsGl[ih += stp]
                        );
                        v2.push(pointsGl[ih]);
                    }
                }
                ih = ++id;
                //var smooth = geometry.clone(),
                //    smooth1 = vG.clone();
                //smooth.mergeVertices();
                //smooth1.mergeVertices();
                //smooth.computeFaceNormals();
                //smooth1.computeFaceNormals();
                //smooth.computeVertexNormals();
                //smooth1.computeVertexNormals();
                ////modifier.modify( smooth );
                ////modifier.modify( smooth1 );
                //var spline1 = new THREE.SplineCurve3(v1),
                //    spline2 = new THREE.SplineCurve3(v2);
                //geometry.vertices = spline1.getPoints(5000);
                //vG.vertices = spline2.getPoints(5000);
                var _colorLine = 0x2828FF, _sp = 0x2222FF, _em = 0x000048, _op = 0.54,
                //matr= new THREE.MeshBasicMaterial({color: _colorLine}),
                    line_1 = new THREE.Line(geometry, new THREE.MeshPhongMaterial({
                        color: _colorLine, specular: _sp, emissive: _em, transparent: true, opacity: _op
                    })),
                    line_2 = new THREE.Line(vG, new THREE.MeshPhongMaterial({
                        color: _colorLine, specular: _sp, emissive: _em, transparent: true, opacity: _op
                    }));
                line_2.material.depthTest = line_1.material.depthTest = false;
                line_1.renderOrder = line_2.renderOrder = 2;
                line_2.castShadow = line_1.castShadow = line_2.receiveShadow = line_1.receiveShadow = true;
                grid.add(line_1);
                grid.add(line_2);


            }
            grid.position.set(-dft.y, delta + 0.035, -dft.x);
            objState.add(grid);
            //scene.add(objState);
        },
        drawStarText: function (cx, cy, spikes, outerRadius, innerRadius) {
            var canvas = document.createElement("canvas");
            canvas.width = canvas.height = outerRadius * 2 + 10;
            //document.body.appendChild(canvas);
            var ctx = canvas.getContext("2d");
            var rot = Math.PI / 2 * 3;
            var x = cx;
            var y = cy;
            var step = Math.PI / spikes;

            var _borderColor = "#202071";
            ctx.strokeSyle = _borderColor;//"#2828FF";
            ctx.beginPath();
            ctx.moveTo(cx, cy - outerRadius)
            for (var i = 0; i < spikes; i++) {
                x = cx + Math.cos(rot) * outerRadius;
                y = cy + Math.sin(rot) * outerRadius;
                ctx.lineTo(x, y)
                rot += step

                x = cx + Math.cos(rot) * innerRadius;
                y = cy + Math.sin(rot) * innerRadius;
                ctx.lineTo(x, y)
                rot += step
            }
            ctx.lineTo(cx, cy - outerRadius)
            ctx.closePath();
            ctx.lineWidth = 5;
            ctx.strokeStyle = _borderColor;
            ctx.stroke();
            ctx.fillStyle = '#344d7e';
            ctx.fill();
            var texture = new THREE.Texture(canvas);
            texture.minFilter = THREE.LinearFilter;
            texture.needsUpdate = true;
            texture.wrapS = THREE.RepeatWrapping;
            texture.wrapT = THREE.RepeatWrapping;
            //setTimeout(function(){texture.repeat.set( 1.02, 1.02 );console.log('test');},5000);


            return texture;
        },
        drawAbsciss: function (deltaY, _y) {
            var font = 27, textures = [
                build.drawTexture({msg: "Axial Length (mm)", fontsize: font}),
                build.drawTexture({msg: "Corneal Power (D)", fontsize: font}),
                build.drawTexture({msg: "IOL Power (D)", fontsize: font})
            ], _scale = 1.4;
            var wP = 6, hP = wP * textures[0].siz.h / textures[0].siz.w, shift = 15;
            deltaY -= 0.3;
            spr = new THREE.Mesh(new THREE.PlaneGeometry(wP, hP), new THREE.MeshBasicMaterial({
                color: '#000000',
                map: textures[0]
            }));
            spr.rotation.set(-0.4, 0, 0);
            spr.position.set(8, deltaY, shift);
            spr.scale.multiplyScalar(_scale);
            objState.add(spr);

            hP = wP * textures[1].siz.h / textures[1].siz.w;

            spr = new THREE.Mesh(new THREE.PlaneGeometry(wP, hP), new THREE.MeshBasicMaterial({
                color: '#000000',
                map: textures[1]
            }));
            spr.rotation.set(-1.54, 1.09, 1.55);
            spr.position.set(shift, deltaY, 6);
            spr.scale.multiplyScalar(_scale);
            objState.add(spr);

            hP = wP * textures[2].siz.h / textures[2].siz.w;
            var spr = new THREE.Mesh(new THREE.PlaneGeometry(wP, hP), new THREE.MeshBasicMaterial({
                color: '#000000',
                map: textures[2]
            }));
            //spr.rotation.set(1.56, 1.56, 0);
            spr.rotation.set(0, 0.76, 1.57);
            spr.position.set(0, _y / 2, shift - 2);
            objState.add(spr);
        },
        drawBackGrid: function (par) {
            var _x = par._x,
                _y = par._y,
                _z = par._z,
                deltaY = par.deltaY,
                yStep = par.yStep,
                font = par.font,
                zStep = par.zStep,
                _zSt = par._zSt,
                xStep = par.xStep,
                mtr = new THREE.MeshBasicMaterial({
                    color: "#fff",
                    transparent: true,
                    opacity: 0,
                    side: THREE.DoubleSide
                }),
                xy = new THREE.Mesh(new THREE.PlaneGeometry(_x, _y), mtr),
                xz = new THREE.Mesh(new THREE.PlaneGeometry(_x, _z), mtr),
                zy = new THREE.Mesh(new THREE.PlaneGeometry(_z, _y), mtr);
            xy.position.set(_x / 2, _y / 2 + deltaY, 0);
            objState.add(xy);
            xz.position.set(_x / 2, deltaY, _z / 2);
            xz.rotation.x = -1.57;
            objState.add(xz);
            zy.position.set(0, _y / 2 + deltaY, _z / 2);
            zy.rotation.y = 1.57;
            objState.add(zy);

            var bgnPnt = new THREE.Vector3(0, deltaY, 0),
                points = [
                    {vB: new THREE.Vector3(_x, deltaY, 0), vE: new THREE.Vector3(_x, deltaY, _z), count: 10},
                    {vB: new THREE.Vector3(0, deltaY, _z), vE: new THREE.Vector3(_x, deltaY, _z), count: _y},
                    {vB: new THREE.Vector3(0, deltaY, _z), vE: new THREE.Vector3(0, _y + deltaY, _z), count: 10}
                ],
                dftPnts = [
                    {vB: bgnPnt, vE: new THREE.Vector3(_x, 0, 0), count: _x},
                    {vB: bgnPnt, vE: new THREE.Vector3(0, _y, 0), count: _y},
                    {vB: bgnPnt, vE: new THREE.Vector3(0, 0, _z), count: _z}
                ];

            //build grid
            for (var i = 0; i < points.length; i++) {
                objState.add(this.buildLine(points[i].vB, points[i].vE, false, 0.03));
            }
            for (var i = 0; i < dftPnts.length; i++) {
                var c = dftPnts[i].count;
                for (var k = 0; k <= c; k++) {
                    var sprite, label,
                        v1, v2, v3, v4, pntDst = 1.5, lblEnd = pntDst / 2;
                    if (i == 0 && (yStep++) % 2 == 0) {
                        var x = _x / c * k,
                            v4 = new THREE.Vector3(x, deltaY, _z + lblEnd);
                        v1 = new THREE.Vector3(x, deltaY, 0),
                            v2 = new THREE.Vector3(x, _y + deltaY, 0),
                            v3 = new THREE.Vector3(x, deltaY, _z);
                        sprite = this.drawSprite({
                            fontsize: font,
                            msg: (yStep - 1) + ''
                        })
                        sprite.position.set(x, deltaY, _z + pntDst);
                        label = this.buildLine(v3, v4, false, 0.02);
                    } else if (i == 1) {
                        var y = _y / c * k;
                        if (zStep > 45 || y >= Math.floor(c)) {
                            break;
                        }

                        v1 = new THREE.Vector3(0, y, 0),
                            v2 = new THREE.Vector3(_x, y, 0),
                            v3 = new THREE.Vector3(0, y, _z),
                            v4 = new THREE.Vector3(0 - lblEnd, y, _z);

                        sprite = this.drawSprite({
                            fontsize: font,
                            msg: (zStep.toString().length == 1 ? zStep + ' ' : zStep + '')
                        });
                        zStep += _zSt;
                        sprite.position.set(0 - lblEnd, y, _z + lblEnd);

                        //}
                    } else if (i == 2 && ((xStep++) % 2 == 0 && k > 0)) {
                        var z = _z / c * k;
                        v1 = new THREE.Vector3(0, deltaY, z),
                            v3 = new THREE.Vector3(_x, deltaY, z),
                            v2 = new THREE.Vector3(0, _y + deltaY, z),
                            v4 = new THREE.Vector3(_x + lblEnd, deltaY, z);
                        if (k > 0) {
                            sprite = this.drawSprite({
                                fontsize: font,
                                msg: (xStep - 1) + ''
                            })
                            sprite.position.set(_x + pntDst, deltaY, z);
                        }

                    }
                    if (sprite) {
                        objState.add(sprite);
                        objState.add(this.buildLine(v1, v2, 'inner', 0.02));
                        objState.add(this.buildLine(v1, v3, 'inner', 0.02));
                        objState.add(this.buildLine(v3, v4, false, 0.02));
                    }

                }
            }
              if(zStep > 45){
                camera.setZoom(80);
            }
            console.log(zStep);
        },
        drawSurface: function (dft, delta, pointsGl, faces) {
            var geometry = new THREE.Geometry();
            geometry.vertices = pointsGl;
            geometry.faces = faces;
            geometry.computeFaceNormals();
            geometry.computeVertexNormals();
            geometry.mergeVertices();
            geometry.computeLineDistances();
            geometry.computeBoundingSphere();
            var mtr = new THREE.MeshPhongMaterial({
                    shading: THREE.SmoothShading,
                    color: '#608FD7',
                    emissive: '#0000FF',
                    specular: '#ffffff',
                    side: THREE.DoubleSide, overdraw: true
                }), modifier = new THREE.SubdivisionModifier(2),
                smooth = geometry.clone();
            ;
            smooth.mergeVertices();
            smooth.computeFaceNormals();
            smooth.computeVertexNormals();
            //modifier.modify(smooth);
            var particles = new THREE.Mesh(smooth, mtr);
            particles.position.set(-dft.y, delta, -dft.x);
            //particles.castShadow =
            particles.receiveShadow =
                true;
            mtr.depthTest = false;
            particles.renderOrder = 1;
            particles.name = 'surface';
            objState.add(particles);

        }
    };
   
        init();
        this.camera = camera;
        this.timer = timer;
        this.render = gl;
        this.scene = scene;
        this.build = build;
        this.getParent = getParent;
 

};

 








