//'use strict';

/**
 * @ngdoc function
 * @name todoApp.controller:MainTodoCtrl
 * @description
 * # MainTodoCtrl
 * Controller of the todoApp
 */


(function() {
  'use strict';

  angular.module('todoApp')
    .controller('MainTodoCtrl', function($scope, $state, addJobService, getSkillsService) {

	    var todo = function() {
	        $scope.submittingForm = true;
	        $scope.errors = [];

 			$scope.addJobRequest.skills = $scope.user.selectedSkills; //["57242af5c46ff86ce9e00ae6"];
	        addJobService.addJob($scope.addJobRequest) //$scope.addJobRequest.author, $scope.addJobRequest.job_url)
	          .then(function(data) {
	            if (data.success) {
	              $state.go('home');
	            }
	            else {
	              $scope.errors.push(data.message);
	            }
	          }, function(err) {
	            $scope.errors.push('addJob failed.');
	          })
	          .finally(function() {
	            $scope.submittingForm = false;
	          });
	    };


	  // what check-boxes are checked by the user ?
	  $scope.user = {
	    selectedSkills: []
	  };
	  $scope.checkAll = function() {
	    $scope.user.selectedSkills = $scope.allSkillsAndIds.map(function(item) { return item.name; });
	  };
	  $scope.uncheckAll = function() {
	    $scope.user.selectedSkills = [];
	  };
	  $scope.checkFirst = function() {
	    $scope.user.selectedSkills.splice(0, $scope.user.selectedSkills.length); 
	    $scope.user.selectedSkills.push(1);
	  };


      var init = function() {

        $scope.todo = todo;

        $scope.submittingForm = false;
        $scope.errors = [];

/*
		  $scope.allSkillsAndIds = [
		    {_id: '57242af5c46ff86ce9e00ae6', name: 'Java'},
		    {_id: '57278224c46ff86ce9e00b1c', name: 'J2EE'},
		    {_id: '5727817ec46ff86ce9e00b1a', name: 'PHP'},
		    {_id: '572781bac46ff86ce9e00b1b', name: 'CakePHP'}
		  ];
*/		  
        getSkillsService.getSkills()
          .then(function(data) {
            if (data.success) {
              console.log ("getSkills :" + data);
              $scope.allSkillsAndIds = data;
            }
            else {
              $scope.errors.push(data.message);
            }
          }, function(err) {
            $scope.errors.push('getSkillsService Error');
          });

      };

      init();
    });
})();
