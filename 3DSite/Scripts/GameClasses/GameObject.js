//GAMEOBJECT CLASSES
function GameObject(name, type, model) {
    this.name = name;
    this.type = type;
    this.model = model;
    this.velocity =  new THREE.Vector3();

}

function GameObjectManager() {
    this.gameObjectList = [];
}

GameObjectManager.prototype.Initialize = function (models) {

    var modelList = models;
    this.CreateGameObjects(5, "Enemy", 3, modelList);
    this.CreateGameObject("PlayerShip", 1, new THREE.Vector3(0, 0, 500), Math.PI, modelList);

    for (var i = 0; i < this.gameObjectList.length; i++) {
        
        gameScreenManager.gameScreenList["gamePlayScreen"].scene.add(this.gameObjectList[i].model)

        //attach and configure fly controls to player ship
        if (this.gameObjectList[i].name == 'PlayerShip1') {
            controls = new THREE.FlyControls(this.gameObjectList[i].model);
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
        var x = getRandomArbitrary(-500, 500);
        var y = getRandomArbitrary(0, 1);
        var z = getRandomArbitrary(-500, -100);
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


//GAMESCREEN CLASSES
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
        if (controlsAttachedFlag == true) {
            controls.update(delta);
        }
    }
}

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
    gamePlayCamera.position.set(0, 0, 2000);
    gamePlayCamera.lookAt(gamePlayScene.position);
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




