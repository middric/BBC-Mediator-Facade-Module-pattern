define(['jquery', 'signals', 'superclasses/facade'], function ($, Signal, Facade) {
    return function Pagination(settings, mediatorConfig) {
        var cache = {},
            params = {
            page: 0,
            filter: 0
        },
            methods = {
                attachKeyboardListener: function (callback) {
                    $(window).on('keydown.pagination', callback);
                },

                attachPaginationButtonListener: function (callback) {
                    callback = (typeof callback !== 'function') ? function () {} : callback;

                    cache.paginators.left.on('click.pagination', callback);
                    cache.paginators.right.on('click.pagination', callback);
                },

                /**
                 * Detach DOM event listeners
                 */
                detachListeners: function () {
                    cache.paginators.left.off('click.pagination');
                    cache.paginators.right.off('click.pagination');
                },

                /**
                 * Set the module page reference by the current filter index
                 * @param {Int} index Filter index value (0 based)
                 */
                setPageByFilter: function (index) {
                    params.page = (index * (mediatorConfig.numPages / mediatorConfig.numFilters));

                    methods.performPaginatorUpdate();
                },

                /**
                 * Set the module page reference by position change
                 * @param {Int} position The carousel position
                 */
                setPageByPosition: function (position) {
                    params.page = position / mediatorConfig.pageWidth;

                    methods.performPaginatorUpdate();
                },

                /**
                 * Update the DOM to reflect pagination button status
                 */
                performPaginatorUpdate: function () {
                    var key, selector;
                    for (key in params.paginators) {
                        if (params.paginators.hasOwnProperty(key)) {
                            selector = cache.paginators[key].removeClass('disabled');
                            if (!params.paginators[key].enabled) {
                                selector.addClass('disabled');
                            }
                        }
                    }
                }
            };

        return Facade.extend({
            _fired: false,

            init: function () {
                params = this.merge(params, settings);

                cache.paginators = cache.paginators || { left: $('#' + params.paginators.left.id), right: $('#' + params.paginators.right.id)};

                this._super();
            },
            resume: function () {
                var that = this;

                methods.attachPaginationButtonListener(function (e) {
                    if (!that._fired) {
                        that.signals.Paged.dispatch(this.id);
                        that._fired = true;
                    }

                    e.preventDefault();
                });

                methods.attachKeyboardListener(function (e) {
                    var id;

                    if (!that._fired) {
                        that._fired = true;
                        switch (e.keyCode) {
                        case 37:
                            id = params.paginators.left.id;
                            break;
                        case 39:
                            id = params.paginators.right.id;
                            break;
                        }

                        if (id) {
                            that.signals.Paged.dispatch(id);
                        } else {
                            that._fired = false;
                        }
                    }
                });

                this._super();
            },
            pause: function () {
                methods.detachListeners();

                this._super();
            },
            updatePosition: function (position) {
                methods.setPageByPosition(position);
                this._fired = false;

                this.signals.PageComplete.dispatch(params.page);
            },
            updateToFilter: function (filterIndex) {
                methods.setPageByFilter(filterIndex);
                this._fired = false;

                this.signals.PageComplete.dispatch(params.page);
            },

            signals: {
                Paged: new Signal(),
                PageComplete: new Signal()
            }
        });
    };
});