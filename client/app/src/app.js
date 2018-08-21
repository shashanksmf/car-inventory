var app = angular.module('SimpleRESTWebsite', ['angular-storage', 'ui.router',
'UserService',
'LoginService',
'DashboardService',
'ScheduleService',
'ProviderService',
'fileUpload' ,
'fileModel', 
'MainCtrl',
'LoginCtrl',
'ProviderCtrl',
'DashboardCtrl',
'TaskCtrl',
'ScheduleCtrl'
                            ])
    .constant('ENDPOINT_URI', 'https://car-data-base.mybluemix.net/api/');

