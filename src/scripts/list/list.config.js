(function () {
    'use strict';

    angular
        .module('GulpWorkflow')
        .config(configuration);

    configuration.$inject = ['$routeProvider'];

    /* @ngInject */
    function configuration($routeProvider) {
        $routeProvider
            .when('/list', {
                templateUrl: '/scripts/list/list.view.html',
                controller: 'ListController',
                controllerAs: 'vm'
            })
            .otherwise ({
                redirectTo: '/list'
            });
    }

})();