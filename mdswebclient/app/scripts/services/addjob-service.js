(function() {
  'use strict';

  angular.module('todoApp').service('addJobService', function($http, $q, appUrl) {

    var addJobUrl = appUrl.api + 'jobs';


    var addJob = function(addJobRequest) {
      var deferred = $q.defer();

      $http.post(addJobUrl, { author: addJobRequest.author, job_url: addJobRequest.job_url, city: addJobRequest.city, position: addJobRequest.position, published_by_employer_at: addJobRequest.published_by_employer_at, remaining_skills: addJobRequest.remaining_skills, "skills": addJobRequest.skills })
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
      addJob: addJob,
    };
  });
})();
