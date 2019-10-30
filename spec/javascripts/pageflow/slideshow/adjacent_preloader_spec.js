describe('pageflow.AdjacentPreloader', function() {
  var p = pageflow;

  describe('on page:change event', function() {
    it('calls preload on adjacent pages', function() {
      var events = support.fakeEventEmitter();
      var page = fakePage();
      var adjacentPage = fakePage();
      var adjacentPages = fakeAdjacentPages(
        [page, [adjacentPage]]
      );

      new p.AdjacentPreloader(adjacentPages).attach(events);
      events.trigger('page:change', page);

      expect(adjacentPage.preload).to.have.been.called;
    });
  });

  function fakeAdjacentPages(/* pairs */) {
    var pairs = arguments;
    var stub = sinon.stub();

    _(pairs).each(function(pair) {
      var page = pair[0];
      var adjacentPages = pair[1];

      stub.withArgs(page).returns(adjacentPages);
    });

    return {of: stub};
  }

  function fakePage() {
    return {
      preload: sinon.spy()
    };
  }
});
