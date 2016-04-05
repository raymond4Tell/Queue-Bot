'use strict';

// Google Analytics Collection APIs Reference:
// https://developers.google.com/analytics/devguides/collection/analyticsjs/

angular.module('app.controllers', ["SignalR"])

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

    //Path: None; used for the header and login.
    .controller('HeaderCtrl', ['$scope', 'User', function ($scope, User) {
        $scope.user = User.getUserData();
    }])

    // Path: /login
    .controller('LoginCtrl', ['$scope', '$location', '$window', "$state", "User", function ($scope, $location, $window, $state, User) {
        $scope.$root.title = 'AngularJS SPA | Sign In';
        $scope.username = '';
        $scope.password = '';
        $scope.errors = [];


        function disableLoginButton(message) {
            if (typeof message !== 'string') {
                message = 'Attempting login...';
            }
            jQuery('#login-form-submit-button').prop('disabled', true).prop('value', message);
        }

        function enableLoginButton(message) {
            if (typeof message !== 'string') {
                message = 'Submit';
            }
            jQuery('#login-form-submit-button').prop('disabled', false).prop('value', message);
        }

        function onSuccessfulLogin() {
            $state.go('home');
        }

        function onFailedLogin(error) {
            if (typeof error === 'string' && $scope.errors.indexOf(error) === -1) {
                $scope.errors.push(error);
            }
            enableLoginButton();
        }

        $scope.login = function () {
            disableLoginButton();
            User.authenticate($scope.username, $scope.password, onSuccessfulLogin, onFailedLogin);
        };

        $scope.$on('$viewContentLoaded', function () {
            $window.ga('send', 'pageview', { 'page': $location.path(), 'title': $scope.$root.title });
        });
    }])
     .controller('LogoutCtrl', ['$state', 'User', function ($state, User) {
         User.removeAuthentication();
         $state.go('main');
     }])
    //JobHub for use with SignalR
    .factory("JobData", ['$rootScope', "$http", 'Hub', function ($rootScope, $http, Hub) {
        var JobJunk = this;
        JobJunk.all = [];
        JobJunk.connected = [];

        var JobData = new Hub("JobList", {
            listeners: {
                'newConnection': function (id) {
                    JobJunk.connected.push(id);
                    $rootScope.$apply();
                },
                'removeConnection': function (id) {
                    JobJunk.connected.splice(JobJunk.connected.indexOf(id), 1);
                    $rootScope.$apply();
                },
                'lockEmployee': function (id) {
                    var employee = find(id);
                    employee.Locked = true;
                    $rootScope.$apply();
                },
                'unlockEmployee': function (id) {
                    var employee = find(id);
                    employee.Locked = false;
                    $rootScope.$apply();
                },
                'updatedEmployee': function (id, key, value) {
                    var employee = find(id);
                    employee[key] = value;
                    $rootScope.$apply();
                },
                'refreshJobs': function (jobQueue) {
                    JobJunk.all = jobQueue;
                    $rootScope.$apply();
                },
                'removeEmployee': function (id) {
                    var employee = find(id);
                    JobJunk.all.splice(JobJunk.all.indexOf(employee), 1);
                    $rootScope.$apply();
                }
            },
            methods: [
               "lock", "unlock"
            ]
        });
        //rootPath: ""
        var find = function (id) {
            for (var i = 0; i < JobJunk.all.length; i++) {
                if (JobJunk.all[i].Id === id) return JobJunk.all[i];
            }
            return null;
        };

        JobJunk.add = function () {
            webApi.post({ Name: 'New', Email: 'New', Salary: 1 });
        }
        JobJunk.edit = function (employee) {
            employee.Edit = true;
            hub.lock(employee.Id);
        }
        JobJunk.delete = function (employee) {
            webApi.remove({ id: employee.Id });
        }
        JobJunk.patch = function (employee, key) {
            var payload = {};
            payload[key] = employee[key];
            webApi.patch({ id: employee.Id }, payload);
        }
        JobJunk.done = function (employee) {
            employee.Edit = false;
            hub.unlock(employee.Id);
        }

        //Load
        JobJunk.all = $http.get("api/TaskList/GetCustomers").success(function (data) {
            JobJunk.all = data;
        });
        return JobJunk;
    }])
    //My QBot API.
    .controller('TaskListCtrl', ['$scope', '$location', '$window', "$http", "JobData", function ($scope, $location, $window, $http, JobData) {
        $scope.$root.title = 'Job Listing';

        /* 
         * Really tempted to have the API just send the full Program state on each go;
         * we need to update jobListing and AverageWait on just about every call, and as it stands
         * we keep getting caught on synchrony problems, like BEWT being received before the JobQueue
         * is fully stocked.
         */
        $scope.JobHub = JobData;


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