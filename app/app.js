'use strict';

//Declare app level module with dependency on ngRoute
var contactListApp = angular.
        module('contactList',[
        'ngRoute'
    ]).

//router configuration
    config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
        $locationProvider.hashPrefix('!');

        $routeProvider.
            when('/home', {
                template: '<span>Select contact to view info</span>'
            }).
            when('/contact/:contactId', {
                template: '<contact-info></contact-info>'
            }).
            when('/edit-contact/:contactId', {
                template: '<contact-editor></contact-editor>'
            }).
            when('/search-contact', {
                template: '<search-contact></search-contact>'
            }).
            otherwise({redirectTo: '/home'});
    }]).

//ContactDataService is responsible for storing contact list data, synchronization with local storage and notifying about changes in data
    factory('ContactDataService', ['$http', '$q', function($http, $q) {

        //Visitor pattern to notify all controllers about data change
        var _visitors = [];
        var registerVisitor = function (visitor) {
            _visitors.push(visitor);
        };
        var _notifyAllVisitors = function() {
            for (var i= 0, visitor; visitor = _visitors[i]; i++) {
                angular.isFunction(visitor.visit) && visitor.visit();
            }
        };


        //Storage for all contact list information
        var _contactListData = null;

        //This function should be async, so it returns promise
        var getContactListData = function(){

            var deferred = $q.defer();

            //if we already have data loaded then just resolve deferred and return it
            if (_contactListData !== null){
                deferred.resolve(_contactListData);
                return deferred.promise;
            }

            //data not loaded yet, but exists in localstorage, load data and resolve deferred
            var localStorageValue = localStorage.getItem('ContactListData');

            if (localStorageValue) {
                _contactListData = JSON.parse(localStorageValue);
                deferred.resolve(_contactListData);
                return deferred.promise;
            }

            //at this point, our last hope is to get data from server
            $http.get('init_data/users.json').then(
                function(response){
                    //success
                    console.log('$http.get success');
                    localStorage.setItem('ContactListData', JSON.stringify(response.data));
                    deferred.resolve(response.data);
                },
                function(response) {
                    //failure
                    deferred.reject(response.status);
                }
            );

            return deferred.promise;
        };

        var getById = function(contactId) {
            for (var i=_contactListData.length; i--;) {
                if (_contactListData[i].id === contactId) {
                    return _contactListData[i];
                }
            }
        };

        var _updateLocalStorage = function() {
            localStorage.setItem('ContactListData', JSON.stringify(_contactListData));
        };

        var saveContact = function(contactData) {

            var contact = getById(contactData.id);
            //update existing contact with new data
            for (var field in contactData) {
                contact[field] = contactData[field];
            }
            _notifyAllVisitors();
            _updateLocalStorage();
        };

        var addContact = function(contactData) {
            //add new contact to storage
            _contactListData.push(contactData);
            _notifyAllVisitors();
            _updateLocalStorage();
        };

        var removeContact = function(contactId) {
            //remove contact from storage and save data and notify
            for (var i=_contactListData.length; i--;) {
                if (_contactListData[i].id === contactId) {
                    _contactListData.splice(i, 1);
                    break;
                }
            }
            _notifyAllVisitors();
            _updateLocalStorage();
        };

        var getNextId = function() {
            var nextId = 0;
            for (var i= 0, contact; contact = _contactListData[i]; i++) {
                nextId = Math.max(nextId, contact.id);
            }
            return ++nextId;
        };


        return {
            registerVisitor: registerVisitor,
            getContactListData: getContactListData,
            addContact: addContact,
            removeContact: removeContact,
            saveContact: saveContact,
            getById: getById,
            getNextId: getNextId
        }

    }]);






