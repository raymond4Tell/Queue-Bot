'use strict';

// Google Analytics Collection APIs Reference:
// https://developers.google.com/analytics/devguides/collection/analyticsjs/

angular.module('app.controllers', [])

    // Path: /
    .controller('HomeCtrl', ['$scope', '$location', '$window', function ($scope, $location, $window) {
        $scope.$root.title = 'AngularJS SPA Template for Visual Studio';
        $scope.$on('$viewContentLoaded', function () {
            $window.ga('send', 'pageview', { 'page': $location.path(), 'title': $scope.$root.title });
        });
    }])

    // Path: /about
    .controller('AboutCtrl', ['$scope', '$location', '$window', function ($scope, $location, $window) {
        $scope.$root.title = 'AngularJS SPA | About';
        $scope.$on('$viewContentLoaded', function () {
            $window.ga('send', 'pageview', { 'page': $location.path(), 'title': $scope.$root.title });
        });
    }])

    // Path: /login
    .controller('LoginCtrl', ['$scope', '$location', '$window', function ($scope, $location, $window) {
        $scope.$root.title = 'AngularJS SPA | Sign In';
        // TODO: Authorize a user
        $scope.login = function () {
            $location.path('/');
            return false;
        };
        $scope.$on('$viewContentLoaded', function () {
            $window.ga('send', 'pageview', { 'page': $location.path(), 'title': $scope.$root.title });
        });
    }])

    //My QBot API.
    .controller('TaskListCtrl', ['$scope', '$location', '$window', "$http", function ($scope, $location, $window, $http) {
        $scope.$root.title = 'Job Listing';

        /* 
         * Really tempted to have the API just send the full Program state on each go;
         * we need to update jobListing and AverageWait on just about every call, and as it stands
         * we keep getting caught on synchrony problems, like BEWT being received before the JobQueue
         * is fully stocked.
         */
        $scope.jobListing = [];
        $http.get("api/TaskList/GetCustomers").success(function (data) {
            $scope.jobListing = data;
        });

        $scope.availableServices = [];
        $http.get("api/TaskList/GetServices").success(function (data) {
            $scope.availableServices = data;
        });

        $scope.AverageWait = 0;
        $http.get("api/TaskList/GetBEWT").success(function (data) {
            $scope.AverageWait = data;
        });

        $scope.Balance = 0;
        $http.get("api/TaskList/GetBalance").success(function (data) {
            $scope.Balance = data;
        });

        $scope.newJobData = {};
        $scope.addJob = function () {
            $http.post("api/TaskList/NewCustomer", $scope.newJobData).success(function (data) {
                $scope.jobListing = data;
                $http.get("api/TaskList/GetBEWT").success(function (data) {
                    $scope.AverageWait = data;
                });
            });
        };
        $scope.nextCustomer = {};
        $scope.popJob = function () {
            $http.get("api/TaskList/RemoveCustomer").success(function (data) {
                $scope.nextCustomer = data;
                $http.get("api/TaskList/GetCustomers").success(function (data) {
                    $scope.jobListing = data;
                });
                $http.get("api/TaskList/GetBalance").success(function (data) {
                    $scope.Balance = data;
                });
                $http.get("api/TaskList/GetBEWT").success(function (data) {
                    $scope.AverageWait = data;
                });
            });
        };
        $scope.$on('$viewContentLoaded', function () {
            $window.ga('send', 'pageview', { 'page': $location.path(), 'title': $scope.$root.title });
        });
    }])


    // Path: /error/404
    .controller('Error404Ctrl', ['$scope', '$location', '$window', function ($scope, $location, $window) {
        $scope.$root.title = 'Error 404: Page Not Found';
        $scope.$on('$viewContentLoaded', function () {
            $window.ga('send', 'pageview', { 'page': $location.path(), 'title': $scope.$root.title });
        });
    }]);