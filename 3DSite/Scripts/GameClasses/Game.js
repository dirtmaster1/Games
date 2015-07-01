//game lists
var renderer;
//managers
var gameObjectManager = new GameObjectManager();
var gameScreenManager = new GameScreenManager(new GameScreen());
//input
var keyboard = new KeyboardState();;
var playerShip; 
//game time
var clock = new THREE.Clock();

LoadContent()
Initialize();
Render();

function LoadContent() {
    //MODEL LIST
    var modelListPath = "/Scripts/Loaders/ModelLoadList.js";
    var modelLoader = new ModelLoader();
    modelLoader.Load(modelListPath);
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
    renderer.setSize(window.innerWidth, window.innerHeight);
    gameScreenManager.Update(keyboard, delta);
    requestAnimationFrame(Render);
    renderer.render(gameScreenManager.currentScreen.scene, gameScreenManager.currentScreen.camera);
}


