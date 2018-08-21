angular.module('SimpleRESTWebsite',[]).controller('ScheduleCtrl', ['ScheduleService', function (ScheduleService) {
    $('#sDate,#eDate').datetimepicker();
   
    var schedule = this;
    schedule.loading = false;
    schedule.form = {startDate : '08/18/2018 8:41 PM' ,endDate : '08/18/2018 8:43 PM'}
    schedule.res = {};
    schedule.providers = [];
    schedule.scheduleJob = function() {
        schedule.loading = true;
        console.log('Form Data ' ,  schedule.form);
        
        ScheduleService.scheduleJob(schedule.form)
            .then(function (res) {
                schedule.loading = false;
                schedule.res = res.data;
            })
    };
    schedule.getProviders = function(){
        ScheduleService.getProviders()
            .then(function(res){
                console.log('response : ', res.data);
                
                schedule.providers = res.data;
            })
    }

    schedule.getProviders();
}])