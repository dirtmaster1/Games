//game display objects
var gamePlayScene, gamePlayCamera, renderer;
var splashScene, splashCamera;
//game screen objects
var gamePlayScreen, splashScreen;
//game lists
var modelList = [];
var gameObjectList = [];
//game flags
var loadContentCompleteFlag = false;
var controlsAttachedFlag = false;
//managers
var gameObjectManager;
var gameScreenManager;
//input
var keyboard;
var controls;
//game time
var clock = new THREE.Clock();

LoadContent()
Initialize();
Render();

function LoadContent() {
    //MODEL LIST
    modelListPath = "/Scripts/Loaders/ModelLoadList.js";
    modelLoader = new ModelLoader();
    modelLoader.Load(modelListPath, function (data) {
        data.Models.forEach(function (model) {

            function loadContentComplete() {
                if (data.Models.length == modelList.length) {
                    loadContentCompleteFlag = true;
                };

            }

            switch (model.Model.loaderTypeId) {
                case 1:
                    var loader = new THREE.JSONLoader();
                    var callbackModel = function (geometry, materials) { createScene(geometry, materials) };
                    loader.load(model.Model.sourceFilePath, callbackModel);
                    function createScene(geometry, materials) {
                        object = new THREE.Mesh(geometry, new THREE.MeshFaceMaterial(materials));
                        var modelData = new ModelData(model.Model.modelId, object);
                        modelList.push(modelData);
                        loadContentComplete();
                    }
                    break;
                case 2:
                    var loader = new THREE.OBJMTLLoader();
                    loader.load(model.Model.sourceFilePath, model.Model.mappingFilePath, function (object) {
                        var modelData = new ModelData(model.Model.modelId, object);
                        modelList.push(modelData);
                        loadContentComplete();
                    });
                    break;
                case 3:
                    var manager = new THREE.LoadingManager();
                    manager.onProgress = function (item, loaded, total) {
                        console.log(item, loaded, total);
                    };

                    var texture = new THREE.Texture();

                    var loader = new THREE.ImageLoader(manager);
                    loader.load(model.Model.textureFilePath1, function (image) {
                        texture.image = image;
                        texture.needsUpdate = true;
                    });

                    var loader = new THREE.OBJLoader(manager);
                    loader.load(model.Model.sourceFilePath, function (object) {
                        object.traverse(function (child) {
                            if (child instanceof THREE.Mesh) {
                                child.material.map = texture;
                            }
                        });
                        object.scale.set(8, 8, 8);
                        var modelData = new ModelData(model.Model.modelId, object);
                        modelList.push(modelData);
                    });
                    loadContentComplete();
                    break;
                default:
                    model.Model.sourceFilePath;
            }

        });
    });
}

function Initialize() {
    //Managers
    gameObjectManager = new GameObjectManager();
    keyboard = new KeyboardState();

    InitializeGameScreens()

    //Create renderer
    //RENDER
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
}

function Render() {
    
    var delta = clock.getDelta();
    keyboard.update();
    gameScreenManager.Update(keyboard);

    if (controlsAttachedFlag == true) {
        controls.update(delta);
    }

    requestAnimationFrame(Render);
    renderer.render(gameScreenManager.currentScreen.scene, gameScreenManager.currentScreen.camera);

    if (loadContentCompleteFlag == true)
    {
        gameObjectManager.Initialize();
        loadContentCompleteFlag = false;
    }
}

function InitializeGameScreens() {
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

    gameScreenManager = new GameScreenManager(splashScreen);

    gameScreenManager.gameScreenList["splashScreen"] = splashScreen;
    gameScreenManager.gameScreenList["gamePlayScreen"] = gamePlayScreen;
}

