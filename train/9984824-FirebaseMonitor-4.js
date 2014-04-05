/**
 *  This little helper is called instead of on() to monitor data and handle auth expiration
 *  It assumes that you monitor authentication state and re-auth if
 *  your auth token expires. It also doesn't help with any transactions, set ops, or
 *  other writes which could be in progress when authentication is lost--those will
 *  explode in glorious flashes of failure
 *
 *  To support IE8, you will want these polyfills:
 *  forEach: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach#Polyfill
 *  indexOf: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/indexOf#Polyfill
 *  bind: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind#Compatibility
 */
var FirebaseMonitor = (function() {
    function Monitor(firebaseRoot) {
        this.restarts = [];
        this.authenticated = false;
        firebaseRoot.child('.info/authenticated').on('value', this._authChanged.bind(this));
    }

    Monitor.prototype = {
        on: function(ref, event, callback) {
            return new OnEvent(ref, event, callback, this).dispose;
        },

        _authChanged: function(snap) {
            this.authenticated = snap.val();
            // when authentication state is reinstated, restart our on() listeners
            if( this.authenticated ) {
                this.restarts.forEach(function(fn) { fn(); });
                this.restarts = [];
            }
        },

        restart: function(fn) {
           this.restarts.push(fn);
        },

        cancel: function(fn) {
            var i = this.restarts.indexOf(fn);
            if( i > -1 ) {
                this.restarts.slice(i, 1);
            }
        }
    };

    function OnEvent(ref, event, callback, monitor) {
        this._lastAdded = null;
        this.origRef = ref;
        this.mon = monitor;
        this.event = event;
        this.callback = callback;
        this._ref = ref;
        this._bind();
        this._init();
    }

    OnEvent.prototype = {
        // in the event that we lose authentication, we can restart listeners
        // after authentication returns
        _wait: function() {
            this._ref = null;
            this.mon.restart(this._restart);
        },

        _start: function() {
            if( this._lastAdded ) {
                this._ref = this.origRef.startAt(this._lastAdded.pri, this._lastAdded.name);
            }
            else {
                this._ref = this.origRef;
            }
            this._ref.on(this.event, this._fn, this._wait.bind(this));
        },

        _bind: function() {
            var self = this;

            self._restart = self._start.bind(self);

            self._fn = event === 'child_added'? function(snap) {
                // store last added child so we don't repeat ourselves
                self._lastAdded = {name: snap.name(), pri: snap.getPriority()};
                self.callback(snap);
            } : self.callback;

            self.dispose = function() {
                self.mon.cancel(self._restart);
                self._ref && self._ref.off(event, self._fn);
                self._ref = null;
            };
        },

        _init: function() {
            // listen for events
            if( this.mon.authenticated ) { this._start(); }
            else { this._wait(); }
        }
    };

    return Monitor;
})();