//http://www.3dsociety.ru/tags/mototsikly
var MyScene = function (parentName) {

    var scene, _t = this,
        controls, objState,
        camera,
        gl,
        isAlreadyAbscissHasTooltip = false,
        parent,
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


    function setParent(name) {
        parent = (name.toString().match(/HTMLElement/) ? name : document.getElementById(name))[0];
    }

    function getParent() {
        return (parentName);
    }

    function _getW() {
        return parent.clientWidth
    };
    function _getH() {
        return parent.clientHeight
    };

    function init() {

        setParent(parentName);
        var
            min = {w: 450, h: 400},
            p = {w: _getW(), h: _getH()},
            w = p.w < min.w ? min.w : p.w,
            h = p.h < min.h ? min.h : p.h;

        _t.stopAnimate = true;
        timer = new TIMER();
        scene = new THREE.Scene();
        scene.background = new THREE.CubeTextureLoader()
            .setPath('dist/images/cube/')
            .load(['px.jpg', 'nx.jpg', 'py.jpg', 'ny.jpg', 'pz.jpg', 'nz.jpg']);
        var orphS = 60;
        var textureCube = new THREE.CubeTextureLoader()
            .setPath('dist/images/cube/')
            .load(['px.jpg', 'nx.jpg', 'py.jpg', 'ny.jpg', 'pz.jpg', 'nz.jpg']);
        textureCube.mapping = THREE.CubeRefractionMapping;


        camera = new THREE.PerspectiveCamera(35, w / h, 1, 10000);
        camera.position.set(130, 130, 130);


        gl = new THREE.WebGLRenderer({antialias: true, alpha: true, preserveDrawingBuffer: true});
        gl.physicallyCorrectLights = true;
        gl.gammaInput = true;
        gl.gammaOutput = true;
        gl.setClearColor(0xffffff, 0);
        gl.toneMapping = THREE.ReinhardToneMapping;
        gl.setPixelRatio(window.devicePixelRatio);
        gl.shadowMap.type = THREE.PCFSoftShadowMap;
        gl.setSize(w, h);
        parent.appendChild(gl.domElement);


        controls = new THREE.OrbitControls(camera, gl.domElement);
        controls.enabled = true;
        controls.minDistance = 0;
        controls.maxDistance = 10000;
        controls.enableDamping = true;
        controls.dampingFactor = 0.15;
        controls.target.set(0, 50, 0);
        //lights
        var spt = new THREE.SpotLight(0x84C1FF);
        spt.position.set(150, 150, 150);
        spt.castShadow = true;
        spt.angle = 1.03;
        spt.exponent = 2.0;
        spt.penumbra = 0.05;
        spt.decay = 2;
        spt.distance = 5500;
        spt.intensity = 45000;
        spt.shadow.mapSize.width = 1024;
        spt.shadow.mapSize.height = 1024;
        // shadow camera helper
        //spt.shadowCameraHelper = new THREE.CameraHelper( spt.shadow.camera ); // colored lines
        spt.shadow.camera.near = 0.1;
        spt.shadow.camera.far = 20000;
        //spt.shadow.camera.fov = (spt.angle * (360 / Math.PI));
        var lightHelper = new THREE.SpotLightHelper(spt);
        scene.add(spt);

        var bulbLight = new THREE.PointLight(0xffee88, 10, 1000, 20);
        bulbLight.position.set(0, 2, 0);
        scene.add(bulbLight);
        _t.bulbLight = bulbLight;

        var hemiLight = new THREE.HemisphereLight(0xddeeff, 0x0f0e0d, 1.02);
        scene.add(hemiLight);
        //scene.add( spt.shadowCameraHelper );
        //scene.add( new THREE.AxisHelper( 10 ) );
        //scene.add(lightHelper);


        // model

        var onProgress = function (xhr) {
            if (xhr.lengthComputable) {
                var percentComplete = xhr.loaded / xhr.total * 100;
                console.log(Math.round(percentComplete, 2) + '% downloaded');
            }
        };

        var onError = function (xhr) {
        };

        // THREE.Loader.Handlers.add( /\.dds$/i, new THREE.DDSLoader() );

        var mtlLoader = new THREE.MTLLoader();
        mtlLoader.setPath('assets/model/');
        mtlLoader.load('bike.mtl', function (materials) {

            materials.preload();

            var objLoader = new THREE.OBJLoader();
            objLoader.setMaterials(materials);
            objLoader.setPath('assets/model/');
            objLoader.load('bike.obj', function (object) {

                object.traverse(function (mesh) {
                    if (mesh instanceof THREE.Mesh) {
                        mesh.material.shading = THREE.SmoothShading;
                        mesh.material.envMap = textureCube;
                        mesh.materialrefractionRatio = 0.95;
                    }
                })

                // object.position.y = - 95;
                scene.add(object);

            }, onProgress, onError);

        });

        window.addEventListener('resize', windowResize, false);

        gl.domElement.addEventListener('mousedown', function () {
            _t.mouseDown = true;
        })
        gl.domElement.addEventListener('mouseup', function () {
            _t.mouseDown = false;
        })
        animate();
    }

    var rad = 100, angle = 0, step = 0.01 * Math.PI / 180;

    function animate() {
        var curTime = (new Date()).getTime(),
            delta = 1500;
        //renderer.clear();
        controls.update();
        gl.render(scene, camera);
        angle += step;
        _t.bulbLight.position.set(rad * Math.cos(angle), 50, rad * Math.sin(angle));
        if (!_t.mouseDown) {
            // scene.position.x =1*Math.cos(angle);
            scene.rotation.y += 0.001;
        }


        if (timer.getCurTime() + delta - curTime < 0 && _t.stopAnimate) {
            return cancelAnimationFrame(animate);
        }
        requestAnimationFrame(animate);
    }


    function windowResize() {
        var w = _getW(),
            h = _getH();
        camera.aspect = w / h;
        gl.setSize(w, h);
        // camera.setSize(w, h);
        camera.updateProjectionMatrix();
        gl.render(scene, camera);
    }


    _t.utils = {
        actionAnimate: function (val) {
            if (val) {
                _t.stopAnimate = false;
                animate();
                setTimeout(function () {
                    windowResize();
                }, 100)

            } else {
                _t.stopAnimate = true;
            }

        }
    }
    init();
    this.camera = camera;
    this.timer = timer;
    this.render = gl;
    this.scene = scene;
    this.getParent = getParent;


};

 








