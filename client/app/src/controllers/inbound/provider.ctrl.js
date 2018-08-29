angular.module('SimpleRESTWebsite',[]).controller('ProviderCtrl',['ProviderModel','$scope',function(ProviderModel,$scope){
    var provider = this;
    provider.name = "AJay";
    provider.mapppedHeader = {};
    provider.orignalHeaders = [];
    provider.providerHeaders = [];
    provider.res = {};
    provider.alert = false;
    provider.isFTPTested =  false;
    provider.testingFTP = false;

    provider.form = {};
    provider.form.ftpHost = '195.201.243.232';
    provider.form.ftpUsername = 'test@ajayssj4.tk';
    provider.form.ftpPassword = 'password123';
    provider.headersFetched = true;
    function getOrignalHeaders(){
        ProviderModel.getOrignalHeaders()
            .then(function(response){
                for(header in response.data){
                    provider.orignalHeaders.push(header);
                }
                console.log('Orginal Headers : ' , provider.orignalHeaders);
                console.log('Provider Headers : ' , provider.orignalHeaders);
                
            });
    }
    provider.checkmapabc = function(){
        console.log("provider.mapppedHeader",provider.mapppedHeader);
    }
    provider.statusChange = function(){
        // alert('Status : ' + $scope.providerStatus)
        console.log('Status : ' + $scope.providerStatus);
        
    }

 
    provider.submitProviderForm = function(){
       provider.form.headers = provider.mapppedHeader;
       ProviderModel.submitForm(provider.form)
            .then(function(response){
                var result = response.data;
                if(result.result){
                    alert(result.msg);
                    location.reload();
                }else{
                    alert(result.msg);
                }
            });
    }
    provider.testFTPConnection = function(){
        if(!provider.form.ftpHost && !provider.form.ftpUsername && !provider.form.ftpPassword){
            alert('Enter FTP Authentication Details First!')
        }else{
            provider.testingFTP = true;
            ProviderModel.testFTPConnection(provider.form)
                .then(function(res){
                    provider.res = res.data;
                    if(provider.res.result){
                        provider.directories = provider.res.list;
                        provider.isFTPTested =  true;
                    }
                    provider.alert = true;
                    provider.testingFTP = false;

                })
        }
       
    }

    provider.getProviderHeaders =  function(){
        if(provider.isFTPTested){
           if(provider.form.directory != undefined && provider.form.filename != undefined ){
            provider.headersFetched = false;
            ProviderModel.getProviderHeaders(provider.form)
            .then(function(res){
                provider.headersFetched = true;
               if(res.data.result)
                    provider.providerHeaders = res.data.headers;
                else
                    alert(res.data.msg);
            });   
           }else{
            alert('Select FTP Directory And Filename!');
           }
          
        }else{
            alert('Connect To FTP Server First!')
        }
    }
    getOrignalHeaders();
}])