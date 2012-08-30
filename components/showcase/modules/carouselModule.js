define(['jquery', 'signals'], function ($, Signal) {
    return function Carousel(settings) {
        var params = {
                currentPos: 0,
                pageWidth: 600
            },
            methods = {
                moveBy: function (dir, el, callback) {
                    var px;
                    switch (dir) {
                    case 'right':
                        px = params.pageWidth;
                        break;
                    case 'left':
                        px = -params.pageWidth;
                        break;
                    default:
                        px = 0;
                    }

                    $(el).animate({scrollLeft: params.currentPos + px}, function () {
                        params.currentPos += px;

                        if (callback && typeof callback === 'function') {
                            callback();
                        }
                    });
                }
            };

        return {
            setup: function () {
                var key;

                // Merge settings and default config
                for (key in settings) {
                    if (settings.hasOwnProperty(key)) {
                        params[key] = settings[key];
                    }
                }
            },
            teardown: function () {
            },
            signals: {
                Moved: new Signal()
            },

            move: function (dir) {
                var that = this;
                methods.moveBy(dir, '#' + params.containerID, function () { that.signals.Moved.dispatch(params.currentPos); });
            }
        };
    };
});