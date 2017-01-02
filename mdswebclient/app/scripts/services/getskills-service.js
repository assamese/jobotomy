(function() {
  'use strict';

  angular.module('todoApp').service('getSkillsService', function($http, $q, appUrl) {

    var getSkillsUrl = appUrl.api + 'skills';


    //var addJob = function(author, job_url) {
    var getSkills = function() {
      var deferred = $q.defer();

      $http.get(getSkillsUrl, { cache: true })
        .then(function(response) {
          var data = response.data;
          data.success = true;
          deferred.resolve(data);
        }, function(err) {
          deferred.reject(err);
        });

      return deferred.promise;
    };


    return {
      getSkills: getSkills,
    };
  });
})();
