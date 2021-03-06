angular.module('SimpleRESTWebsite', ['angular-storage', 'ui.router','ui.bootstrap.datetimepicker'])
    .constant('ENDPOINT_URI', 'https://car-data-base.mybluemix.net/api/')
    .config(function ($stateProvider, $urlRouterProvider, $httpProvider) {
        $stateProvider
            .state('login', {
                url: '/login',
                templateUrl: 'app/templates/login.tpl.html',
                controller: 'LoginCtrl',
                controllerAs: 'login'
            })
            .state('appdashboard', {
                url: '/dashboard',
                templateUrl: 'app/templates/dashboard/appdashboard.tmpl.html',
                controller: 'appdashboardCtrl',
                controllerAs: 'appdashboard'
            })
            .state('dashboard', {
                url: '/vehicle',
                templateUrl: 'app/templates/dashboard/vehicles.tpl.html',
                controller: 'DashboardCtrl',
                controllerAs: 'dashboard'
            })
            .state('inbound/dashboard', {
                url: '/inbound/dashboard',
                templateUrl: 'app/templates/inbound/dashboard.tpl.html',
                controller: 'FeedProviderCtrl',
                controllerAs: 'feedprovider'
            })
            .state('outbound/dashboard', {
                url: '/outbound/dashboard',
                templateUrl: 'app/templates/outbound/dashboard.tpl.html',
                controller: 'FeedProviderCtrl',
                controllerAs: 'feedprovider'
            })
            .state('task', {
                url: '/task/:taskId',
                templateUrl: 'app/templates/dashboard/tasks.tpl.html',
                controller: 'TaskCtrl',
                controllerAs: 'task'
            })
            .state('inbound/add',{
                url : '/inbound/provider/feed/add',
                templateUrl : 'app/templates/inbound/addProvider.tpl.html',
                controller : 'ProviderCtrl',
                controllerAs : 'provider'
              })
              .state('outbound/add',{
                url : '/outbound/provider/feed/add',
                templateUrl : 'app/templates/outbound/addProvider.tpl.html',
                controller : 'ProviderCtrl',
                controllerAs : 'provider'
              })
            .state('inbound/list',{
                url : '/inbound/provider/feed/list',
                templateUrl : 'app/templates/inbound/feedProviders.tpl.html',
                controller : 'FeedProviderCtrl',
                controllerAs : 'feedprovider'
            })
            .state('outbound/list',{
                url : '/outbound/provider/feed/list',
                templateUrl : 'app/templates/outbound/feedProviders.tpl.html',
                controller : 'FeedProviderCtrl',
                controllerAs : 'feedprovider'
            })
            .state('inbound/schedule',{
              url : '/inbound/provider/schedule',
              templateUrl : 'app/templates/inbound/schedule.tpl.html',
              controller : 'ScheduleCtrl',
              controllerAs : 'schedule'
            })
            .state('outbound/schedule',{
                url : '/outbound/provider/schedule',
                templateUrl : 'app/templates/outbound/schedule.tpl.html',
                controller : 'FeedProviderCtrl',
                controllerAs : 'feedprovider'
              })
            .state('inbound/schedule/list',{
                url : '/inbound/provider/schedule/list',
                templateUrl : 'app/templates/inbound/feedSchedule.tpl.html',
                controller : 'ScheduleCtrl',
                controllerAs : 'schedule'
              })
              .state('outbound/schedule/list',{
                url : '/outbound/provider/schedule/list',
                templateUrl : 'app/templates/outbound/feedSchedule.tpl.html',
                controller : 'FeedProviderCtrl',
                controllerAs : 'feedprovider'
              });

        $urlRouterProvider.otherwise('/dashboard');

        $httpProvider.interceptors.push('APIInterceptor');
    })
    .service('APIInterceptor', function ($rootScope, UserService) {
        var service = this;

        service.request = function (config) {
            var currentUser = UserService.getCurrentUser(),
                access_token = currentUser ? currentUser.access_token : null;

            if (access_token) {
                config.headers.authorization = access_token;
            }
            return config;
        };

        service.responseError = function (response) {
            if (response.status === 401) {
                $rootScope.$broadcast('unauthorized');
            }
            return response;
        };
    })
    .service('UserService', function (store) {
        var service = this,
            currentUser = null;

        service.setCurrentUser = function (user) {
            currentUser = user;
            store.set('user', user);
            return currentUser;
        };

        service.getCurrentUser = function () {
            if (!currentUser) {
                currentUser = store.get('user');
            }
            return currentUser;
        };
    })
    .service('LoginService', function ($http, ENDPOINT_URI) {
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
    .service('FeedProviderModel',function($http){
        var service = this;
        service.getProvidersData = function(){
            return $http.get('/inbound/provider/data');
        }
    
        service.getTodaysProvidersData = function(){
            return $http.get('/inbound/provider/data/processed/today')
        }
    })
    .service('VehiclesModel', function ($http, ENDPOINT_URI) {
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
            return $http.post('/vehicle/add', vehicle);
        };

        service.update = function (vehicleId, vehicle) {
            return $http.put(getUrlForId(vehicleId), vehicle);
        };

        service.destroy = function (vehicleId) {
            return $http.delete(getUrlForId(vehicleId));
        };
    })
    .service('TasksModel', function ($http, ENDPOINT_URI) {
        var service = this;
        service.getAllTasks = function () {
            return $http.get('/task/get');
        }
    })
    .service('ScheduleModel', function ($http) {
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
    .service('ProviderModel',function($http){
        var service = this;
        service.getOrignalHeaders = function(){
            return $http.get('/inbound/provider/orignal/headers');
        };

        service.submitForm = function(formData){
            return $http.post('/inbound/provider/add',formData);
        }
        service.testFTPConnection = function(formData){
            return $http.post('/ftp/testconnection',{
                host : formData.ftpHost,uname : formData.ftpUsername, 
                password : formData.ftpPassword
                                        });
        }
        service.getProviderHeaders = function(formData){
            console.log(formData);
            
            return $http.post('/inbound/provider/file/headers',{
                host : formData.ftpHost, uname : formData.ftpUsername, 
                password : formData.ftpPassword, dict : formData.directory,
                filename : formData.filename
            });
        }
        
    })
    .service('fileUpload', ['$http', function ($http) {
        this.uploadFileToUrl = function (file, uploadUrl) {
            var fd = new FormData();
            fd.append('file', file);

            return $http.post('/vehicle/uploadcsv', fd, {
                transformRequest: angular.identity,
                headers: { 'Content-Type': undefined }
            });
        }
    }])
    .directive('fileModel', ['$parse', function ($parse) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                var model = $parse(attrs.fileModel);
                var modelSetter = model.assign;

                element.bind('change', function () {
                    scope.$apply(function () {
                        modelSetter(scope, element[0].files[0]);
                    });
                });
            }
        };
    }])
    .controller('FeedProviderCtrl', ['FeedProviderModel',function (FeedProviderModel) {
        var feedprovider = this;
        feedprovider.providers = [];
        feedprovider.todaysProviders = [];
        feedprovider.getProvidersData = function(){
            FeedProviderModel.getProvidersData()
                    .then(function(response){
                        console.log(response.data);
                        feedprovider.providers = response.data;
                    });
        }
        feedprovider.getTodaysProvidersData = function(){
            FeedProviderModel.getTodaysProvidersData()
                .then(function(response){
                    feedprovider.todaysProviders = response.data;
                })
        }
        feedprovider.utcToLocalTime = function(time){
            return moment(moment(moment(time).format('YYYY-MM-DD HH:mm:ss ')).toDate()).format('YYYY-MM-DD HH:mm:ss ');  
        }

       
        feedprovider.hi = function(){
            alert('Hi');
        }

    }])
    .controller('LoginCtrl', function ($rootScope, $state, LoginService, UserService) {
        var login = this;
        console.log("login controller");
        function signIn(user) {
            LoginService.login(user)
                .then(function (response) {
                    user.access_token = response.data.id;
                    UserService.setCurrentUser(user);
                    $rootScope.$broadcast('authorized');
                    $state.go('dashboard');
                });
        }

        function register(user) {
            LoginService.register(user)
                .then(function (response) {
                    login(user);
                });
        }

        function submit(user) {
            login.newUser ? register(user) : signIn(user);
        }

        login.newUser = false;
        login.submit = submit;
    })
    .controller('MainCtrl', function ($rootScope, $state, LoginService, UserService) {
        var main = this;

        console.log("main controller")
        function logout() {
            LoginService.logout()
                .then(function (response) {
                    main.currentUser = UserService.setCurrentUser(null);
                    $state.go('login');
                }, function (error) {
                    console.log(error);
                });
        }

        $rootScope.$on('authorized', function () {
            main.currentUser = UserService.getCurrentUser();
        });

        $rootScope.$on('unauthorized', function () {
            main.currentUser = UserService.setCurrentUser(null);
            $state.go('login');
        });

        main.logout = logout;
        main.currentUser = UserService.getCurrentUser();


    })
    .controller('appdashboardCtrl', ['TasksModel', function (TasksModel, $rootScope, $state, LoginService, UserService) {
        var appdashboard = this;
        // tasks = [];
        var getAllTasks = function () {
            TasksModel.getAllTasks()
                .then(function (response) {
                    appdashboard.tasks = response.data;
                })
        };
        getAllTasks();

    }])
    .controller('TaskCtrl', ['VehiclesModel', '$scope', '$state', '$stateParams', function (VehiclesModel, $scope, $state, $stateParams) {
        var task = this;
        task.loading = true;
        function getVehicles() {
            VehiclesModel.getTasksVehicles($stateParams.taskId)
                .then(function (response) {
                    task.loading = false;
                    task.vehicles = response.data;

                })
        }
        $scope.utcToLocalTime = function(time){
            return moment(moment(moment(time).format('YYYY-MM-DD HH:mm:ss ')).toDate()).format('YYYY-MM-DD HH:mm:ss ');  
        }
        getVehicles();
    }])
    .controller('ScheduleCtrl', ['ScheduleModel', function (ScheduleModel) {
        $('#sDate,#eDate').datetimepicker();
        $('#sDate').on('dp.change', function(e){  
           /*  var incrementDay = moment(new Date(e.date));
            // incrementDay.add(1, 'days');
            $('#eDate').data('DateTimePicker').minDate(incrementDay); */
            // $(this).data("DateTimePicker").hide();
            schedule.form.startDate = $('#sDate input').val(); 

        });
        $('#eDate').on('dp.change', function(e){  
            var decrementDay = moment(new Date(e.date));
            // decrementDay.subtract(1, 'days');
            $('#sDate').data('DateTimePicker').maxDate(decrementDay);
            // $(this).data("DateTimePicker").hide();
            schedule.form.endDate = $('#eDate input').val(); 
        });
        var schedule = this;
        schedule.loading = false;
        var date =  moment(new Date());
        schedule.form = {};
        schedule.form.startDate = date.format('MM/DD/YYYY h:mm A');
        schedule.form.endDate = date.add(1,'days').format('MM/DD/YYYY h:mm A');
        schedule.res = {};
        schedule.providers = [];
        schedule.scheduleJob = function() {
            schedule.loading = true;
            schedule.form.utcStartDate = moment.utc(new Date(schedule.form.startDate)).format('YYYY-MM-DD HH:mm:ss');       
            console.log('Form Data ' ,  schedule.form);
            ScheduleModel.scheduleJob(schedule.form)
                .then(function (res) {
                    schedule.loading = false;
                    schedule.res = res.data;
                    if(res.data.result){
                        alert(res.data.msg);
                        window.location.href = '#/inbound/provider/schedule/list';
                    }
                    
                })
        };
        schedule.getProviders = function(){
            ScheduleModel.getProviders()
                .then(function(res){
                    console.log('response : ', res.data);
                    
                    schedule.providers = res.data;
                })
        }
        schedule.getProvidersScheduleData = function(){
            ScheduleModel.getProvidersScheduleData()
                .then(function(res){
                    if(res.data.result)
                        schedule.providers = res.data.data;
                    else
                        alert(res.data.msg);
                })
        }
        schedule.utcToLocalTime = function(time){
            return moment(moment(moment(time).format('YYYY-MM-DD HH:mm:ss ')).toDate()).format('YYYY-MM-DD HH:mm:ss ');  
        }
        schedule.cancelJob = function(id){
            ScheduleModel.cancelJob(id)
                .then(function(res){
                    if(res.data.result){
                        alert(res.data.msg);
                        location.reload();
                    }
                })
        }
        schedule.getIntervals = function(value){
            var intervals  = {
               24 : 'Every 24 Hours',
               12 : 'Every 12 Hours' ,
               6 : 'Every 6 Hours',
               100 : 'Every 1 Minute',
            }   

            return intervals[value];
          
       }
        
    }])
    .controller('ProviderCtrl',['ProviderModel','$scope',function(ProviderModel,$scope){
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
    .controller('DashboardCtrl', ['VehiclesModel', 'fileUpload', function (VehiclesModel, fileUpload) {

        var dashboard = this;
        $.validate({
            modules : 'security',
            form : '#vehicleForm',
            onSuccess : function(form){
                alert('Success');
                dashboard.createVehicle(dashboard.newVehicle);
                return false;
            },
            onError :function(err){
                alert('Error', err)
            }
        });
        dashboard.uploadTxt = 'Upload';
        dashboard.uploading = false;
        console.log("dashboard controller")
        function uploadFile() {
            console.log("asdsad");
            var file = dashboard.myFile;
            console.log('File', file);
            
            if(!file){
                alert('Please Select File !');
            }else{
                dashboard.uploading = true;
            dashboard.uploadTxt = 'Uploading...';

            console.log('file is ');
            console.dir(file);

            var uploadUrl = "/fileUpload";
            fileUpload.uploadFileToUrl(file, uploadUrl)
                .success(function (data) {
                    dashboard.uploading = false;
                    dashboard.uploadTxt = 'Upload';

                    console.log("data", data);
                    alert("file uploaded successfully");
                })

                .error(function (data) {
                    console.log("data", data);
                    alert("error uploading file")
                });
            }
            
        };

        dashboard.uploadFile = uploadFile;

        function getVehicles() {
            VehiclesModel.all()
                .then(function (result) {
                    dashboard.vehicles = result.data;
                });
        }

        function createVehicle(vehicle) {
            VehiclesModel.create(vehicle)
                .then(function (res) {
                    alert(res.data.msg);
                    if(res.data.result){
                        initCreateForm();
                    }
                });
        }

        function updateVehicle(vehicle) {
            VehiclesModel.update(vehicle.id, vehicle)
                .then(function (result) {
                    cancelEditing();
                    getVehicles();
                });
        }

        function deleteVehicle(vehicleId) {
            VehiclesModel.destroy(vehicleId)
                .then(function (result) {
                    cancelEditing();
                    getVehicles();
                });
        }

        function initCreateForm() {
            dashboard.newVehicle = {
                DealerId: '', dealerName: '', dealerAddress: '',
                dealerCity: '',
                dealerState: '',
                dealerZip: '',
                dealerTagline: '',
                vehicleClassification: '',
                vehicleCertifiedFlag: '',
                vehicleFactoryWarrantyFlag: '',
                vehicleDealerWarrantyFlag: '',
                vehicleExtendedWarrantyAv1Flag: '',
                vehicleAutoCheckFlag: '',
                vehicleCondition: '',
                vehicleVinNumber: '',
                vehicleStockNuber: '',
                vehicleYear: '',
                vehicleMake: '',
                vehicleModel: '',
                vehicleTrim: '',
                vehicleMileage: '',
                vehicleMSRP: '',
                vehicleRetailWholesaleValue: '',
                vehicleInvoiceAmount: '',
                vehiclePackAmount: '',
                vehicleTotalCost: '',
                vehicleSellingPrice: '',
                vehicleEngineDisplacementCI: '',
                vehicleEngineCyl: '',
                vehicleEngineHP: '',
                vehicleHPRPM: '',
                vehicleEngineTorque: '',
                vehicleTorqueRPM: '',
                vehicleTransmissionType: '',
                vehicleTransmissionGears: '',
                vehicleTransmissionName: '',
                vehicleCityMPG: '',
                vehicleHwyMPG: '',
                vehicleFuelTankCapacity: '',
                vehicleExteriorColor: '',
                vehicleInteriorColor: '',
                vehicleOptionalEquipment: '',
                vehicleComments: '',
                vehicleAdTitle: '',
                vehicleVideoURL: '',
                vehicleImgURL: '',
                vehicleImgURL2: '',
                vehicleImgURL3: '',
                vehicleImageURLModifiedDate: '',
                vehicleDetailLink: ''
            };
        }

        function setEditedVehicle(vehicle) {
            dashboard.editedVehicle = angular.copy(vehicle);
            dashboard.isEditing = true;
        }

        function isCurrentVehicle(vehicleId) {
            return dashboard.editedVehicle !== null && dashboard.editedVehicle.id === vehicleId;
        }

        function cancelEditing() {
            dashboard.editedVehicle = null;
            dashboard.isEditing = false;
        }



        dashboard.vehicles = [];
        dashboard.editedVehicle = null;
        dashboard.isEditing = false;
        dashboard.getVehicles = getVehicles;
        dashboard.createVehicle = createVehicle;
        dashboard.updateVehicle = updateVehicle;
        dashboard.deleteVehicle = deleteVehicle;
        dashboard.setEditedVehicle = setEditedVehicle;
        dashboard.isCurrentVehicle = isCurrentVehicle;
        dashboard.cancelEditing = cancelEditing;

        initCreateForm();
        // getVehicles();


    }])
    .constant('weblogngConfig', {
        apiKey: '',
        options: {
            publishNavigationTimingMetrics: true,
            publishUserActive: true,
            application: 'simple-rest-website'
        }
    })
    ;
