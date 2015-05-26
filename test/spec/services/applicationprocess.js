'use strict';

describe('Service: ApplicationProcess', function () {

  // load the service's module
  beforeEach(module('tddTestFirstApp'));

  // instantiate service
  var ApplicationProcess;
  beforeEach(inject(function (_ApplicationProcess_) {
    ApplicationProcess = _ApplicationProcess_;
  }));

  it('should do something', function () {
    expect(!!ApplicationProcess).toBe(true);
  });

});
