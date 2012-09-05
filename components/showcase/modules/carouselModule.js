define(['jquery', 'signals', 'superclasses/facade'], function ($, Signal, Facade) {
    return function Carousel(settings, mediatorConfig) {
        var params = {},
            methods = {
                moveInDirection: function (dir, callback) {
                    var px = 0;
                    if (dir !== 'right' && dir !== 'left') {
                        return;
                    }
                    px = (dir === 'right') ? mediatorConfig.pageWidth : -mediatorConfig.pageWidth;

                    methods.moveByPx(px, callback);
                },

                moveByPx: function (px, callback) {
                    var newPos = params.currentPos + px;

                    // Dont do anything if new position is beyond start or end
                    if (newPos < 0 || newPos > (mediatorConfig.numPages - 1) * mediatorConfig.pageWidth) {
                        return;
                    }

                    params.oldPos = params.currentPos;
                    params.currentPos = newPos;

                    methods.performMove(callback);
                },

                moveToFilter: function (index, callback) {
                    params.oldPos = params.currentPos;
                    params.currentPos = (mediatorConfig.numPages / mediatorConfig.numFilters) * (index) * mediatorConfig.pageWidth;

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
                methods.moveInDirection(dir, function () {
                    that.signals.Moved.dispatch(params.currentPos, params.oldPos);
                });
            },
            moveToFilter: function (index) {
                var that = this;
                methods.moveToFilter(index, function () {
                    that.signals.MovedToFilter.dispatch(index);
                });
            },

            signals: {
                MovedToFilter: new Signal(),
                Moved: new Signal()
            }
        });
    };
});