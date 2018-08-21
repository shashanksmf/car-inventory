angular.module('SimpleRESTWebsite',[]).service('DashboardService', function ($http, ENDPOINT_URI) {
    var service = this,
        path = 'vehicles/';

    function getUrl() {
        return ENDPOINT_URI + path;
    }

    function getUrlForId(vehicleId) {
        return getUrl(path) + vehicleId;
    }

    service.all = function () {
        return $http.get(getUrl());
    };

    service.fetch = function (vehicleId) {
        return $http.get(getUrlForId(vehicleId));
    };
    service.getTasksVehicles = function (taskId) {
        return $http.get('/task/' + taskId);
    }
    service.create = function (vehicle) {
        return $http.post('/vehicles', vehicle);
    };

    service.update = function (vehicleId, vehicle) {
        return $http.put(getUrlForId(vehicleId), vehicle);
    };

    service.destroy = function (vehicleId) {
        return $http.delete(getUrlForId(vehicleId));
    };
})