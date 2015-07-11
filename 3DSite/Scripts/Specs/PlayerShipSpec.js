describe("PlayerShip", function () {
    var model = new THREE.Object3D();
    var controls = new THREE.ShipControls(model);
    var ship = new PlayerShip(model, controls);


    it("should create and fire projectile", function () {

        ship.Shoot();

       
    });
});