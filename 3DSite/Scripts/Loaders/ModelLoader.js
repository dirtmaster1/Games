﻿function ModelLoader() {
      
};

ModelLoader.prototype.Load = function (url, callback) {
    this.LoadAjaxJson(url, this, callback);
};

ModelLoader.prototype.LoadAjaxJson = function (url, context, callback) {

    var json;
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState === xhr.DONE) {

            if (xhr.status === 200 || xhr.status === 0) {

                if (xhr.responseText) {
                    json = JSON.parse(xhr.responseText);
                    callback(json);
                }
            }
        }
    }
    xhr.open('GET', url, false);
    xhr.withCredentials = false;
    xhr.send(null);
};

function ModelData(id, model) {
    this.id = id;
    this.model = model;
}