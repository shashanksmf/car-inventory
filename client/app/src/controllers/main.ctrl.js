angular.module('SimpleRESTWebsite',[]).controller('MainCtrl', function ($rootScope, $state, LoginService, UserService) {
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