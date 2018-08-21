angular.module('SimpleRESTWebsite',[]).controller('TaskCtrl', ['DashboardService', '$scope', '$state', '$stateParams', function (DashboardService, $scope, $state, $stateParams) {
    var task = this;
    task.loading = true;
    function getVehicles() {
        DashboardService.getTasksVehicles($stateParams.taskId)
            .then(function (response) {
                task.loading = false;
                task.vehicles = response.data;

            })
    }
    getVehicles();
}])