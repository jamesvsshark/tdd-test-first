'use strict';

describe('Controller: MainCtrl', function () {

  // load the controller's module
  beforeEach(module('tddTestFirstApp'));

  var MainCtrl,
    scope,
    dataProviderSpy,
    ApplicationProcessSpy,
    q,
    deferred,
    httpBackend;

  beforeEach(function(){
    dataProviderSpy = {
      getLocations: function(){
        deferred = q.defer();
        return deferred.promise;
      }
    };
  });

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, _$q_, _dataProvider_, _ApplicationProcess_, $injector) {
    httpBackend = $injector.get('$httpBackend');
    q = _$q_;
    dataProviderSpy = _dataProvider_;
    ApplicationProcessSpy = _ApplicationProcess_;

    scope = $rootScope.$new();

    MainCtrl = $controller('MainCtrl', {
      $scope: scope,
      dataProvider: dataProviderSpy,
      ApplicationProcess: _ApplicationProcess_
    });


    //since we mocked above callThrough will use that implementation
    spyOn(dataProviderSpy, 'getLocations').and.callThrough();
    //this is an alternative way to mock
    //spyOn(dataProvider, 'getLocations').and.callFake(function(){
    //    deferred = q.defer();
    //    return deferred.promise;
    //});
    httpBackend.whenGET('data/locations.json').respond();

    spyOn(ApplicationProcessSpy.prototype, 'start').and.callThrough();
    spyOn(ApplicationProcessSpy.prototype, 'stop').and.callThrough();
    spyOn(ApplicationProcessSpy.prototype, 'getDistanceInformation').and.callFake(function(){
      var travelInfo = {
        reportedTime: Date.now(),
        travelTime: '90',
        travelDistance: '48.6'
      };
      deferred = q.defer();
      return deferred.promise;
    });
  }));

  describe('On page load', function(){
    it('should display welcome message on home page', function() {
      expect(scope.title).toBe('Hello World!');
    });
    it('should hit provider to get list of locations in the origination drop down', function() {
      /*As the list of locations is populated from an http call on the dataProvider factory, we need to mock that and check if it was called, we don't want to hit the http call*/
      scope.locations.getOriginLocations();
      expect(dataProviderSpy.getLocations).toHaveBeenCalled();
    });
    it('should hit provider to get list locations in the destination drop down', function() {
      scope.locations.getDestinationLocations();
      expect(dataProviderSpy.getLocations).toHaveBeenCalled();
    });
  });

  describe('Application flow',function(){
    describe('Start button',function(){
      it('should start the application when clicked', function() {
        scope.application.start();
        expect(ApplicationProcessSpy.prototype.start).toHaveBeenCalled();
        expect(scope.application.isRunning()).toBe(true);
      });
      it('should clear out any previous run output',function(){
        scope.itineraryResults.push('some data');
        scope.application.start();
        expect(scope.itineraryResults.length).toBe(0);
      });
      it('should only be enabled when both the start and ending locations are selected', function() {
        scope.selectedLocation.origin = 'BOSTON';
        scope.selectedLocation.destination = 'PVD';
        expect(scope.application.isReadyToRun()).toBe(true);
      });
      it('should be disabled when both the start and ending locations are empty', function() {
        scope.selectedLocation.origin = '';
        scope.selectedLocation.destination = '';
        expect(scope.application.isReadyToRun()).toBe(false);
      });
      it('should be disabled when both the start OR ending locations are empty', function() {
        scope.selectedLocation.origin = 'BOSTON';
        scope.selectedLocation.destination = '';
        expect(scope.application.isReadyToRun()).toBe(false);
      });
      it('should disable the ability to change origin or location while running', function(){
        scope.application.start();
        expect(scope.application.isRunning()).toBe(true);
      });
      it('should NOT be enabled when application is running', function() {
        scope.application.start();
        expect(scope.application.isRunning()).toBe(true);
      });
    });

    describe('Stop button',function(){
      it('should stop the application when clicked',function(){
        scope.application.stop();
        expect(ApplicationProcessSpy.prototype.stop).toHaveBeenCalled();
        expect(scope.application.isRunning()).toBe(false);
      });
      it('should only be enabled when application is running',function(){
        scope.application.start();
        expect(scope.application.isRunning()).toBe(true);
      });
    });

    describe('Application Running', function(){
      it('should call the application get distance method to update the page', function(){
        scope.selectedLocation.origin = 'foo';
        scope.selectedLocation.destination = 'bar';
        scope.application.start();
        expect(ApplicationProcessSpy.prototype.getDistanceInformation).toHaveBeenCalledWith('foo','bar');
      });
      it('should add data from service call to the scope of the page to display', function(){
        scope.application.start();
        scope.itineraryResults = [];
        deferred.resolve();
        scope.$root.$digest();
        expect(scope.itineraryResults.length).toBe(1);
      });
    });

  });
});
