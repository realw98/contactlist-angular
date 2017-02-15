angular.
    module('contactList').
    component('searchContact', {

        templateUrl: 'components/search-contact/search-contact.html',
        controller: ['$scope', function($scope, $routeParams, ContactDataService) {
            $scope.filterFields = $scope.$parent.filterFields;

        }]

    });