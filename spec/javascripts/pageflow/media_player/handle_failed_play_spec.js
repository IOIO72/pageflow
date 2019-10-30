/*global Promise*/

describe('pageflow.mediaPlayer.handleFailedPlay', function() {
  it('triggers playfailed event when play returns rejected promise', function() {
    var player = fakePlayer();
    player.originalPlay.returns(rejectedAutoplayPromise());
    var playfailedHandler = sinon.spy();

    pageflow.mediaPlayer.handleFailedPlay(player, {
      hasAutoplaySupport: true
    });
    player.on('playfailed', playfailedHandler);

    return player.play().then(function() {
      expect(playfailedHandler).to.have.been.called;
    });
  });

  it('does not trigger playfailed event when play returns resolved promise', function() {
    var player = fakePlayer();
    player.originalPlay.returns(Promise.resolve());
    var playfailedHandler = sinon.spy();

    pageflow.mediaPlayer.handleFailedPlay(player, {
      hasAutoplaySupport: true
    });
    player.on('playfailed', playfailedHandler);

    return player.play().then(function() {
      expect(playfailedHandler).not.to.have.been.called;
    });
  });

  it('does not fall back to muted play by default', function() {
    var player = fakePlayer();
    player.originalPlay.returns(rejectedAutoplayPromise());

    pageflow.mediaPlayer.handleFailedPlay(player, {
      hasAutoplaySupport: true
    });

    return player.play().then(function() {
      expect(player.originalPlay).to.have.been.calledOnce;
    });
  });

  describe('on browsers without autoplay support', function() {
    it('does not trigger playfailed event when play returns rejected promise', function() {
      var player = fakePlayer();
      player.originalPlay.returns(rejectedAutoplayPromise());
      var playfailedHandler = sinon.spy();

      pageflow.mediaPlayer.handleFailedPlay(player, {
        hasAutoplaySupport: false
      });
      player.on('playfailed', playfailedHandler);

      return player.play().then(function() {
        expect(playfailedHandler).not.to.have.been.called;
      });
    });
  });

  describe('when play does not return promise', function() {
    it('does nothing', function() {
      var player = fakePlayer();
      player.originalPlay.returns(undefined);
      var playfailedHandler = sinon.spy();

      pageflow.mediaPlayer.handleFailedPlay(player, {
        hasAutoplaySupport: true
      });
      player.on('playfailed', playfailedHandler);

      expect(function() {
        player.play();
      }).not.to.throw();
    });
  });

  describe('with fallbackToMutedAutoplay options', function() {
    it('falls back to muted play when option is present', function() {
      var player = fakePlayer();
      player.originalPlay.onFirstCall().returns(rejectedAutoplayPromise());
      player.originalPlay.onSecondCall().returns(Promise.resolve());

      pageflow.mediaPlayer.handleFailedPlay(player, {
        hasAutoplaySupport: true,
        fallbackToMutedAutoplay: true
      });

      return player.play().then(function() {
        expect(player.muted).to.have.been.called;
        expect(player.originalPlay).to.have.been.calledTwice;
      });
    });

    it('trigers playmuted event', function() {
      var player = fakePlayer();
      player.originalPlay.onFirstCall().returns(rejectedAutoplayPromise());
      player.originalPlay.onSecondCall().returns(Promise.resolve());
      var playmutedHandler = sinon.spy();

      pageflow.mediaPlayer.handleFailedPlay(player, {
        hasAutoplaySupport: true,
        fallbackToMutedAutoplay: true
      });
      player.on('playmuted', playmutedHandler);

      return player.play().then(function() {
        expect(playmutedHandler).to.have.been.called;
      });
    });

    it('does not triger playfailed event', function() {
      var player = fakePlayer();
      player.originalPlay.onFirstCall().returns(rejectedAutoplayPromise());
      player.originalPlay.onSecondCall().returns(Promise.resolve());
      var playfailedHandler = sinon.spy();

      pageflow.mediaPlayer.handleFailedPlay(player, {
        hasAutoplaySupport: true,
        fallbackToMutedAutoplay: true
      });
      player.on('playfailed', playfailedHandler);

      return player.play().then(function() {
        expect(playfailedHandler).not.to.have.been.called;
      });
    });

    it('trigers playfailed event when muted play fails', function() {
      var player = fakePlayer();
      player.originalPlay.onFirstCall().returns(rejectedAutoplayPromise());
      player.originalPlay.onSecondCall().returns(rejectedAutoplayPromise());
      var playfailedHandler = sinon.spy();

      pageflow.mediaPlayer.handleFailedPlay(player, {
        hasAutoplaySupport: true,
        fallbackToMutedAutoplay: true
      });
      player.on('playfailed', playfailedHandler);

      return player.play().then(function() {
        expect(playfailedHandler).to.have.been.called;
      });
    });
  });

  function rejectedAutoplayPromise() {
    return Promise.reject({name: 'NotAllowedError'});
  }

  function fakePlayer(options) {
    var originalPlay = sinon.stub();

    return _.extend({
      originalPlay: originalPlay,
      play: originalPlay,

      muted: sinon.spy()
    }, Backbone.Events);
  }
});
