//'use strict';

/**
 * @ngdoc function
 * @name todoApp.controller:MainListjobCtrl
 * @description
 * # MainTodoCtrl
 * Controller of the todoApp
 */



(function () {
  'use strict';


    var tabs = [];

	angular.module('todoApp')
    .controller('MainListjobCtrl', function($scope, $state, getSkillsService, getJobsBySkillNameService) {

    $scope.tabs = tabs;



	var loadJobsforSkillId = function(skillName, skillIndex) {

		getJobsBySkillNameService.getJobsBySkillName(skillName)
		  .then(function(data) {
		  		console.log ("getJobsBySkillName :" + data);
				tabs[skillIndex].jobs = data;
		  }, function(err) {
		    $scope.errors.push('getJobsBySkillNameService Error');
		  });
	};

	var init = function() {
		$scope.errors = [];

		getSkillsService.getSkills()
		  .then(function(data) {
		    if (data.success) {
				console.log ("getSkills :" + data);
				$scope.allSkillsAndIds = data;

				var numSkills;
				for (numSkills=0; numSkills < data.length; numSkills++) {
					tabs.push({'skill': $scope.allSkillsAndIds[numSkills].name, jobs:[]});
					loadJobsforSkillId($scope.allSkillsAndIds[numSkills].name, numSkills);
				}
				
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




