//game lists
var renderer;
//game flags
var controlsAttachedFlag = false;
//managers
var gameObjectManager = new GameObjectManager();
var gameScreenManager = new GameScreenManager(new GameScreen());
//input
var keyboard = new KeyboardState();;
var controls;
//game time
var clock = new THREE.Clock();

LoadContent()
Initialize();
Render();

function LoadContent() {
    //MODEL LIST
    var modelListPath = "/Scripts/Loaders/ModelLoadList.js";
    var modelLoader = new ModelLoader();
    var modelList = [];
    modelLoader.Load(modelListPath, function (data) {
        data.Models.forEach(function (model) {

            function loadContentComplete() {
                if (data.Models.length == modelList.length) {
                    gameObjectManager.Initialize(modelList);
                };

            }

            switch (model.Model.loaderTypeId) {
                case 1:
                    var loader = new THREE.JSONLoader();
                    var callbackModel = function (geometry, materials) { createScene(geometry, materials) };
                    loader.load(model.Model.sourceFilePath, callbackModel);
                    function createScene(geometry, materials) {

                        object = new THREE.Object3D();
                        var mesh = new THREE.Mesh(geometry, new THREE.MeshFaceMaterial(materials));
                        object.add(mesh);
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
    gameScreenManager.Initialize($);

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
}

function Render() {
    var delta = clock.getDelta();
    keyboard.update();
    gameScreenManager.Update(keyboard, delta);

    requestAnimationFrame(Render);
    renderer.render(gameScreenManager.currentScreen.scene, gameScreenManager.currentScreen.camera);
}


