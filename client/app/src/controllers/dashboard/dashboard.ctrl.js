angular.module('SimpleRESTWebsite',[]).controller('DashboardCtrl', ['VehiclesModel', 'fileUpload', function (VehiclesModel, fileUpload) {

    var dashboard = this;
    $.validate({
        modules : 'security',
        form : '#vehicleForm',
        onSuccess : function(form){
            alert('Success');
            dashboard.createVehicle(dashboard.newVehicle);
            return false;
        },
        onError :function(err){
            alert('Error', err)
        }
    });
    dashboard.uploadTxt = 'Upload';
    dashboard.uploading = false;
    console.log("dashboard controller")
    function uploadFile() {
        console.log("asdsad");
        var file = dashboard.myFile;
        console.log('File', file);
        
        if(!file){
            alert('Please Select File !');
        }else{
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
        }
        
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
            .then(function (res) {
                alert(res.data.msg);
                if(res.data.result){
                    initCreateForm();
                }
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
    // getVehicles();


}])
.constant('weblogngConfig', {
    apiKey: '',
    options: {
        publishNavigationTimingMetrics: true,
        publishUserActive: true,
        application: 'simple-rest-website'
    }
});