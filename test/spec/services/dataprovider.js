'use strict';

describe('Service: dataProvider', function () {

  // load the service's module
  beforeEach(module('tddTestFirstApp'));

  // instantiate service
  var dataProvider,
    $httpBackend;
  beforeEach(inject(function (_dataProvider_, _$httpBackend_) {
    dataProvider = _dataProvider_;
    $httpBackend = _$httpBackend_;
  }));

  it('should do something', function () {
    expect(!!dataProvider).toBe(true);
  });

  describe('get locations', function(){
    it ('should call service to get locations (flat file in this case)', function(){
      var  responseData;
      $httpBackend.expectGET("data/locations.json").respond(
        {origins: {}, destinations:{}});

      dataProvider.getLocations().then(function(data){
        responseData = data;
      });

      $httpBackend.flush();
      expect(responseData).toBeDefined();
    });
  });

});
