describe("ModelLoader", function () {
    var modelListPath;
    var modelLoader;
    var modelList = new Array();
    
    beforeEach(function () {
        modelListPath = "/Scripts/Specs/ModelLoadTestList.js";
        modelLoader = new ModelLoader();
        modelLoader.Load(modelListPath, function (data) {
                data.Models.forEach(
                               function (model) {
                                   modelList.push(model);
                               }
               );
        });
        
    });

    it("modelLoader should load list", function () {
        expect(modelList.length).toBe(3);

       });

});