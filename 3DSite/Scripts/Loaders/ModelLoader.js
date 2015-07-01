function ModelLoader() {
      
};


ModelLoader.prototype.Load = function (url, callback) {

    var data;
    var modelList = [];
    var xhr = new XMLHttpRequest();
    
    xhr.onreadystatechange = function () {
        if (xhr.readyState === xhr.DONE) {

            if (xhr.status === 200 || xhr.status === 0) {

                if (xhr.responseText) {
                    data = JSON.parse(xhr.responseText);
                    //callback(json);
                        data.Models.forEach(function (model) {

                            function loadContentComplete() {
                                if (data.Models.length == modelList.length) {
                                    gameObjectManager.Initialize(modelList);
                                };
                            }

                            switch (model.Model.loaderTypeId) {
                                case 1:
                                    var loader = new THREE.JSONLoader();
                                    var callbackModel = function (geometry, materials) { createScene(geometry, materials) };
                                    loader.load(model.Model.sourceFilePath, callbackModel);
                                    function createScene(geometry, materials) {

                                        object = new THREE.Object3D();
                                        var mesh = new THREE.Mesh(geometry, new THREE.MeshFaceMaterial(materials));
                                        object.add(mesh);
                                        var modelData = new ModelData(model.Model.modelId, object);
                                        modelList.push(modelData);
                                        loadContentComplete();
                                    }
                                    break;
                                case 2:
                                    var loader = new THREE.OBJMTLLoader();
                                    loader.load(model.Model.sourceFilePath, model.Model.mappingFilePath, function (object) {
                                        var modelData = new ModelData(model.Model.modelId, object);
                                        modelList.push(modelData);
                                        loadContentComplete();
                                    });
                                    break;
                                case 3:
                                    var manager = new THREE.LoadingManager();
                                    manager.onProgress = function (item, loaded, total) {
                                        console.log(item, loaded, total);
                                    };

                                    var texture = new THREE.Texture();

                                    var loader = new THREE.ImageLoader(manager);
                                    loader.load(model.Model.textureFilePath1, function (image) {
                                        texture.image = image;
                                        texture.needsUpdate = true;
                                    });

                                    var loader = new THREE.OBJLoader(manager);
                                    loader.load(model.Model.sourceFilePath, function (object) {
                                        object.traverse(function (child) {
                                            if (child instanceof THREE.Mesh) {
                                                child.material.map = texture;
                                            }
                                        });
                                        object.scale.set(8, 8, 8);
                                        var modelData = new ModelData(model.Model.modelId, object);
                                        modelList.push(modelData);
                                    });
                                    loadContentComplete();
                                    break;
                                default:
                                    model.Model.sourceFilePath;
                            }

                        });
                }
            }
        }
    }
    xhr.open('GET', url, false);
    xhr.send(null);
};

function ModelData(id, model) {
    this.id = id;
    this.model = model;
}