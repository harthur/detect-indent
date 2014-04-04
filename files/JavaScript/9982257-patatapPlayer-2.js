var Player = function() {
  var self;

  return {
    init: function($app, bpm) {
      self = this;
      self.SPECIAL_CHARS = {
        space: 32,
        enter: 13,
        up: 38,
        down: 40,
        left: 37,
        right: 39
      };
      self.bpm = bpm;
      self.$app = $app;
      self.addDOMElements().addDOMListeners();
      self.playing = false;
      self.repeat = false;
      self.track = null;
      self.trackRead = null;
    },

    updateBpm: function(bpm) {
      self.bpm = bpm;
      return self;
    },

    play: function(track, repeat) {
      if (typeof track === 'string') track = track.split("");
      if (repeat) self.repeat = true;
      if (track) self.track = track.slice(0); // Copy track
      else track = self.trackRead;

      var char = track.shift();
      self.trackRead = track;
      self.playChar(char);
      self.playing = true;

      if (track.length && self.play) {
        setTimeout(function() {
          if (self.playing) {
            self.play();
          }
        }, 60000 / self.bpm);
      } else if (self.repeat && self.play) {
        self.play(self.track);
      }
    },

    stop: function() {
      self.playing = false;
      self.repeat = false;
    },

    playChar: function(char) {
      var char = char.charCodeAt(0);

      if (char != self.SPECIAL_CHARS.space) {
          try {
              $(window).trigger(jQuery.Event('keydown', { which: char, keyCode: char }));
          } catch(e) {}
      }
    },

    addDOMElements: function() {
      var $play = $('<a href="">Play</a>'),
          $stop = $('<a href="">Stop</a>'),
          $trackInput = $('<div><input id="track"></div>'),
          $BPMInput = $('<div><input id="track"></div>'),
          css = {
            button: {
              display: 'inline-block',
              position: 'relative',
              verticalAlign: 'baseline',
              background: 'white',
              color: '#666666',
              fontFamily: '"Lucida Grande", verdana, sans-serif',
              fontSize: '12px',
              lineHeight: '32px',
              borderRadius: '10.56px',
              padding: '0 16px',
              zIndex: 999
            },
            input: {
              display: 'inline-block',
              position: 'relative',
              verticalAlign: 'baseline',
              background: 'white',
              color: '#666666',
              fontFamily: '"Lucida Grande", verdana, sans-serif',
              fontSize: '12px',
              lineHeight: '32px',
              borderRadius: '10.56px',
              padding: '0 16px',
              zIndex: 999
            }
          };

      self.$app.append($play);
      self.$app.append($stop);
      self.$app.append($trackInput);
      self.$app.append($BPMInput);

      $play.css(css.button);
      $stop.css(css.button);
      $trackInput.css(css.input);
      $BPMInput.css(css.input);

      self.$play = $play;
      self.$stop = $stop;
      self.$trackInput = $trackInput;
      self.$BPMInput = $BPMInput;

      return self;
    },

    addDOMListeners: function() {
      self.$play.on('click', self.playButtonClickHandler);

      self.$stop.on('click', function(e) {
        e.preventDefault();
        self.stop();
      });
    },

    playButtonClickHandler: function(e) {
      e.preventDefault();
      // var track = self.$trackInput.val()
      // console.log('track', track);
      // track = 'TT BB CCCCC';
      // self.play(track);
      self.play();
    }
  };
}();

Player.init($('body'), 350)
var track1 = "MMRMDHRM MRMDHR  ";
var track2 = "G B Y G G B Y   G B Y G B Y Y FFG B Y G G B Y   G B Y G B Y Y FFG B Y G G B Y   G B Y G B Y Y FF";
Player.play(track1, true)
