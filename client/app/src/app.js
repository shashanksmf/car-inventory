var app = angular.module('SimpleRESTWebsite', ['angular-storage', 'ui.router',
'UserService',
'LoginService',
'FeedProviderModel',
'VehiclesModel',
'TasksModel',
'ScheduleModel',
'ProviderModel',
'fileUpload' ,
'fileModel', 
'FeedProviderCtrl',
'LoginCtrl',
'MainCtrl',
'appdashboardCtrl',
'TaskCtrl',
'ScheduleCtrl',
'ProviderCtrl',
'DashboardCtrl'
                ]).constant('ENDPOINT_URI', 'https://car-data-base.mybluemix.net/api/');

