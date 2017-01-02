(function() {
  'use strict';

  angular.module('todoApp').service('getJobsBySkillNameService', function($http, $q, appUrl) {

    var getJobsBySkillNameUrl = appUrl.api + 'jobsbyskillname';


    var getJobsBySkillName = function(skillName) {
      var deferred = $q.defer();

      $http.get(getJobsBySkillNameUrl + "/" + skillName, { cache: true })
        .then(function(response) {
          var data = response.data;
          deferred.resolve(data);
        }, function(err) {
          deferred.reject(err);
        });

      return deferred.promise;
    };


    return {
      getJobsBySkillName: getJobsBySkillName,
    };
  });
})();
