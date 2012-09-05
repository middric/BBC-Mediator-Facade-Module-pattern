define(['jquery', 'signals', 'superclasses/facade'], function ($, Signal, Facade) {
    return function Carousel(settings) {
        var params = {},
            methods = {
                moveInDirection: function (dir, callback) {
                    var px = 0;
                    if (dir !== 'right' && dir !== 'left') {
                        return;
                    }
                    px = (dir === 'right') ? params.pageWidth : -params.pageWidth;

                    methods.moveByPx(px, callback);
                },

                moveByPx: function (px, callback) {
                    var newPos = params.currentPos + px;

                    // Dont do anything if new position is beyond start or end
                    if (newPos < 0 || newPos > (params.numPages - 1) * params.pageWidth) {
                        return;
                    }

                    params.currentPos = newPos;

                    methods.performMove(callback);
                },

                moveToFilter: function (index, callback) {
                    params.currentPos = (params.numPages / params.numFilters) * (index) * params.pageWidth;

                    methods.performMove(callback);
                },

                performMove: function (callback) {
                    callback = (typeof callback !== 'function') ? function () {} : callback;

                    $('#' + params.containerID).animate({scrollLeft: params.currentPos}, callback);
                }
            };
            
        return Facade.extend({
            init: function () {
                var key;

                // Merge settings and default config
                for (key in settings) {
                    if (settings.hasOwnProperty(key)) {
                        params[key] = settings[key];
                    }
                }

                this._super();
            },
            moveInDirection: function (dir) {
                var that = this;
                methods.moveInDirection(dir, function () { that.moveComplete(); });
            },
            moveToFilter: function (index) {
                var that = this;
                methods.moveToFilter(index, function () { that.moveComplete(); });
            },
            moveComplete: function () {
                var signal = this.signals.Moved;
                if (params.currentPos <= 0) {
                    signal = this.signals.AtStart;
                } else if (params.currentPos >= ((params.numPages - 1) * params.pageWidth)) {
                    signal = this.signals.AtEnd;
                }
                signal.dispatch(params.currentPos);
            },

            signals: {
                Moved: new Signal(),
                AtStart: new Signal(),
                AtEnd: new Signal()
            }
        });
    };
});