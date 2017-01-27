angular.module('jobsApp')
.directive('fileModel', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;

            element.bind('change', function(){
                scope.$apply(function(){
                    modelSetter(scope, element[0].files[0]);
                    if(element[0].files[0]){
                      scope.$root.fileUploaded = true;
                    }
                });
            });
        }
    };
}])
.controller('ApplyController', function($rootScope, $scope, $http, $location, jobIDService) {
  var jobsData = jobIDService.dataObj;
  $scope.email = jobsData[jobsData.length-1];
  console.log("$scope.email: ", $scope.email);
  $scope.submitEmail = function (isValid) {
    if (isValid) {
      var formData = new FormData();
      console.log("$scope.email.contactMsg: ", $scope.email.contactMsg);
      Object.keys($scope.email).forEach(function(key) {
        formData.append(key, $scope.email[key]);
        console.log("formData: ", formData);
      });
      $rootScope.fileUploaded = false;
      $http.post('https://hh1.herokuapp.com/postEmail', formData, {
        transformRequest: angular.identity,
        headers: {'Content-Type': undefined}
      })
      .success(function(data) {
        console.log("Sent to server.");
      })
      .error(function(data, status) {
        console.error('Send error', status, data);
      })
      .finally(function() {
        console.log("Really nothing to report.");
      });

//      .then(function(response) {
//          return response;
//      }, function(response) {
//          alert("Error of some sort.");
//          console.log(response);
//      });

      $location.path('/');
      // Send the post formData here
    }
  };
});
