define(['jquery', 'signals', 'superclasses/facade'], function ($, Signal, Facade) {
    return function Carousel(settings, mediatorConfig) {
        var params = {},
            memo = {},
            methods = {
                addPlaceholders: function () {
                    memo.innerContainer.prepend(memo.last)
                        .append(memo.first)
                        .width(memo.innerContainer.width() + (mediatorConfig.pageWidth * 4));
                },

                removePlaceholders: function () {
                    memo.first.remove();
                    memo.last.remove();
                    memo.innerContainer.width(memo.innerContainer.width() - (mediatorConfig.pageWidth * 4));

                    memo.container.scrollLeft(memo.container.scrollLeft() - (mediatorConfig.pageWidth * 2));
                },

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
                    /*if () {
                        if (typeof callback === 'function') {
                            // Fire the callback and stop execution
                            params.oldPosition = params.currentPosition;
                            callback();
                            return;
                        }
                    }*/

                    params.oldPosition = params.currentPosition;
                    params.currentPosition = newPosition;

                    if (newPosition < 0) {
                        methods.performLoop(callback);
                    } else if (newPosition > (mediatorConfig.numPages - 1) * mediatorConfig.pageWidth) {
                        methods.performLoop(callback);
                    } else {
                        methods.performMove(callback);
                    }
                },

                /**
                 * Move the carousel to a particular filter
                 * @param {Int}      index    Filter to move to
                 * @param {Function} callback Function to execute after move
                 */
                moveToFilter: function (index, callback, speed) {
                    params.oldPosition = params.currentPosition;
                    params.currentPosition = (mediatorConfig.numPages / mediatorConfig.numFilters) * (index) * mediatorConfig.pageWidth;

                    methods.performMove(callback, speed);
                },

                moveToPage: function (page, callback, speed) {
                    var newPosition = mediatorConfig.pageWidth * (page - 1);

                    if (newPosition === params.currentPosition) {
                        if (typeof callback === 'function') {
                            params.oldPosition = params.currentPosition;
                            callback();
                            return;
                        }
                    }
                    params.oldPosition = params.currentPosition;
                    params.currentPosition = newPosition;

                    methods.performMove(callback, speed);
                },

                /**
                 * Move the carousel DOM elements
                 * @param {Function} callback Function to execute after move
                 */
                performMove: function (callback, speed) {
                    callback = (typeof callback !== 'function') ? function () {} : callback;
                    var position = params.currentPosition + (mediatorConfig.pageWidth * 2) - params.offset;
                    memo.container.animate({scrollLeft: position}, speed, callback);
                },

                performLoop: function (callback, speed) {
                    callback = (typeof callback !== 'function') ? function () {} : callback;
                    var position = params.currentPosition + (mediatorConfig.pageWidth * 2) - params.offset;
                    memo.container.animate({scrollLeft: position}, speed, function () {
                        var page = 1;
                        if (position < mediatorConfig.pageWidth) {
                            page = mediatorConfig.numPages;
                        }
                        methods.moveToPage(page, callback, 0);
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

                // Memoize jQuery objects
                memo.container = memo.container || $('#' + params.containerID);
                memo.innerContainer = memo.innerContainer || $('#showcase', memo.container);
                memo.first = memo.first || $('ul:lt(2)', memo.container).clone();
                memo.last = memo.end || $('ul:gt(' + (mediatorConfig.numPages - 3) + ')', memo.container).clone();

                this._super();
            },
            resume: function () {
                methods.addPlaceholders();

                this._super();
            },
            stop: function () {
                methods.removePlaceholders();

                this._super();
            },
            moveInDirection: function (dir) {
                var that = this;
                methods.moveInDirection(dir, function () {
                    that.signals.Moved.dispatch(params.currentPosition);
                });
            },
            moveToFilter: function (index, speed) {
                var that = this;
                methods.moveToFilter(index, function () {
                    that.signals.MovedToFilter.dispatch(index);
                }, speed);
            },
            moveToPage: function (page) {
                var that = this;
                methods.moveToPage(page, function () {
                    that.signals.Moved.dispatch(params.currentPosition, params.oldPosition);
                });
            },

            signals: {
                MovedToFilter: new Signal(),
                Moved: new Signal()
            }
        });
    };
});