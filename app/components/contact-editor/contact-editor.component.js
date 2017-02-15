angular.
    module('contactList').
    component('contactEditor', {

        templateUrl: 'components/contact-editor/contact-editor.html',
        controller: ['$scope', '$routeParams', 'ContactDataService', function($scope, $routeParams, ContactDataService) {
            $scope.isNewContact = ($routeParams.contactId === 'new');

            console.log('isNewContact', $scope.isNewContact);

            if ($scope.isNewContact) {
                $scope.contactId = ContactDataService.getNextId();
            } else {
                $scope.contactId = parseInt($routeParams.contactId);
                //Pass the deep copy of contact to contact-editor, so we can always cancel editing
                $scope.contact = Object.create(ContactDataService.getById($scope.contactId));
            }


            $scope.addContact = function () {
                var contact = $scope.contact;
                contact.id = $scope.contactId;
                console.log('adding contact', contact, $scope);
                ContactDataService.addContact(contact);
            };

            $scope.saveContact = function () {
                var contact = $scope.contact;
                contact.id = $scope.contactId;
                console.log('saving contact', contact, $scope)
                ContactDataService.saveContact(contact);
            };

        }]

    });