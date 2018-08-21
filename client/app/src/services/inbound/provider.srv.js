angular.module('SimpleRESTWebsite',[]).service('ProviderService',function($http){
    var service = this;
    service.getOrignalHeaders = function(){
        return $http.get('/getOrignalHeaders');
    };

    service.submitForm = function(formData){
        return $http.post('/addProvider',formData);
    }
    service.testFTPConnection = function(formData){
        return $http.post('/testFTP',{
            host : formData.ftpHost,uname : formData.ftpUsername, 
            password : formData.ftpPassword
                                    });
    }
    service.getProviderHeaders = function(formData){
        console.log(formData);
        
        return $http.post('/getProviderHeaders',{
            host : formData.ftpHost, uname : formData.ftpUsername, 
            password : formData.ftpPassword, dict : formData.directory,
            filename : formData.filename
        });
    }
    service.getProvidersData = function(){
        return $http.get('/getProvidersData');
    }
    
})