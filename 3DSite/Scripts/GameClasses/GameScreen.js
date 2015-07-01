////////////////////////////////////////////////////////////////////////////////
////////////////////////////GAMESCREEN CLASS////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
function GameScreen(name, scene, camera) {
    this.name = name;
    this.scene = scene;
    this.camera = camera;
}

GameScreen.prototype.Update = function (keyboard, delta, scope) {

    if (this.name == "SplashScreen") {
        if (keyboard.down("enter")) {
            scope.ChangeScreen(scope.gameScreenList["gamePlayScreen"]);
        }
    }

    if (this.name == "GamePlayScreen") {
        //update game objects
        for (var i = 0; i < gameObjectManager.gameObjectList.length; i++) {

        }

            //Update ship position and rotation based on keyboard input
            if (playerShip.controls) {
                playerShip.controls.update(delta);
            }
            this.UpdateCamera(this);
            this.UpdateUI(this);
    }
}

GameScreen.prototype.UpdateCamera = function (scope) {
    var relativeCameraOffset = new THREE.Vector3(0, 200, -1000);
    var cameraOffset = relativeCameraOffset.applyMatrix4(playerShip.model.matrixWorld);

    var cameraUp = new THREE.Vector3(0, 1, 0);
    var cameraUpMatrix = new THREE.Matrix4();
    var cameraUpRotMatrix = cameraUpMatrix.makeRotationFromQuaternion(playerShip.model.quaternion)

    scope.camera.position.x = cameraOffset.x;
    scope.camera.position.y = cameraOffset.y;
    scope.camera.position.z = cameraOffset.z;
    scope.camera.up = cameraUp.applyMatrix4(cameraUpRotMatrix);
    scope.camera.lookAt(playerShip.model.position);
    scope.camera.aspect = window.innerWidth / window.innerHeight;
    scope.camera.updateProjectionMatrix();
}

GameScreen.prototype.UpdateUI = function (scope) {

    document.querySelector('#shipPosition').innerHTML = 'Ship Position: <br /> x = ' + playerShip.model.position.x + ', <br /> y = ' + playerShip.model.position.y + ', <br /> z = ' + playerShip.model.position.z;
    document.querySelector('#cameraPosition').innerHTML = 'Camera Position: <br /> x = ' + scope.camera.position.x + ', <br /> y = ' + scope.camera.position.y + ', <br /> z = ' + scope.camera.position.z;
    document.querySelector('#shipTarget').innerHTML = playerShip.target;
}

////////////////////////////////////////////////////////////////////////////////
///////////////////////////GameScreenManager CLASS//////////////////////////////
////////////////////////////////////////////////////////////////////////////////
function GameScreenManager(gameScreen) {

    this.currentScreen = gameScreen;
    this.previousScreen;
    this.gameScreenList = {};
}

GameScreenManager.prototype.Initialize = function () {
    //game display objects
    var gamePlayScene, gamePlayCamera;
    var splashScene, splashCamera;
    //game screen objects
    var gamePlayScreen, splashScreen;
    //Create splashScreen
    splashScene = new THREE.Scene();
    splashCamera = new THREE.OrthographicCamera(window.innerWidth / -2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / -2, 1, 1000);
    splashScene.add(splashCamera);
    splashCamera.position.set(0, 150, 400);
    splashCamera.lookAt(splashScene.position);
    var splashAmbientLight = new THREE.AmbientLight(0x111111);
    splashScene.add(splashAmbientLight);
    var splashLight = new THREE.PointLight(0xffffff);
    splashLight.position.set(-100, 200, 100);
    splashScene.add(splashLight);

    var splashScreenTexture = new THREE.ImageUtils.loadTexture('Content/Images/SplashScreen.jpg');
    var splashScreenMaterial = new THREE.MeshBasicMaterial({ map: splashScreenTexture, side: THREE.DoubleSide });
    var splashScreenGeometry = new THREE.PlaneGeometry(1000, 1000, 10, 10);
    var splashScreenMesh = new THREE.Mesh(splashScreenGeometry, splashScreenMaterial);
    splashScreenMesh.position.z = -500;
    splashScreenMesh.position.y = -150;
    splashScene.add(splashScreenMesh);

    splashScreen = new GameScreen("SplashScreen", splashScene, splashCamera);

    //Create gamePlayScreen
    gamePlayScene = new THREE.Scene();
    // CAMERA
    gamePlayCamera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 20000);
    gamePlayScene.add(gamePlayCamera);
    gameObjectManager.gameObjectList.push(gamePlayCamera);
    //HUD

    // LIGHT
    var ambientLight = new THREE.AmbientLight(0x444444);
    gamePlayScene.add(ambientLight);
    var light = new THREE.PointLight(0xffffff);
    light.position.set(0, 0, 0);
    gamePlayScene.add(light);
    var directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(0, 1, 0);
    gamePlayScene.add(directionalLight);
    gamePlayScreen = new GameScreen("GamePlayScreen", gamePlayScene, gamePlayCamera);

    gameScreenManager.gameScreenList["splashScreen"] = splashScreen;
    gameScreenManager.gameScreenList["gamePlayScreen"] = gamePlayScreen;
    gameScreenManager.ChangeScreen(splashScreen);
}

GameScreenManager.prototype.ChangeScreen = function (gameScreen) {
    this.previousScreen = this.currentScreen
    this.currentScreen = gameScreen;
}

GameScreenManager.prototype.Update = function (keyboard, delta) {
    var scope = this;
    this.currentScreen.Update(keyboard, delta, scope);
}
