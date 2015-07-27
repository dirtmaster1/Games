////////////////////////////////////////////////////////////////////////////////
////////////////////////////GameObject CLASS////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
function GameObject(name, type, model, controls) {
    this.name = name;
    this.type = type;
    this.model = model;
    this.controls = controls;
    this.projectileList = [];
}

GameObject.prototype = {
    constructor: GameObject,
    target: null
};

GameObject.prototype.Update = function () {


};

GameObject.prototype.Attack = function () {
    console.log('Attack!', this.type);

    var sphere = new THREE.Object3D();
    var sphereGeometry = new THREE.SphereGeometry(10, 16, 8);
    var sphereMaterial = new THREE.MeshLambertMaterial({ color: 0xFFFFFF });
    var sphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphere.add(sphereMesh);

    sphere.rotation = this.model.rotation.clone();
    sphere.position.set(this.model.position.x, this.model.position.y, this.model.position.z);
    gameScreenManager.gameScreenList["gamePlayScreen"].scene.add(sphere);
    this.projectileList.push(sphere);
};

GameObject.prototype.Move = function () { };

////////////////////////////////////////////////////////////////////////////////
/////////////////////GameObjectManager CLASS////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
function GameObjectManager() {
    this.gameObjectList = [];
    this.playerShip = {};
}

GameObjectManager.prototype.Initialize = function (models) {

    var modelList = models;
    
    this.CreateGameObjects(5, "Enemy", 3, modelList);
    this.CreateGameObject("PlayerShip", 1, new THREE.Vector3(0, 0, 500), Math.PI, modelList);

    this.playerShip = FindGameObjectByName(this.gameObjectList, 'PlayerShip1');
    //bind and configure fly controls to player ship
    var controls = new THREE.ShipControls(this.playerShip);
    this.playerShip.controls = controls;
    this.playerShip.controls.movementSpeed = 2000;
    this.playerShip.controls.rollSpeed = Math.PI / 10;
    this.playerShip.controls.autoForward = false;
    this.playerShip.controls.dragToLook = false;
    this.playerShip.model.rotation.order = "YXZ";
    this.playerShip.model.updateMatrix();
    
    // loop thru game objects to place objects in scene and find player ship and bind controls
    for (var i = 0; i < this.gameObjectList.length; i++) {
        gameScreenManager.gameScreenList["gamePlayScreen"].scene.add(this.gameObjectList[i].model)
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
    //temp.rotation.y = startRotation;
    this.gameObjectList.push(new GameObject(type + "1", type, temp));

}

GameObjectManager.prototype.Update = function (keyboard, delta) {
     for (var i = 0; i < this.gameObjectList.length; i++) {
   
            
     }

    //Update player controlled ship position and rotation based on keyboard input
     this.playerShip.controls.update(delta);

     for (var j = 0; j < this.playerShip.projectileList.length; j++)
     { 
         //var matrix1 = new THREE.Matrix4();
         //matrix1.extractRotation(this.playerShip.projectileList[j].matrixWorld);

         var direction = new THREE.Vector3(0, 0, 1);
         //direction.applyMatrix4(matrix1);
         //direction.normalize();
       
         this.playerShip.projectileList[j].translateZ(100);
     }
};

function FindGameObjectByName(array, name) {
    for (var i = 0; i < array.length; i++) {

        if (array[i].name == name) {
            return array[i];
        }
    }
}

function Intersect(object, objectList, callback) {

    for (var vertexIndex = 0; vertexIndex < object.geometry.vertices.length; vertexIndex++) {
        var localVertex = object.geometry.vertices[vertexIndex].clone();
        var globalVertex = object.matrix.multiplyVector3(localVertex);
        var directionVector = globalVertex.subSelf(object.position);

        var ray = new THREE.Ray(object.position, directionVector.clone().normalize());
        var collisionResults = ray.intersectObjects(objectList);
        if (collisionResults.length > 0 && collisionResults[0].distance < directionVector.length()) {
            callback;
        }
    }

};











