define(['jquery', 'signals', 'superclasses/facade'], function ($, Signal, Facade) {
    return function Carousel(settings) {
        var params = {
                currentPos: 0,
                pageWidth: 600
            },
            methods = {
                moveBy: function (dir, callback) {
                    var px, newPos;
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

                    newPos = params.currentPos + px;

                    // Dont do anything if at beginning or end
                    if (newPos < 0 || newPos > (params.numPages - 1) * params.pageWidth) {
                        newPos = params.currentPos;
                    }

                    params.currentPos = newPos;

                    if (typeof callback === 'function') {
                        callback();
                    }
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
                methods.moveBy(dir, function () {
                    $('#' + params.containerID).animate({scrollLeft: params.currentPos}, function () {
                        if (params.currentPos === 0) {
                            that.signals.AtStart.dispatch(params.currentPos);
                        } else if (params.currentPos >= ((params.numPages - 1) * params.pageWidth)) {
                            that.signals.AtEnd.dispatch(params.currentPos);
                        } else {
                            that.signals.Moved.dispatch(params.currentPos);
                        }
                    });
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