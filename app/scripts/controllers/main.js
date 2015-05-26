(function(){
  'use strict';

  /**
   * @ngdoc function
   * @name tddTestFirstApp.controller:MainCtrl
   * @description
   * # MainCtrl
   * Controller of the tddTestFirstApp
   */
  angular.module('tddTestFirstApp')
    .controller('MainCtrl', function ($scope, dataProvider, ApplicationProcess, $interval) {
      var app = new ApplicationProcess();
      $scope.title = 'Hello World!';
      $scope.subtitle = 'Because not all traffic is the same';
      $scope.selectedLocation = {};
      $scope.itineraryResults = [];
      $scope.averageTraveledTime = '';

      $scope.locations = {
        origins: [],
        destinations: [],
        getOriginLocations : function(){
          dataProvider.getLocations().then(function(response){
            $scope.locations.origins = response.data.origins;
          });
        },
        getDestinationLocations : function(){
          dataProvider.getLocations().then(function(response){
            $scope.locations.destinations = response.data.destinations;
          });
        }
      };

      $scope.application = {
        start: function(){
          app.start();
          startTimer();
        },
        stop: function(){
          app.stop();
        },
        isRunning: function(){
          return app.isRunning;
        },
        isReadyToRun: function(){
          if ($scope.selectedLocation.origin && $scope.selectedLocation.destination) {
            return true;
          }
          return false;
        },
        getItineraryResult: function(){
          if(this.isRunning()){
            app.getDistanceInformation($scope.selectedLocation.origin, $scope.selectedLocation.destination).then(function(results){
              $scope.itineraryResults.push(results);
            });
          }
        }
      };

      function init(){
        $scope.locations.getOriginLocations();
        $scope.locations.getDestinationLocations();
      }

      function startTimer(){
        if ( $scope.itineraryResults.length > 0 ){
          $scope.itineraryResults = [];
        }

        $scope.application.getItineraryResult();

        $interval(function(){
          $scope.application.getItineraryResult();
          $scope.averageTraveledTime = getAveragedTravelTime();
        }, 10000);
      }

      function getAveragedTravelTime(){
        var total = 0;

        for(var i = 0; i < $scope.itineraryResults.length;  i++){
          var _n = $scope.itineraryResults[i].travelTime;
          total += Number(_n);
        }

        return Number(total/$scope.itineraryResults.length).toFixed(2);
      }

      init();
    });
})();
