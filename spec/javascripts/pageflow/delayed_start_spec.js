describe('pageflow.DelayedStart', function() {
  var DelayedStart = pageflow.DelayedStart;

  it('invokes callbacks registered via #wait on #perform', function() {
    var delayedStart = new DelayedStart();
    var callback = sinon.spy();

    delayedStart.wait(callback);
    delayedStart.perform();

    expect(callback).to.have.been.called;
  });

  it('delays callbacks by promises passed to #waitFor', function() {
    var delayedStart = new DelayedStart();
    var callback = sinon.spy();
    var deferred = new $.Deferred();

    delayedStart.wait(callback);
    delayedStart.waitFor(deferred.promise());
    delayedStart.perform();

    expect(callback).not.to.have.been.called;
  });

  it('invokes callback when all #waitFor promises are resolved', function() {
    var delayedStart = new DelayedStart();
    var callback = sinon.spy();
    var deferred = new $.Deferred();

    delayedStart.wait(callback);
    delayedStart.waitFor(deferred.promise());
    delayedStart.perform();
    deferred.resolve();

    expect(callback).to.have.been.called;
  });

  it('resolves #promise on #perform', function() {
    var delayedStart = new DelayedStart();
    var callback = sinon.spy();

    delayedStart.promise().then(callback);
    delayedStart.perform();

    expect(callback).to.have.been.called;
  });

  it('resolves #promise only after promises passed to #waitFor have been resolved', function() {
    var delayedStart = new DelayedStart();
    var callback = sinon.spy();
    var deferred = new $.Deferred();

    delayedStart.promise().then(callback);
    delayedStart.waitFor(deferred.promise());
    delayedStart.perform();

    expect(callback).not.to.have.been.called;
  });

  it('resolves #promise when all #waitFor promises are resolved', function() {
    var delayedStart = new DelayedStart();
    var callback = sinon.spy();
    var deferred = new $.Deferred();

    delayedStart.promise().then(callback);
    delayedStart.waitFor(deferred.promise());
    delayedStart.perform();
    deferred.resolve();

    expect(callback).to.have.been.called;
  });

  it('supports passing a function to #waitFor', function() {
    var delayedStart = new DelayedStart();
    var callback = sinon.spy();
    var delayedStartResolve;

    delayedStart.promise().then(callback);
    delayedStart.waitFor(function(resolve) {
      delayedStartResolve = resolve;
    });
    delayedStart.perform();
    delayedStartResolve();

    expect(callback).to.have.been.called;
  });
});
