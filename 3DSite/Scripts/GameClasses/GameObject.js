////////////////////////////////////////////////////////////////////////////////
////////////////////////////GameObject CLASS////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
function GameObject(name, type, model) {
    this.name = name;
    this.type = type;
    this.model = model;
    this.velocity =  new THREE.Vector3();

}

////////////////////////////////////////////////////////////////////////////////
/////////////////////GameObjectManager CLASS////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
function GameObjectManager() {
    this.gameObjectList = [];
}

GameObjectManager.prototype.Initialize = function (models) {

    var modelList = models;
    this.CreateGameObjects(5, "Enemy", 3, modelList);
    this.CreateGameObject("PlayerShip", 1, new THREE.Vector3(0, 0, 500), Math.PI, modelList);
    //this.CreateGameObject("PlayerShip", 1, new THREE.Vector3(0, 0, 500), 0, modelList);

    // loop thru game objects to place objects in scene and find player ship and bind controls
    for (var i = 0; i < this.gameObjectList.length; i++) {
        
        gameScreenManager.gameScreenList["gamePlayScreen"].scene.add(this.gameObjectList[i].model)

        //bind and configure fly controls to player ship
        if (this.gameObjectList[i].name == 'PlayerShip1') {
            controls = new THREE.ShipControls(this.gameObjectList[i].model);
            controls.movementSpeed = 1000;
            controls.rollSpeed = Math.PI / 5;
            controls.autoForward = false;
            controls.dragToLook = false;
            controlsAttachedFlag = true;
        }
    }
}

GameObjectManager.prototype.CreateGameObjects = function (count, type, modelId, modelList) {
    var start = this.gameObjectList.length;
    var modelData = modelList.filter(getModelById);
    function getModelById(obj) {
        if (obj.id == modelId) {
            return obj
        }
    }
            
    for (i = start; i < count + start; i++)
    {
        var temp = modelData[0].model.clone();
        var x = getRandomArbitrary(-5000, 5000);
        var y = getRandomArbitrary(0, 1);
        var z = getRandomArbitrary(-5000, -1000);
        temp.position = new THREE.Vector3(x, y, z);
        this.gameObjectList.push(new GameObject(type + i, type, temp));
    }

}

GameObjectManager.prototype.CreateGameObject = function (type, modelId, startPosition, startRotation, modelList) {
    var start = this.gameObjectList.length;
    var modelData = modelList.filter(getModelById);
    function getModelById(obj) {
        if (obj.id == modelId) {
            return obj
        }
    }

    var temp = modelData[0].model.clone();
    temp.position = startPosition;
    temp.rotation.y = startRotation;
    this.gameObjectList.push(new GameObject(type + "1", type, temp));

}

// Returns a random number between min and max
function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

// Returns a random integer between min and max
// Using Math.round() will give you a non-uniform distribution!
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

////////////////////////////////////////////////////////////////////////////////
////////////////////////////GAMESCREEN CLASS////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
function GameScreen(name, scene, camera) {
    this.name = name;
    this.scene = scene;
    this.camera = camera;
}

GameScreen.prototype.Update = function (keyboard, delta, scope) {

    if (this.name == "SplashScreen")
    {
        if (keyboard.down("enter")) {
            scope.ChangeScreen(scope.gameScreenList["gamePlayScreen"]);
        }
    }

    if (this.name == "GamePlayScreen") {
        //update game objects
            for (var i = 0; i < gameObjectManager.gameObjectList.length; i++) {

                if (gameObjectManager.gameObjectList[i].name == 'PlayerShip1') {
                    //Update ship position and rotation based on keyboard input
                    if (controlsAttachedFlag == true) {
                        controls.update(delta);
                    }
                    this.UpdateCamera(this, i);
                    this.UpdateUI(this, i);
                }
                
            }
    }
}

GameScreen.prototype.UpdateCamera = function (scope, counter) {
    var relativeCameraOffset = new THREE.Vector3(0, 200, -1000);
    var cameraOffset = relativeCameraOffset.applyMatrix4(gameObjectManager.gameObjectList[counter].model.matrixWorld);

    var cameraUp = new THREE.Vector3(0, 1, 0);
    var cameraUpMatrix = new THREE.Matrix4();
    var cameraUpRotMatrix = cameraUpMatrix.makeRotationFromQuaternion(gameObjectManager.gameObjectList[counter].model.quaternion)

    scope.camera.position.x = cameraOffset.x;
    scope.camera.position.y = cameraOffset.y;
    scope.camera.position.z = cameraOffset.z;
    scope.camera.up = cameraUp.applyMatrix4(cameraUpRotMatrix);
    scope.camera.lookAt(gameObjectManager.gameObjectList[counter].model.position);
}

GameScreen.prototype.UpdateUI = function (scope, counter) {

    var t = gameObjectManager.gameObjectList[counter].model;
        document.querySelector('#shipPosition').innerHTML = 'Ship Position: <br /> x = ' + t.position.x + ', <br /> y = ' + t.position.y + ', <br /> z = ' + t.position.z;
        document.querySelector('#cameraPosition').innerHTML = 'Camera Position: <br /> x = ' + scope.camera.position.x + ', <br /> y = ' + scope.camera.position.y + ', <br /> z = ' + scope.camera.position.z;
    
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




