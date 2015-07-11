////////////////////////////////////////////////////////////////////////////////
////////////////////////////GameObject CLASS////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
function GameObject(name, type, model, controls) {
    this.name = name;
    this.type = type;
    this.model = model;
    this.controls = controls;
}

GameObject.prototype = {
    constructor: GameObject,
    target: null
};

GameObject.prototype.Update = function () { };

GameObject.prototype.Attack = function () { };

GameObject.prototype.Move = function () { };

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
    
    // loop thru game objects to place objects in scene and find player ship and bind controls
    for (var i = 0; i < this.gameObjectList.length; i++) {
        
        gameScreenManager.gameScreenList["gamePlayScreen"].scene.add(this.gameObjectList[i].model)

        //bind and configure fly controls to player ship
        if (this.gameObjectList[i].name == 'PlayerShip1') {
            var playerShip = this.gameObjectList[i];
            var controls = new THREE.ShipControls(this.gameObjectList[i].model);
            playerShip.controls = controls;
            playerShip.controls.movementSpeed = 1000;
            playerShip.controls.rollSpeed = Math.PI / 5;
            playerShip.controls.autoForward = false;
            playerShip.controls.dragToLook = false;
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
        temp.name = type + i
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
    temp.name = type + "1"
    temp.position = startPosition;
    temp.rotation.y = startRotation;
    this.gameObjectList.push(new GameObject(type + "1", type, temp));

}

GameObjectManager.prototype.Update = function (keyboard, delta) {
    //update game objects
    for (var i = 0; i < this.gameObjectList.length; i++) {

        if (this.gameObjectList[i].name == 'PlayerShip1' && this.gameObjectList[i].controls) {
            //Update ship position and rotation based on keyboard input
            this.gameObjectList[i].controls.update(delta);
        }
    }
};











