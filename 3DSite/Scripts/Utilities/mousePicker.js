// User interaction
window.addEventListener('click', onMouseClick, false);

function onMouseClick(e) {
    
    projector = new THREE.Projector();
    mouseVector = new THREE.Vector3();

    mouseVector.x = 2 * (e.clientX / window.innerWidth) - 1;
    mouseVector.y = 1 - 2 * (e.clientY / window.innerHeight);

    var raycaster = projector.pickingRay(mouseVector.clone(), gameScreenManager.currentScreen.camera);

    var gameObjects = [];

    gameScreenManager.gameObjectManager.gameObjectList.forEach(function (obj) {
        //if (obj instanceof GameObject) {
            if (obj.__proto__ == GameObject.prototype) {
                
                gameObjects.push(obj.model);
                
        }
    });

    var intersects = raycaster.intersectObjects(gameObjects, true);

    if (intersects.length > 0)
    {
        var playerShip = FindGameObjectByName(gameScreenManager.gameObjectManager.gameObjectList, 'PlayerShip1')
        playerShip.target = intersects[0].object.parent;
    }

}