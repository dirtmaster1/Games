var gameObjectList = new Array();
var modelList = new Array();
var md = new ModelData(1, new THREE.Object3D());
modelList.push(md);

describe("GameObjectManager", function () {
    

    beforeEach(function () {
        
    });

    it("Create 5 game objects and add to list", function () {
        
        var goo = new GameObjectManager();
            goo.CreateGameObjects(5, "Enemy", 1);
        expect(gameObjectList.length).toBe(5);

    });

    it("Create single game object and add to list", function () {

        var goo = new GameObjectManager();
        goo.CreateGameObject("Enemy", 1, new THREE.Vector3(), Math.PI);
        expect(gameObjectList.length).toBe(6);

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

});

describe("Move function", function () {

    beforeEach(function () {

    });

    it("Should move object by correct amount", function () {


    });

    it("Should rotate object by correct amount", function () {


    });

    it("New position should velocity * change in time from last update", function () {


    });

});

describe("Shoot function", function () {

    beforeEach(function () {

    });

    it("Should create and fire one shot", function () {


    });

});

