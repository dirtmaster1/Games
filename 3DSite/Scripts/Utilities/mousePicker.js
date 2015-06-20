// User interaction
window.addEventListener('click', onMouseClick, false);

function onMouseClick(e) {
    

    projector = new THREE.Projector();
    mouseVector = new THREE.Vector3();

    mouseVector.x = 2 * (e.clientX / window.innerWidth) - 1;
    mouseVector.y = 1 - 2 * (e.clientY / window.innerHeight);

    var raycaster = projector.pickingRay(mouseVector.clone(), gameScreenManager.currentScreen.camera);

    //alert(mouseVector.x + ' ' + mouseVector.y + ' ' + raycaster.ray.direction.x + ' ' + raycaster.ray.direction.y + ' ' + raycaster.ray.direction.z);
    var gameObjects = [];

    gameObjectManager.gameObjectList.forEach(function (obj) {
        if (obj.model != undefined) {
            gameObjects.push(obj.model);
        }
    });

    var intersects = raycaster.intersectObjects(gameObjects, true);

    if (intersects.length > 0)
    {
        alert('Object Intersected:' + intersects[0].object.parent.name + ' - Mouse Picker Success ' + 'Mouse Click' + ' mouseX: ' + e.clientX + ' mouseY: ' + e.clientY);

    }

}