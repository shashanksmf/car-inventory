angular.module('SimpleRESTWebsite',[]).config(function ($stateProvider, $urlRouterProvider, $httpProvider) {
    $stateProvider
        .state('login', {
            url: '/login',
            templateUrl: 'app/src/templates/login.tpl.html',
            controller: 'LoginCtrl',
            controllerAs: 'login'
        })
        .state('appdashboard', {
            url: '/dashboard',
            templateUrl: 'app/src/templates/appdashboard.tmpl.html',
            controller: 'appdashboardCtrl',
            controllerAs: 'appdashboard'
        })
        .state('dashboard', {
            url: '/vehicle',
            templateUrl: 'app/src/templates/dashboard/dashboard.tpl.html',
            controller: 'DashboardCtrl',
            controllerAs: 'dashboard'
        })
        .state('task', {
            url: '/task/:taskId',
            templateUrl: 'app/src/templates/dashboard/vehicles.tpl.html',
            controller: 'TaskCtrl',
            controllerAs: 'task'
        })
        .state('inbound/add',{
            url : '/inbound/provider/feed/add',
            templateUrl : 'app/src/templates/inbound/addProvider.tpl.html',
            controller : 'ProviderCtrl',
            // params: {
            //     ctrl: 0
            // },
            controllerAs : 'provider'
          })
        .state('inbound/list',{
            url : '/inbound/provider/feed/list',
            templateUrl : 'app/src/templates/inbound/feedProviders.tpl.html',
            controller : 'ProviderCtrl',
            // params: {
            //     ctrl: 1
            // },
            controllerAs : 'provider'
        })
        .state('inbound/schedule',{
          url : '/inbound/provider/schedule',
          templateUrl : 'app/src/templates/inbound/schedule.tpl.html',
          controller : 'ScheduleCtrl',
          controllerAs : 'schedule'
        })
        .state('inbound/schedule/list',{
            url : '/inbound/provider/schedule/list',
            templateUrl : 'app/src/templates/inbound/feedSchedule.tpl.html',
            controller : 'FeedProviderCtrl',
            controllerAs : 'feedprovider'
          });

    $urlRouterProvider.otherwise('/dashboard');

    $httpProvider.interceptors.push('APIInterceptor');
    
}).service('APIInterceptor', function ($rootScope, UserService) {
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