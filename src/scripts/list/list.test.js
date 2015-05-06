describe('Controller: ListController', function () {

    beforeEach(module('GulpWorkflow'));

    var testController;

    beforeEach(inject(function ($controller) {
        scope = {};
        testController = $controller('ListController', {});

    }));


    it('should not have a property called vm', function () {
        expect(testController.vm).toBeUndefined();
    });

});