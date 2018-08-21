angular.module('SimpleRESTWebsite',[]).service('ScheduleService', function ($http) {
    var service = this;
    service.scheduleJob = function (formData) {
        return $http.post('/inbound/scheduleJob',formData);
    }
    service.getProviders = function(){
        return $http.get('/inbound/scheduleJob/getProviders');
    }
})