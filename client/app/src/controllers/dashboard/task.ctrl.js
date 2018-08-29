angular.module('SimpleRESTWebsite',[]).controller('TaskCtrl', ['VehiclesModel', '$scope', '$state', '$stateParams', function (VehiclesModel, $scope, $state, $stateParams) {
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