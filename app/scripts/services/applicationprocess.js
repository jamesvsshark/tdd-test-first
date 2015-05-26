(function(){
  'use strict';

  /**
   * @ngdoc service
   * @name tddTestFirstApp.ApplicationProcess
   * @description
   * # ApplicationProcess
   * Service in the tddTestFirstApp.
   */
  angular.module('tddTestFirstApp')
    .service('ApplicationProcess', function ($q) {
      // AngularJS will instantiate a singleton by calling "new" on this function
      function  ApplicationProcess(){}

      ApplicationProcess.prototype.start = function(){
        this.isRunning = true;
      };

      ApplicationProcess.prototype.stop = function(){
        this.isRunning = false;
      };

      ApplicationProcess.prototype.getDistanceInformation = function(startingCoords, endingCoords){
        //TODO: call an api to get travel time and distance info
        var _q,
          defered,
          travelInfo = {
            reportedTime: Date.now(),
            travelTime: Math.floor((Math.random() * 100)+ 1),
            travelDistance: '48.6'
          };

        _q = $q;
        defered = _q.defer();

        defered.resolve(travelInfo);

        return defered.promise;
      };

      return ApplicationProcess;
    });
})();
