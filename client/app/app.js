angular.module('SimpleRESTWebsite', ['angular-storage', 'ui.router'])
    .constant('ENDPOINT_URI', 'https://car-data-base.mybluemix.net/api/')
    .config(function ($stateProvider, $urlRouterProvider, $httpProvider) {
        $stateProvider
            .state('login', {
                url: '/login',
                templateUrl: 'app/templates/login.tmpl.html',
                controller: 'LoginCtrl',
                controllerAs: 'login'
            })
            .state('appdashboard', {
                url: '/dashboard',
                templateUrl: 'app/templates/appdashboard.tmpl.html',
                controller: 'appdashboardCtrl',
                controllerAs: 'appdashboard'
            })
            .state('dashboard', {
                url: '/vehicle',
                templateUrl: 'app/templates/dashboard.tmpl.html',
                controller: 'DashboardCtrl',
                controllerAs: 'dashboard'
            })
            .state('task', {
                url: '/task/:taskId',
                templateUrl: 'app/templates/vehicles.html',
                controller: 'TaskCtrl',
                controllerAs: 'task'
            })
            .state('inbound',{
              url : '/inbound',
              templateUrl : 'app/templates/inboundHome.html',
              controller : 'ProviderCtrl',
              controllerAs : 'provider'
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
            return $http.post('/vehicles', vehicle);
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
            return $http.get('/tasks');
        }
    })
    .service('ProviderModel',function($http){
        var service = this;
        service.getOrignalHeaders = function(){
            return $http.get('/getOrignalHeaders');
        };

        service.submitForm = function(formData){
            return $http.post('/providerData',formData);
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
        
    })
    .service('fileUpload', ['$http', function ($http) {
        this.uploadFileToUrl = function (file, uploadUrl) {
            var fd = new FormData();
            fd.append('file', file);

            return $http.post('/uploadcsv', fd, {
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
        getVehicles();
    }])
    .controller('ProviderCtrl',['ProviderModel','$scope',function(ProviderModel,$scope){
        var provider = this;
        provider.name = "AJay";
        provider.mapppedHeader = {};
        provider.orignalHeaders = [];
        provider.providerHeaders = [];
        provider.res = {};
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
                    console.log(JSON.stringify(response.data));
                });
        }
        provider.testFTPConnection = function(){
            ProviderModel.testFTPConnection(provider.form)
                .then(function(res){
                    provider.res = res.data;
                    if(provider.res.result)
                        provider.directories = provider.res.list;
                })
        }

        provider.getProviderHeaders =  function(){
             ProviderModel.getProviderHeaders(provider.form)
                .then(function(res){
                   provider.providerHeaders = res.data;
                });   
        }
        getOrignalHeaders();
    }])
    .controller('DashboardCtrl', ['VehiclesModel', 'fileUpload', function (VehiclesModel, fileUpload) {

        var dashboard = this;
        dashboard.uploadTxt = 'Upload';
        dashboard.uploading = false;
        console.log("dashboard controller")
        function uploadFile() {
            console.log("asdsad");
            var file = dashboard.myFile;
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
                .then(function (result) {
                    initCreateForm();
                    getVehicles();
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
        getVehicles();


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
