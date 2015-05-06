(function() {
    'use strict';

    angular
        .module('GulpWorkflow')
        .controller('ListController', ListController);

    //ListController.$inject = [''];

    /* @ngInject */
    function ListController(){
        
        var vm = this;
        vm.name = 'ListController';
        vm.items = [];
        vm.current = "value";
        
        //// INTERFACE
        vm.add = add;
        activate();

        //// IMPL
        function activate() {
            console.log("activate controller list");
        }
        
        function add(element){
            //alert("aadd"+element);
            vm.items.push(element);
            vm.current = '';
        }
        
    }
})();