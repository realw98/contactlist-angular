angular.
    module('contactList').
    component('contactInfo', {

        templateUrl: 'components/contact-info/contact-info.html',
        controller: ['$scope', '$routeParams', 'ContactDataService', function($scope, $routeParams, ContactDataService) {
            $scope.contactId = parseInt($routeParams.contactId);
            $scope.contact = ContactDataService.getById($scope.contactId);

            $scope.removeContact = function(id) {
                if (confirm('Are you sure want to remove ' + $scope.contact.name + ' ?')) {
                    ContactDataService.removeContact(id);
                }

            }
        }]

    });