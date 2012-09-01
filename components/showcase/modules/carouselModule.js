define(['jquery', 'signals', 'superclasses/facade'], function ($, Signal, Facade) {
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
            move: function (dir) {
                var that = this;
                methods.moveBy(dir, '#' + params.containerID, function () {
                    if (params.currentPos === 0) {
                        that.signals.AtStart.dispatch(params.currentPos);
                    } else if (params.currentPos >= ((params.numPages - 1) * params.pageWidth)) {
                        that.signals.AtEnd.dispatch(params.currentPos);
                    } else {
                        that.signals.Moved.dispatch(params.currentPos);
                    }
                });
            },
            signals: {
                Moved: new Signal(),
                AtStart: new Signal(),
                AtEnd: new Signal()
            }
        });
    };
});