define(['jquery', 'signals', 'superclasses/facade'], function ($, Signal, Facade) {
    return function Carousel(settings, mediatorConfig) {
        var params = {},
            methods = {
                /**
                 * Move the carousel by direction
                 * @param {String}   dir      Direction in which to move - left|right
                 * @param {Function} callback Function to execute after move
                 */
                moveInDirection: function (dir, callback) {
                    var px = 0;
                    if (dir !== 'right' && dir !== 'left') {
                        return;
                    }
                    px = (dir === 'right') ? mediatorConfig.pageWidth : -mediatorConfig.pageWidth;

                    methods.moveByPx(px, callback);
                },

                /**
                 * Move the carousel by a set number of pixels
                 * @param {Int}      px       Number of pixels in which to move, can be negative
                 * @param {Function} callback Function to execute after move
                 */
                moveByPx: function (px, callback) {
                    var newPosition = params.currentPosition + px;

                    // Dont do anything if new position is beyond start or end
                    if (newPosition < 0 || newPosition > (mediatorConfig.numPages - 1) * mediatorConfig.pageWidth) {
                        if (typeof callback === 'function') {
                            // Fire the callback and stop execution
                            callback();
                            return;
                        }
                    }

                    params.oldPosition = params.currentPosition;
                    params.currentPosition = newPosition;

                    methods.performMove(callback);
                },

                /**
                 * Move the carousel to a particular filter
                 * @param {Int}      index    Filter to move to
                 * @param {Function} callback Function to execute after move
                 */
                moveToFilter: function (index, callback) {
                    params.oldPosition = params.currentPosition;
                    params.currentPosition = (mediatorConfig.numPages / mediatorConfig.numFilters) * (index) * mediatorConfig.pageWidth;

                    methods.performMove(callback);
                },

                /**
                 * Move the carousel DOM elements
                 * @param {Function} callback Function to execute after move
                 */
                performMove: function (callback) {
                    callback = (typeof callback !== 'function') ? function () {} : callback;

                    $('#' + params.containerID).animate({scrollLeft: params.currentPosition}, callback);
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
                    that.signals.Moved.dispatch(params.currentPosition, params.oldPosition);
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