'use strict';

/**
 * @ngdoc service
 * @name tddTestFirstApp.dataProvider
 * @description
 * # dataProvider
 * Factory in the tddTestFirstApp.
 */
angular.module('tddTestFirstApp')
    .factory('dataProvider', function ($http) {

        var _dfd, path;

        function getLocations() {
            path = 'data/locations.json';

            if (_dfd) {
                return _dfd;
            }

            _dfd = $http.get(path)['finally'](function() {
                // set _dfd to null so requests that come in afterward do not recycle
                _dfd = null;
            });

            return _dfd;
        }

        // Public API here
        return {
            getLocations: getLocations
        };
    });
