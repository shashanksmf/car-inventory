angular.module('SimpleRESTWebsite',[]).controller('ScheduleCtrl', ['ScheduleModel', function (ScheduleModel) {
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