var loadedData
$.ajax({
    url: "/load",
    type: "POST",
    success: function (data) {
        console.log("loaded")
        loadedData = JSON.parse(data)
        console.log(loadedData)
    },
    error: function (xhr, status, error) {},
});
var rendered = false
document.onclick = function () {
    if (rendered == false) {
        var scene = new THREE.Scene();


        var camera = new THREE.PerspectiveCamera(
            45, // kąt patrzenia kamery (FOV - field of view)
            window.innerWidth / window.innerHeight, // proporcje widoku, powinny odpowiadać proporcjom naszego ekranu przeglądarki
            0.1, // minimalna renderowana odległość
            10000 // maksymalna renderowana odległość od kamery
        );
        var renderer = new THREE.WebGLRenderer();
        renderer.setClearColor(0x001116);
        renderer.setSize(window.innerWidth, window.innerHeight);

        document.getElementById('root').appendChild(renderer.domElement)


        // var orbitControl = new THREE.OrbitControls(camera, renderer.domElement);
        // orbitControl.addEventListener('change', function () {
        //     renderer.render(scene, camera)
        // });

        //player i mapa
        var clock = new THREE.Clock();

        class Player {

            constructor() {

                var playerGeometry = new THREE.BoxGeometry(16, 16, 16);

                var playerMaterials = [];
                playerMaterials.push(new THREE.MeshPhongMaterial({
                    side: THREE.DoubleSide,
                    specular: 0xffffff,
                    shininess: 50,
                    map: new THREE.TextureLoader().load('mats/aa.jpg')
                }));
                playerMaterials.push(new THREE.MeshPhongMaterial({
                    side: THREE.DoubleSide,
                    specular: 0xffffff,
                    shininess: 50,
                    map: new THREE.TextureLoader().load('mats/aa.jpg')
                }));
                playerMaterials.push(new THREE.MeshPhongMaterial({
                    side: THREE.DoubleSide,
                    specular: 0xffffff,
                    shininess: 20,
                    map: new THREE.TextureLoader().load('mats/aa.jpg')
                }));
                playerMaterials.push(new THREE.MeshPhongMaterial({
                    side: THREE.DoubleSide,
                    specular: 0xffffff,
                    shininess: 20,
                    map: new THREE.TextureLoader().load('mats/aa.jpg')
                }));
                playerMaterials.push(new THREE.MeshPhongMaterial({
                    side: THREE.DoubleSide,
                    specular: 0xffffff,
                    shininess: 50,
                    map: new THREE.TextureLoader().load('mats/aa.jpg')
                }));
                playerMaterials.push(new THREE.MeshPhongMaterial({
                    side: THREE.DoubleSide,
                    specular: 0xffffff,
                    shininess: 50,
                    map: new THREE.TextureLoader().load('mats/a.jpg')
                }));

                this.container = new THREE.Object3D()

                this.player = new THREE.Mesh(playerGeometry, playerMaterials); // player sześcian

                this.container.add(this.player) // kontener w którym jest player

                this.axes = new THREE.AxesHelper(200) // osie konieczne do kontroli kierunku ruchu

                this.container.add(this.axes)

                this.mixer = null


            }

            //funkcja zwracająca cały kontener

            getPlayerCont() {
                return this.container
            }

            //funkcja zwracająca playera czyli sam sześcian

            getPlayerMesh() {
                return this.player
            }
            updateModel() {
                if (this.mixer) this.mixer.update(delta)
            }

            //animowanie postaci

            setAnimation() {
                this.mixer.clipAction("run").play();
            }

        }


        class Hex3D {

            constructor() {

                var hexGeometry = new THREE.BoxGeometry(64, 64, 8);
                var hexMaterial = new THREE.MeshPhongMaterial({
                    side: THREE.DoubleSide,
                    specular: 0xffffff,
                    shininess: 20,
                    map: new THREE.TextureLoader().load('mats/b.png')
                })


                var container = new THREE.Object3D() // kontener na obiekty 3D
                container.position.set(0, 10, 0);

                //wall
                var wall = new THREE.Mesh(hexGeometry, hexMaterial);


                //door
                var doorContainer = new THREE.Object3D()
                var sideGeometry = new THREE.BoxGeometry(14, 64, 8)

                var sideDoor = new THREE.Mesh(sideGeometry, hexMaterial)
                var side1 = sideDoor.clone()
                side1.position.x = -24

                var side2 = sideDoor.clone()
                side2.position.x = 24

                doorContainer.add(side1, side2)

                for (var i = 0; i < 6; i++) {
                    var angle = i * 60
                    if (loadedData[hexID].in != "") {
                        if (loadedData[hexID].in == i || loadedData[hexID].out == i) {
                            var door = doorContainer.clone()
                            door.position.x = 0.5 * 100 * Math.cos(angle * Math.PI / 180);
                            door.position.z = 0.5 * 100 * Math.sin(angle * Math.PI / 180);
                            door.position.y = 10
                            door.lookAt(container.position)
                            container.add(door)
                            continue
                        }
                    }

                    var side = wall.clone() // klon ściany
                    side.position.x = 0.5 * 100 * Math.cos(angle * Math.PI / 180);
                    side.position.z = 0.5 * 100 * Math.sin(angle * Math.PI / 180); // punkt na okręgu, do obliczenia      
                    side.position.y = 10
                    side.lookAt(container.position) // nakierowanie ściany na środek kontenera 3D  
                    container.add(side) // dodanie ściany do kontenera

                }

                var floorGeometry = new THREE.CircleGeometry(58, 6);
                var floorMaterial = new THREE.MeshPhongMaterial({
                    side: THREE.DoubleSide,
                    map: new THREE.TextureLoader().load('mats/c.jpg'),
                })
                var floor = new THREE.Mesh(floorGeometry, floorMaterial);
                floor.rotation.x = Math.PI / 2
                floor.rotation.z = 100
                floor.position.y = -16
                container.add(floor)
                return container
            }


        }

        var mazeSize = parseInt(loadedData.size)
        var arr = []
        var offsetLeft = 0
        var offsetTop = 0
        var offsetRow = false
        var hexID = 0
        var lightTab = []
        for (let x = 0; x < mazeSize; x++) {
            arr[x] = []
            if (offsetRow == false) {
                offsetLeft = 0
                var y = 0
                offsetRow = true
            } else {
                offsetLeft = 50
                var y = 1
                offsetRow = false
            }
            offsetTop += 85

            for (y; y < mazeSize; y++) {
                if (loadedData[hexID].in == "") {
                    hexID++
                    offsetLeft += 100
                    continue
                }
                var hexTile = new Hex3D()
                if (loadedData[hexID].type == "light") {
                    var hexLight = new THREE.PointLight(0xffffff, 5, 100)
                    console.log(loadedData[hexID].id)
                    hexLight.position.y = 50
                    hexTile.add(hexLight)
                    lightTab.push(hexLight)
                }
                scene.add(hexTile)
                hexTile.position.x = offsetLeft
                hexTile.position.z = offsetTop
                offsetLeft += 100
                arr[x][y] = hexTile
                hexID++

            }

        }




        var hagrid = new Player()
        scene.add(hagrid.getPlayerCont())
        // hagrid.loadModel("models/Tris.js", function (modeldata) {
        //     console.log("model został załadowany", modeldata)
        //     scene.add(modeldata) // data to obiekt kontenera zwrócony z Model.js
        // })
        // loadModel() {

        //     var loader = new THREE.JSONLoader();

        //     loader.load('models/tris.js', function (geometry) {
        //         var modelMaterial = new THREE.MeshBasicMaterial({
        //             map: new THREE.TextureLoader().load("mats/Mario.png"),
        //             morphTargets: true
        //         });

        //         this.meshModel = new THREE.Mesh(geometry, modelMaterial)
        //         this.meshModel.name = "name";
        //         this.meshModel.rotation.y = 0
        //         this.meshModel.position.y = 0
        //         this.meshModel.scale.set(1, 1, 1);
        //         this.mixer = new THREE.AnimationMixer(this.meshModel)

        //         //dodanie modelu do kontenera (na poprzednich zajęciach był to testowy sześcian)

        //         this.container.add(this.meshModel)

        //         // zwrócenie kontenera

        //         return container;

        //     });

        // }

        //ambientlight

        var light = new THREE.AmbientLight(0xffffff, 0.3);
        light.position.set(0, 2, 2);
        scene.add(light);


        //raycaster

        var clickedVect = new THREE.Vector3(0, 0, 0);
        var directionVect = new THREE.Vector3(0, 0, 0);
        var dist = 0
        var i = 0
        var angle = 0

        var aaaaa = false
        $(root).mousedown(function (event) {
            aaaaa = true
            var raycaster = new THREE.Raycaster(); // obiekt symulujący "rzucanie" promieni

            clickedVect.x = (event.clientX / $(window).width()) * 2 - 1;
            clickedVect.y = -(event.clientY / $(window).height()) * 2 + 1;
            raycaster.setFromCamera(clickedVect, camera);
            var intersects = raycaster.intersectObjects(scene.children, true);

            if (intersects.length > 0) {

                clickedVect = intersects[0].point
                console.log(clickedVect)

                directionVect = clickedVect.clone().sub(hagrid.getPlayerCont().position).normalize()
                directionVect.y = 0
                console.log(directionVect)

                dist = hagrid.getPlayerCont().position.clone().distanceTo(clickedVect)
                i = 0
                console.log(dist)
            }
            angle = Math.atan2(
                hagrid.getPlayerCont().position.clone().x - clickedVect.x,
                hagrid.getPlayerCont().position.clone().z - clickedVect.z
            )
            hagrid.getPlayerMesh().rotation.y = angle
        })
        $(root).mousemove(function (event) {
            if (aaaaa == true) {
                var raycaster = new THREE.Raycaster(); // obiekt symulujący "rzucanie" promieni

                clickedVect.x = (event.clientX / $(window).width()) * 2 - 1;
                clickedVect.y = -(event.clientY / $(window).height()) * 2 + 1;
                raycaster.setFromCamera(clickedVect, camera);
                var intersects = raycaster.intersectObjects(scene.children, true);

                if (intersects.length > 0) {

                    clickedVect = intersects[0].point
                    console.log(clickedVect)

                    directionVect = clickedVect.clone().sub(hagrid.getPlayerCont().position).normalize()
                    directionVect.y = 0
                    console.log(directionVect)

                    dist = hagrid.getPlayerCont().position.clone().distanceTo(clickedVect)
                    i = 0
                    console.log(dist)
                }
                angle = Math.atan2(
                    hagrid.getPlayerCont().position.clone().x - clickedVect.x,
                    hagrid.getPlayerCont().position.clone().z - clickedVect.z
                )
                hagrid.getPlayerMesh().rotation.y = angle
            }

        })


        $(root).mouseup(function (event) {
            aaaaa = false
        })


        document.getElementById('range').addEventListener('input', function () {
            for (let i = 0; i < lightTab.length; i++) {
                lightTab[i].intensity = this.value / 10;
            }
        })

        function render() {

            if (i < dist) {
                hagrid.getPlayerCont().translateOnAxis(directionVect, 3)
                i += 3
            }
            camera.position.x = hagrid.getPlayerCont().position.x
            camera.position.z = hagrid.getPlayerCont().position.z - 200
            camera.position.y = hagrid.getPlayerCont().position.y + 400
            camera.lookAt(hagrid.getPlayerCont().position)

            // var delta = clock.getDelta();
            // console.log(delta) // zobacz czy widać zmieniającą się liczbę w konsoli
            // if (hagrid.mixer) hagrid.mixer.update(delta)

            requestAnimationFrame(render);

            renderer.render(scene, camera);
        }
        render();

        var temptext = document.getElementById("temptext")
        temptext.innerHTML = ""
        rendered = true
    }



}