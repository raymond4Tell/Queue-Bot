'use strict';

// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('app.services', [])
    .value('version', '0.1')
    .service('User', ['$http', function User($http) {
        var userData = {
            isAuthenticated: false,
            username: '',
            bearerToken: '',
            expirationDate: null,
        };

        this.getUserData = function () {
            return userData;
        }
        function clearUserData() {
            userData.isAuthenticated = false;
            userData.username = '';
            userData.bearerToken = '';
            userData.expirationDate = null;
        }

        function setHttpAuthHeader() {
            $http.defaults.headers.common.Authorization = 'Bearer ' + userData.bearerToken;
        }

        this.removeAuthentication = function () {
            clearUserData();
            $http.defaults.headers.common.Authorization = null;
        };

        this.authenticate = function (username, password, successCallback, errorCallback) {
            var config = {
                method: 'POST',
                url: 'http://localhost:8080/token',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                data: 'grant_type=password&username=' + username + '&password=' + password,
            };

            $http(config)
              .success(function (data) {
                  userData.isAuthenticated = true;
                  userData.username = data.userName;
                  userData.bearerToken = data.access_token;
                  userData.expirationDate = new Date(data['.expires']);
                  setHttpAuthHeader();
                  if (typeof successCallback === 'function') {
                      successCallback();
                  }
              })
              .error(function (data) {
                  if (typeof errorCallback === 'function') {
                      if (data.error_description) {
                          errorCallback(data.error_description);
                      } else {
                          errorCallback('Unable to contact server; please, try again later.');
                      }
                  }
              });
        };

    }]);