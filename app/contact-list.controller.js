angular.
    module('contactList').
    controller('contactListController', ['$scope', 'ContactDataService', function($scope, ContactDataService) {

        console.log('controller works');
        //register us as a visitor, to recieve notifications and update data
        ContactDataService.registerVisitor(this);

        var self = this;

        //field for ordering contacts in list
        self.orderField = "id";

        //fields for contact filtering in list
        $scope.filterFields = {};

        this.visit = function() {
            ContactDataService.getContactListData().then(function(contacts) {
                $scope.contactList = contacts;
                console.log('controller::visit()');
            })
        };

        //update data right now
        this.visit();


        //clear filterFields
        $scope.clearFilterFields = function() {
            $scope.filterFields = {};
        };

        $scope.setFilter = function(filterFields) {
            console.log('setFilter', filterFields);
            $scope.filterFields = filterFields;
        };

        $scope.filtersEmpty = function() {
            var ff = $scope.filterFields;
            return !ff.name && !ff.username && !ff.companyName;
        }

    }]).

/**
 * Filter used for searching contacts
 * filterFields is an object with 3 fields: name, username and companyName
 */

    filter('searchFilter', function() {

        return function (items, filterFields) {

            if (!filterFields) return items;

            var filtered = [];
            var matchName, matchUsername, matchCompanyName;

            for (var i = 0, item; item = items[i]; i++) {
                //no field in filterFields means always match
                matchName = !filterFields.name ||
                            (item.name.toLowerCase().indexOf(filterFields.name.toLowerCase()) != -1);

                matchUsername = !filterFields.username ||
                            (item.username.toLowerCase().indexOf(filterFields.username.toLowerCase()) != -1);

                matchCompanyName = !filterFields.companyName ||
                            (item.company.name.toLowerCase().indexOf(filterFields.companyName.toLowerCase()) != -1);

                if (matchName && matchUsername && matchCompanyName) {
                    filtered.push(item);
                }

            }
            return filtered;
        };
    });
