﻿/**
 * @author James Baicoianu / http://www.baicoianu.com/
 */

THREE.ShipControls = function (object, domElement) {

    if (object.model == null) return;
    this.object = object.model;
    this.ship = object;
   
    this.domElement = (domElement !== undefined) ? domElement : document;
    if (domElement) this.domElement.setAttribute('tabindex', -1);

    // API
    this.movementSpeed = 1.0;
    this.rollSpeed = 50.0;
    this.dragToLook = false;
    this.autoForward = false;

    // disable default target object behavior
    // internals
    this.tmpQuaternion = new THREE.Quaternion();
    this.mouseStatus = 0;
    this.moveState = { up: 0, down: 0, left: 0, right: 0, forward: 0, back: 0, pitchUp: 0, pitchDown: 0, yawLeft: 0, yawRight: 0, rollLeft: 0, rollRight: 0 };
    this.moveVector = new THREE.Vector3(0, 0, 0);
    this.rotationVector = new THREE.Vector3(0, 0, 0);

    this.handleEvent = function (event) {

        if (typeof this[event.type] == 'function') {
            this[event.type](event);
        }

    };

    this.keydown = function (event) {

        if (event.altKey) {

            return;

        }

        //event.preventDefault();

        switch (event.keyCode) {

            case 16: /* shift */ this.movementSpeedMultiplier = .1; break;

            case 83: /*W*/ this.moveState.forward = 1; break;
            case 87: /*S*/ this.moveState.back = 1; break;

            //switched left/right due to ship models intial relative backwards position 
            case 68: /*A*/ this.moveState.left = 1; break;
            case 65: /*D*/ this.moveState.right = 1; break;

            
            case 82: /*R*/ this.moveState.up = 1; break;
            case 70: /*F*/ this.moveState.down = 1; break;

            case 38: /*up*/ this.moveState.pitchUp = 1; break;
            case 40: /*down*/  this.moveState.pitchDown = 1; break;

            case 37: /*left*/ this.moveState.yawLeft = 1; break; 
            case 39: /*right*/ this.moveState.yawRight = 1; break;

            case 81: /*Q*/ this.moveState.rollLeft = -1; break;
            case 69: /*E*/ this.moveState.rollRight = -1; break;

        }

        this.updateMovementVector();
        this.updateRotationVector();

    };

    this.keyup = function (event) {

        switch (event.keyCode) {

            case 16: /* shift */ this.movementSpeedMultiplier = 1; break;

            case 83: /*W*/ this.moveState.forward = 0; break;
            case 87: /*S*/ this.moveState.back = 0; break;

            //switched left/right due to ship models intial relative backwards position 
            case 68: /*A*/ this.moveState.left = 0; break;
            case 65: /*D*/ this.moveState.right = 0; break;

            case 82: /*R*/ this.moveState.up = 0; break;
            case 70: /*F*/ this.moveState.down = 0; break;

            case 38: /*up*/ this.moveState.pitchUp = 0; break;
            case 40: /*down*/  this.moveState.pitchDown = 0; break;

            case 37: /*left*/ this.moveState.yawLeft = 0; break; 
            case 39: /*right*/ this.moveState.yawRight = 0; break;

            case 81: /*Q*/ this.moveState.rollLeft = 0; break;
            case 69: /*E*/ this.moveState.rollRight = 0; break;

        }

        this.updateMovementVector();
        this.updateRotationVector();

    };

    this.mousepick = function (event) {

        console.log('Mouse Pick!', this.ship);
        projector = new THREE.Projector();
        mouseVector = new THREE.Vector3();

        mouseVector.x = 2 * (event.clientX / window.innerWidth) - 1;
        mouseVector.y = 1 - 2 * (event.clientY / window.innerHeight);

        var raycaster = projector.pickingRay(mouseVector.clone(), gameScreenManager.currentScreen.camera);

        var gameObjects = [];

        gameScreenManager.gameObjectManager.gameObjectList.forEach(function (obj) {
            //if (obj instanceof GameObject) {
            if (obj.__proto__ == GameObject.prototype) {

                gameObjects.push(obj.model);

            }
        });

        var intersects = raycaster.intersectObjects(gameObjects, true);

        if (intersects.length > 0) {
            var playerShip = FindGameObjectByName(gameScreenManager.gameObjectManager.gameObjectList, 'PlayerShip1')
            playerShip.target = intersects[0].object.parent;
        }

    }

    this.mouseshoot = function (event) {

        event.preventDefault();
        event.stopPropagation();

        this.ship.Attack();

    };

    this.mousedown = function (event) {

        if (this.domElement !== document) {
            this.domElement.focus();
        }

        event.preventDefault();
        event.stopPropagation();

        
        console.log('shoot', this.object);

        if (this.dragToLook) {

            this.mouseStatus++;

        } else {

            switch (event.button) {

                case 0: this.moveState.forward = 1; break;
                case 2: this.moveState.back = 1; break;

            }

            this.updateMovementVector();
        }

    };

    this.mousemove = function (event) {

        if (!this.dragToLook || this.mouseStatus > 0) {

            var container = this.getContainerDimensions();
            var halfWidth = container.size[0] / 2;
            var halfHeight = container.size[1] / 2;

            this.moveState.yawLeft = -((event.pageX - container.offset[0]) - halfWidth) / halfWidth;
            this.moveState.pitchDown = ((event.pageY - container.offset[1]) - halfHeight) / halfHeight;

            //this.updateRotationVector();

        }

    };

    this.mouseup = function (event) {

        event.preventDefault();
        event.stopPropagation();

        if (this.dragToLook) {

            this.mouseStatus--;

            this.moveState.yawLeft = this.moveState.pitchDown = 0;

        } else {

            switch (event.button) {

                case 0: this.moveState.forward = 0; break;
                case 2: this.moveState.back = 0; break;

            }

            this.updateMovementVector();

        }

        //this.updateRotationVector();

    };

    this.update = function (delta) {

        var moveMult = delta * this.movementSpeed;
        var rotMult = delta * this.rollSpeed;

        this.object.translateX(this.moveVector.x * moveMult);
        this.object.translateY(this.moveVector.y * moveMult);
        this.object.translateZ(this.moveVector.z * moveMult);

        this.tmpQuaternion.set(this.rotationVector.x * rotMult, this.rotationVector.y * rotMult, this.rotationVector.z * rotMult, 1).normalize();
        this.object.quaternion.multiply(this.tmpQuaternion);

        // expose the rotation vector for convenience
        //this.object.rotation.setFromQuaternion(this.object.quaternion, this.object.rotation.order);

    };

    this.updateMovementVector = function () {

        var forward = (this.moveState.forward || (this.autoForward && !this.moveState.back)) ? 1 : 0;

        this.moveVector.x = (-this.moveState.left + this.moveState.right);
        this.moveVector.y = (-this.moveState.down + this.moveState.up);
        this.moveVector.z = (-forward + this.moveState.back);

       //console.log( 'move:', [ this.moveVector.x, this.moveVector.y, this.moveVector.z ] );

    };

    this.updateRotationVector = function () {

        this.rotationVector.x = (-this.moveState.pitchDown + this.moveState.pitchUp);
        this.rotationVector.y = (-this.moveState.yawRight + this.moveState.yawLeft);
        this.rotationVector.z = (-this.moveState.rollRight + this.moveState.rollLeft);

        //console.log( 'rotate:', [ this.rotationVector.x, this.rotationVector.y, this.rotationVector.z ] );

    };

    this.getContainerDimensions = function () {

        if (this.domElement != document) {

            return {
                size: [this.domElement.offsetWidth, this.domElement.offsetHeight],
                offset: [this.domElement.offsetLeft, this.domElement.offsetTop]
            };

        } else {

            return {
                size: [window.innerWidth, window.innerHeight],
                offset: [0, 0]
            };

        }

    };

    function bind(scope, fn) {

        return function () {

            fn.apply(scope, arguments);

        };

    };

    this.domElement.addEventListener('contextmenu', function (event) { event.preventDefault(); }, false);

    //this.domElement.addEventListener('mousemove', bind(this, this.mousemove), false);
    //this.domElement.addEventListener('mousedown', bind(this, this.mousedown), false);
    window.addEventListener('click', bind(this, this.mouseshoot), false);
    window.addEventListener('click', bind(this, this.mousepick), false);
    //this.domElement.addEventListener('mouseup', bind(this, this.mouseup), false);

    window.addEventListener('keydown', bind(this, this.keydown), false);
    window.addEventListener('keyup', bind(this, this.keyup), false);

    this.updateMovementVector();
    this.updateRotationVector();

};