angular.module('SimpleRESTWebsite',[]).config(function ($stateProvider, $urlRouterProvider, $httpProvider) {
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