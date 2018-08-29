angular.module('SimpleRESTWebsite',[]).service('ProviderModel',function($http){
    var service = this;
    service.getOrignalHeaders = function(){
        return $http.get('/provider/orignal/headers');
    };

    service.submitForm = function(formData){
        return $http.post('/provider/add',formData);
    }
    service.testFTPConnection = function(formData){
        return $http.post('/ftp/testconnection',{
            host : formData.ftpHost,uname : formData.ftpUsername, 
            password : formData.ftpPassword
                                    });
    }
    service.getProviderHeaders = function(formData){
        console.log(formData);
        
        return $http.post('/provider/file/headers',{
            host : formData.ftpHost, uname : formData.ftpUsername, 
            password : formData.ftpPassword, dict : formData.directory,
            filename : formData.filename
        });
    }
    
})