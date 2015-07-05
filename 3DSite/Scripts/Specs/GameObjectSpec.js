var gameObjectList = new Array();
var modelList = new Array();
var controlsAttachedFlag;
var goo = new GameObjectManager();
var md = new ModelData(1, new THREE.Object3D());
modelList.push(md);

describe("GameObjectManager", function () {
    
    beforeEach(function () { 
    });

    it("Create 5 game objects and add to list", function () {
        goo.CreateGameObjects(5, "Enemy", 1, modelList);
        expect(goo.gameObjectList.length).toBe(5);
    });

    it("Create single game object and add to list", function () {
        goo.CreateGameObject("Enemy", 1, new THREE.Vector3(), Math.PI, modelList);
        expect(goo.gameObjectList.length).toBe(6);
    });
});

describe("GameScreen", function () {
    

    beforeEach(function () {

    });

    it("Create SplashScreen is successful", function () {
        var scene = new THREE.Scene();
        var camera = new THREE.PerspectiveCamera(45, 7/5, 1, 1000);
        var splashScreen = new GameScreen("SplashScreen", scene, camera);

        expect(splashScreen.name).toBe("SplashScreen");
        expect(splashScreen.scene).toBeDefined();
        expect(splashScreen.camera).toBeDefined();
    });


});

describe("GameScreenManager", function () {
    var scene;
    var camera;
    var splashScreen;
    var gSM;

    beforeEach(function () {
        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(45, 7 / 5, 1, 1000);
        splashScreen = new GameScreen("SplashScreen", scene, camera);
        gSM = new GameScreenManager(splashScreen);
    });

    it("Current screen is initialized properly", function () {
        expect(gSM.currentScreen).toBe(splashScreen);
        expect(gSM.previousScreen).toBeUndefined();
    });

    it("Update to new screen", function () {
        var newScene = new THREE.Scene();
        var newCamera = new THREE.PerspectiveCamera(45, 7 / 5, 1, 1000);
        var gameScreen = new GameScreen("GameScreen", newScene, newCamera);

        gSM.ChangeScreen(gameScreen);

        expect(gSM.currentScreen).toBe(gameScreen);
        expect(gSM.previousScreen).toBe(splashScreen);
    });

    it("Update game screen manager", function () {
        var keyboard = new KeyboardState();
        gSM.Update(keyboard);

        expect(gSM).toBeDefined();
    });

    it("Update game scene", function () {
        
    });

});

describe("Chase Camera", function () {

    var targetObject;
    var chaseCamera;
    var offSet;

    beforeEach(function () {
        targetObject = new THREE.Object3D();
        targetObject.position.set(0, 0, 100);
        chaseCamera = new THREE.PerspectiveCamera(45, 7 / 5, 0.1, 20000);
        offSet = 100;
        chaseCamera.position.set(targetObject.position.x, targetObject.position.y, targetObject.position.z + offSet);
    });

    it("Distance of camera and target should always be equal", function () {
        var startDistance = chaseCamera.position.distanceTo(targetObject.position);
        targetObject.translateX(100);
        chaseCamera.position.set(targetObject.position.x, targetObject.position.y, targetObject.position.z + offSet);
        var endDistance = chaseCamera.position.distanceTo(targetObject.position);
        expect(startDistance).toBe(endDistance);

    });

    it("Rotation of camera and target should always be equal", function () {
        targetObject.rotateOnAxis(new THREE.Vector3(0, 0, 1), Math.PI)
        chaseCamera.rotation.set(targetObject.rotation.x, targetObject.rotation.y, targetObject.rotation.z);
        expect(chaseCamera.rotation.z).toBe(targetObject.rotation.z);

    });
});

describe("Mouse Picking", function () {

    var camera = new THREE.PerspectiveCamera(45, 7 / 5, 1, 10000);
    var projector = new THREE.Projector();
    var scene = new THREE.Scene();
    var mouseVector = new THREE.Vector3();
    var geom = new THREE.CubeGeometry(5, 5, 5);
    var cubes = new THREE.Object3D();

    beforeEach(function () {
        
        camera.position.set(0, 0, 10);
        camera.lookAt(new THREE.Vector3(0, 0, 0));
      
    });

    it("Should Intersect with Object", function () {

        scene.add(cubes);

            var grayness = Math.random() * 0.5 + 0.25,
            mat = new THREE.MeshBasicMaterial(),
            cube = new THREE.Mesh(geom, mat);
            mat.color.setRGB(grayness, grayness, grayness);
            cube.position.set(50, 50, 50);
            cube.grayness = grayness; // *** NOTE THIS
            cubes.add(cube);
       

        mouseVector.x = 52;
        mouseVector.y = 52;
        var raycaster = projector.pickingRay(mouseVector.clone(), camera);
        //TODO create cube object to use as test object
        var intersects = raycaster.intersectObjects(cubes.children);
        expect(intersects.length).toBe(0);
    });

});

