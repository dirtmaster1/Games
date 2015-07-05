describe("ModelLoader", function () {
    var flag = false;
    var scope = this;
    
    it("modelLoader should load list", function () {
        

        runs(function () {
            var modelListPath;
            var modelLoader;
            
            var mockGameObjectManager = { Initialize: function (modelList1) { scope.modelList1 = [1,2,3]; } };
            
            modelListPath = "/Scripts/Specs/ModelLoadTestList.js";
            modelLoader = new ModelLoader();
            modelLoader.Load(modelListPath, mockGameObjectManager);

            setTimeout(function () {
                flag = true;
            }, 4000);
        });

        waitsFor(function () {
            return flag;
        }, "The modelList was not populated", 5000);

        runs(function () {
            expect(3).toBe(scope.modelList1.length);
        });
    });
});