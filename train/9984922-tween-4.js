ig.module(
        'plugins.tween'
    ).requires(
        'impact.entity'
    ).defines( function() {
        'use strict';

        var _easing = {
            linear: {
                easeNone: function (k) {
                    return k;
                }
            },

            quadratic: {
                easeIn: function (k) {
                    return k * k;
                },

                easeOut: function (k) {
                    return - k * ( k - 2 );
                },

                easeInOut: function (k) {
                    if ( ( k *= 2 ) < 1 ) return 0.5 * k * k;
                    return - 0.5 * ( --k * ( k - 2 ) - 1 );
                }
            },

            cubic: {
                easeIn: function (k) {
                    return k * k * k;
                },

                easeOut: function (k) {
                    return --k * k * k + 1;
                },

                easeInOut: function (k) {
                    if ( ( k *= 2 ) < 1 ) return 0.5 * k * k * k;
                    return 0.5 * ( ( k -= 2 ) * k * k + 2 );
                }
            },

            quartic: {
                easeIn: function (k) {
                    return k * k * k * k;
                },

                easeOut: function (k) {
                    return - ( --k * k * k * k - 1 );
                },

                easeInOut: function (k) {
                    if ( ( k *= 2 ) < 1) return 0.5 * k * k * k * k;
                    return - 0.5 * ( ( k -= 2 ) * k * k * k - 2 );
                }
            },

            quintic: {
                easeIn: function (k) {
                    return k * k * k * k * k;
                },

                easeOut: function (k) {
                    return ( k = k - 1 ) * k * k * k * k + 1;
                },

                easeInOut: function (k) {
                    if ( ( k *= 2 ) < 1 ) return 0.5 * k * k * k * k * k;
                    return 0.5 * ( ( k -= 2 ) * k * k * k * k + 2 );
                }
            },

            sinusoidal: {
                easeIn: function (k) {
                    return - Math.cos( k * Math.PI / 2 ) + 1;
                },

                easeOut: function (k) {
                    return Math.sin( k * Math.PI / 2 );
                },

                easeInOut: function (k) {
                    return - 0.5 * ( Math.cos( Math.PI * k ) - 1 );
                }
            },

            exponential: {
                easeIn: function (k) {
                    return k == 0 ? 0 : Math.pow( 2, 10 * ( k - 1 ) );
                },

                easeOut: function (k) {
                    return k == 1 ? 1 : - Math.pow( 2, - 10 * k ) + 1;
                },

                easeInOut: function (k) {
                    if ( k == 0 ) return 0;
                    if ( k == 1 ) return 1;
                    if ( ( k *= 2 ) < 1 ) return 0.5 * Math.pow( 2, 10 * ( k - 1 ) );
                    return 0.5 * ( - Math.pow( 2, - 10 * ( k - 1 ) ) + 2 );
                }
            },

            circular: {
                easeIn: function (k) {
                    return - ( Math.sqrt( 1 - k * k ) - 1);
                },

                easeOut: function (k) {
                    return Math.sqrt( 1 - --k * k );
                },

                easeInOut: function (k) {
                    if ( ( k /= 0.5 ) < 1) return - 0.5 * ( Math.sqrt( 1 - k * k) - 1);
                    return 0.5 * ( Math.sqrt( 1 - ( k -= 2) * k) + 1);
                }
            },

            elastic: {
                easeIn: function (k) {
                    var s, a = 0.1, p = 0.4;
                    if ( k == 0 ) return 0; if ( k == 1 ) return 1; if ( !p ) p = 0.3;
                    if ( !a || a < 1 ) { a = 1; s = p / 4; }
                    else s = p / ( 2 * Math.PI ) * Math.asin( 1 / a );
                    return - ( a * Math.pow( 2, 10 * ( k -= 1 ) ) * Math.sin( ( k - s ) * ( 2 * Math.PI ) / p ) );
                },

                easeOut: function (k) {
                    var s, a = 0.1, p = 0.4;
                    if ( k == 0 ) return 0; if ( k == 1 ) return 1; if ( !p ) p = 0.3;
                    if ( !a || a < 1 ) { a = 1; s = p / 4; }
                    else s = p / ( 2 * Math.PI ) * Math.asin( 1 / a );
                    return ( a * Math.pow( 2, - 10 * k) * Math.sin( ( k - s ) * ( 2 * Math.PI ) / p ) + 1 );
                },

                easeInOut: function (k) {
                    var s, a = 0.1, p = 0.4;
                    if ( k == 0 ) return 0; if ( k == 1 ) return 1; if ( !p ) p = 0.3;
                    if ( !a || a < 1 ) { a = 1; s = p / 4; }
                    else s = p / ( 2 * Math.PI ) * Math.asin( 1 / a );
                    if ( ( k *= 2 ) < 1 ) return - 0.5 * ( a * Math.pow( 2, 10 * ( k -= 1 ) ) * Math.sin( ( k - s ) * ( 2 * Math.PI ) / p ) );
                    return a * Math.pow( 2, -10 * ( k -= 1 ) ) * Math.sin( ( k - s ) * ( 2 * Math.PI ) / p ) * 0.5 + 1;
                }
            },

            back: {
                easeIn: function (k) {
                    var s = 1.70158;
                    return k * k * ( ( s + 1 ) * k - s );
                },

                easeOut: function (k) {
                    var s = 1.70158;
                    return ( k = k - 1 ) * k * ( ( s + 1 ) * k + s ) + 1;
                },

                easeInOut: function (k) {
                    var s = 1.70158 * 1.525;
                    if ( ( k *= 2 ) < 1 ) return 0.5 * ( k * k * ( ( s + 1 ) * k - s ) );
                    return 0.5 * ( ( k -= 2 ) * k * ( ( s + 1 ) * k + s ) + 2 );
                }
            },

            bounce: {
                easeIn: function (k) {
                    return 1 - _easing.bounce.easeOut( 1 - k );
                },

                easeOut: function (k) {
                    if ( ( k /= 1 ) < ( 1 / 2.75 ) ) {
                        return 7.5625 * k * k;
                    } else if ( k < ( 2 / 2.75 ) ) {
                        return 7.5625 * ( k -= ( 1.5 / 2.75 ) ) * k + 0.75;
                    } else if ( k < ( 2.5 / 2.75 ) ) {
                        return 7.5625 * ( k -= ( 2.25 / 2.75 ) ) * k + 0.9375;
                    } else {
                        return 7.5625 * ( k -= ( 2.625 / 2.75 ) ) * k + 0.984375;
                    }
                },

                easeInOut: function (k) {
                    if ( k < 0.5 ) return _easing.bounce.easeIn( k * 2 ) * 0.5;
                    return _easing.bounce.easeOut( k * 2 - 1 ) * 0.5 + 0.5;
                }
            }
        };

        /**
         * Simple easing plugin that uses ImpactJS
         * @author Ash Blue (@ashbluewd) http://blueashes.com
         * @src http://www.pointofimpactjs.com/snippets/view/17/entitytween
         * @type {void|*}
         */
        window.EntityTween = ig.Entity.extend({
            easing: 'linear',
            easingType: 'easeNone',
            loop: 'none', // Valid values, 'none', 'revert', 'reverse'

            time: 3,
            start: 1,
            end: 10,
            val: null,
            callback: null, // function(tween, x) { tween.target.pos.x = x; },
            target: null, // An entity

            init:function ( x, y, settings ) {
                this.parent( x, y, settings );

                this.paused = false;
                this.timer = new ig.Timer();

                this.val = this.start;

                this.state = 'forward';
            },

            pause:function() {
                this.paused = true;
            },

            unpause:function() {
                this.paused = false;
            },

            update:function() {
                if (this.paused) return;

                if (this.timer.delta() > this.time) {
                    if( !this.hasOwnProperty('loop') || this.loop === 'none' ) {
                        if (this.callback) this.callback(this, this.end);
                        this.kill();
                        return;
                    } else if( this.loop === 'revert' ) {
                        this.timer.set( -(this.timer.delta() - this.time) );
                    } else if( this.loop === 'reverse' ) {
                        this.timer.set( -(this.timer.delta() - this.time) );
                        this.state = this.state === 'forward' ? 'reverse' : 'forward';
                    }
                }

                var t = this.timer.delta() / this.time;
                var k = _easing[this.easing][this.easingType](t);
                var range = this.end - this.start;
                var val;

                if( this.state === 'forward' ) {
                    val = this.start + range * k;
                }
                else if( this.state === 'reverse' ) {
                    val = this.end - range * k;
                }

                if (this.callback) this.callback(this, val);
                this.val = val;
            },

            draw:function() {}
        });
    });