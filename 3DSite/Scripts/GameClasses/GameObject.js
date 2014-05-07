//GAMEOBJECT CLASSES
function GameObject(name, type, model) {
    this.name = name;
    this.type = type;
    this.model = model;
    this.velocity =  new THREE.Vector3();

}

GameObject.prototype.Move = function() {


}

function GameObjectManager() {
    
}

GameObjectManager.prototype.Initialize = function () {

    this.CreateGameObjects(5, "Enemy", 3);
    this.CreateGameObject("PlayerShip", 1, new THREE.Vector3(0, 0, 500), Math.PI);

    for (var i = 0; i < gameObjectList.length; i++) {
        //gameObjectList[i].model.id = gameObjectList[i].model.id + i;
        gamePlayScene.add(gameObjectList[i].model)

        //attach and configure fly controls to player ship
        if (gameObjectList[i].name == 'PlayerShip1') {
            controls = new THREE.FlyControls(gameObjectList[i].model);
            controls.movementSpeed = 1000;
            controls.rollSpeed = Math.PI / 5;
            controls.autoForward = false;
            controls.dragToLook = false;
            controlsAttachedFlag = true;
        }

    }
}

GameObjectManager.prototype.CreateGameObjects = function (count, type, modelId) {
    var start = gameObjectList.length;
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
        gameObjectList.push(new GameObject(type + i, type, temp));
    }

}

GameObjectManager.prototype.CreateGameObject = function (type, modelId, startPosition, startRotation) {
    var start = gameObjectList.length;
    var modelData = modelList.filter(getModelById);
    function getModelById(obj) {
        if (obj.id == modelId) {
            return obj
        }
    }

    var temp = modelData[0].model.clone();
    temp.position = startPosition;
    temp.rotation.y = startRotation;
    gameObjectList.push(new GameObject(type + "1", type, temp));

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

function GameScreenManager(gameScreen) {

    this.currentScreen = gameScreen;
    this.previousScreen;
    this.gameScreenList = {};
}

GameScreenManager.prototype.ChangeScreen = function (gameScreen) {
    this.previousScreen = this.currentScreen
    this.currentScreen = gameScreen;
}

GameScreenManager.prototype.Update = function (keyboard) {

    if (keyboard.down("enter"))
    {
        this.ChangeScreen(this.gameScreenList["gamePlayScreen"]);
    }
}




