angular.module('SimpleRESTWebsite',[]).controller('ProviderCtrl',['ProviderService','$scope','$stateParams',function(ProviderService,$scope,$stateParams){
    var provider = this;
    provider.name = "AJay";
    provider.mapppedHeader = {};
    provider.orignalHeaders = [];
    provider.providerHeaders = [];
    provider.providers = [];
    provider.res = {};
    provider.alert = false;
    provider.isFTPTested =  false;
    provider.testingFTP = false;

    provider.getOrignalHeaders = function(){
        ProviderService.getOrignalHeaders()
            .then(function(response){
                for(header in response.data){
                    provider.orignalHeaders.push(header);
                }
                console.log('Orginal Headers : ' , provider.orignalHeaders);
                console.log('Provider Headers : ' , provider.orignalHeaders);
                
            });
    }

    provider.getProvidersData = function(){
        ProviderService.getProvidersData()
        .then(function(response){
            console.log(response.data);
            provider.providers = response.data;
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
       ProviderService.submitForm(provider.form)
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
        provider.testingFTP = true;
        ProviderService.testFTPConnection(provider.form)
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

    provider.getProviderHeaders =  function(){
        if(provider.isFTPTested){
           if(provider.form.directory != undefined && provider.form.filename != undefined ){
            ProviderService.getProviderHeaders(provider.form)
            .then(function(res){
               provider.providerHeaders = res.data;
            });   
           }else{
            alert('Select FTP Directory And Filename!');
           }
          
        }else{
            alert('Connect To FTP Server First!')
        }
    }

    if($stateParams.ctrl)
        provider.getProvidersData();
    else
        provider.getOrignalHeaders();
}])