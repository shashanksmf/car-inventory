angular.module('SimpleRESTWebsite',[]).service('fileUpload', ['$http', function ($http) {
    this.uploadFileToUrl = function (file, uploadUrl) {
        var fd = new FormData();
        fd.append('file', file);

        return $http.post('/uploadcsv', fd, {
            transformRequest: angular.identity,
            headers: { 'Content-Type': undefined }
        });
    }
}]);