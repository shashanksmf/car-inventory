angular.module('SimpleRESTWebsite',[]).service('ScheduleModel', function ($http) {
    var service = this;
    service.scheduleJob = function (formData) {
        return $http.post('/inbound/schedule/job',formData);
    }
    service.getProviders = function(){
        return $http.get('/inbound/schedule/providers');
    }
    service.getProvidersScheduleData = function(){
        return $http.get('/inbound/schedule/providers/data');
    }
    service.cancelJob = function(id){
        return $http.get('/inbound/schedule/job/cancel/' + id);
    }
})