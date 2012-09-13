define(['jquery', 'signals', 'superclasses/facade'], function ($, Signal, Facade) {
    return function Carousel(settings, mediatorConfig) {
        var cache = {},
            params = {},
            methods = {
                addPlaceholders: function () {
                    cache.innerContainer.prepend(cache.last)
                        .append(cache.first)
                        .width(mediatorConfig.pageWidth * (mediatorConfig.numPages + 4));
                },

                removePlaceholders: function () {
                    cache.first.remove();
                    cache.last.remove();
                    cache.innerContainer.width(cache.innerContainer.width() - (mediatorConfig.pageWidth * 4));

                    cache.container.scrollLeft(cache.container.scrollLeft() - (mediatorConfig.pageWidth * 2));
                },

                /**
                 * Move the carousel by direction
                 * @param {String}   dir      Direction in which to move - left|right
                 * @param {Function} callback Function to execute after move
                 */
                moveInDirection: function (dir, callback) {
                    var px = 0;
                    if (dir !== 'scroll-right' && dir !== 'scroll-left') {
                        return;
                    }
                    px = (dir === 'scroll-right') ? mediatorConfig.pageWidth : -mediatorConfig.pageWidth;

                    methods.moveByPx(px, callback);
                },

                /**
                 * Move the carousel by a set number of pixels
                 * @param {Int}      px       Number of pixels in which to move, can be negative
                 * @param {Function} callback Function to execute after move
                 */
                moveByPx: function (px, callback) {
                    var newPosition = params.currentPosition + px;

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

                    cache.container.animate({scrollLeft: position}, speed, callback);
                },

                performLoop: function (callback, speed) {
                    callback = (typeof callback !== 'function') ? function () {} : callback;
                    var position = params.currentPosition + (mediatorConfig.pageWidth * 2) - params.offset;
                    cache.container.animate({scrollLeft: position}, speed, function () {
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
                params = this.merge(params, settings);

                // cache jQuery objects
                cache.container = cache.container || $('#' + params.containerID);
                cache.innerContainer = cache.innerContainer || $('#' + params.innerContainerID);
                cache.first = cache.first || $('ul:lt(2)', cache.container).clone();
                cache.last = cache.end || $('ul:gt(' + (mediatorConfig.numPages - 3) + ')', cache.container).clone();

                this._super();
            },
            calculate: function () {
                this._super();
                
                methods.addPlaceholders();
                this.moveToFilter(0, 0);
            },
            detach: function () {
                this._super();

                methods.removePlaceholders();
            },
            updateConfig: function (settings, mConfig) {
                mediatorConfig = mConfig;

                params = this.merge(params, settings);
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