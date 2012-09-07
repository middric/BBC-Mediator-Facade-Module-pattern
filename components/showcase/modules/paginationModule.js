define(['jquery', 'signals', 'superclasses/facade'], function ($, Signal, Facade) {
    return function Pagination(settings, mediatorConfig) {
        var params = {
            page: 0
        },
            methods = {
                /**
                 * Attach DOM event listeners
                 * @param {Function} callback Function to execute on event
                 */
                attachListeners: function (callback) {
                    callback = (typeof callback !== 'function') ? function () {} : callback;

                    $(params.paginators.left.selector + ', ' + params.paginators.right.selector).on('click.pagination', callback);
                },

                /**
                 * Detach DOM event listeners
                 */
                detachListeners: function () {
                    $(params.paginators.left.selector + ', ' + params.paginators.right.selector).off('click.pagination');
                },

                /**
                 * Set the module page reference by the current filter index
                 * @param {Int} index Filter index value (0 based)
                 */
                setPageByFilter: function (index) {
                    params.page = (index * (mediatorConfig.numPages / mediatorConfig.numFilters));

                    methods.setPaginatorStatus();
                },

                /**
                 * Set the module page reference by position change
                 * @param {Int} newPosition The new carousel position
                 * @param {Int} oldPosition The previous carousel position
                 */
                setPageByPosition: function (newPosition, oldPosition) {
                    if (newPosition > oldPosition) {
                        params.page++;
                    } else if (newPosition < oldPosition) {
                        params.page--;
                    }

                    methods.setPaginatorStatus();
                },

                /**
                 * Set the pagination button status
                 */
                setPaginatorStatus: function () {
                    params.paginators.left.enabled = (params.page === 0) ? false : true;
                    params.paginators.right.enabled = (params.page >= (mediatorConfig.numPages - 1)) ? false : true;

                    methods.performPaginatorUpdate();
                },

                /**
                 * Update the DOM to reflect pagination button status
                 */
                performPaginatorUpdate: function () {
                    var key, selector;
                    for (key in params.paginators) {
                        if (params.paginators.hasOwnProperty(key)) {
                            selector = $(params.paginators[key].selector).removeClass('disabled');
                            if (!params.paginators[key].enabled) {
                                selector.addClass('disabled');
                            }
                        }
                    }
                }
            };

        return Facade.extend({
            init: function () {
                var that = this,
                    key;

                // Merge settings and default config
                for (key in settings) {
                    if (settings.hasOwnProperty(key)) {
                        params[key] = settings[key];
                    }
                }

                methods.attachListeners(function () {
                    that.signals.Clicked.dispatch(this.id);
                });

                this._super();
            },
            teardown: function () {
                methods.detachListeners();

                this._super();
            },
            updatePosition: function (newPosition, oldPosition) {
                methods.setPageByPosition(newPosition, oldPosition);
            },
            updateToFilter: function (filterIndex) {
                methods.setPageByFilter(filterIndex);
            },

            signals: {
                Clicked: new Signal()
            }
        });
    };
});