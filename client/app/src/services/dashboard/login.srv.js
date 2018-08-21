angular.module('SimpleRESTWebsite',[]).service('LoginService', function ($http, ENDPOINT_URI) {
    var service = this,
        path = 'Users/';

    function getUrl() {
        return ENDPOINT_URI + path;
    }

    function getLogUrl(action) {
        return getUrl() + action;
    }

    service.login = function (credentials) {
        return $http.post(getLogUrl('login'), credentials);
    };

    service.logout = function () {
        return $http.post(getLogUrl('logout'));
    };

    service.register = function (user) {
        return $http.post(getUrl(), user);
    };
})