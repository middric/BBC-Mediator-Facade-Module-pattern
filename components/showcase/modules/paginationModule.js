define(['jquery', 'signals', 'superclasses/facade'], function ($, Signal, Facade) {
    return function Pagination(settings) {
        var params = {},
            methods = {
                attachListeners: function (callback) {
                    callback = (typeof callback !== 'function') ? function () {} : callback;

                    $(params.paginators.left.selector + ', ' + params.paginators.right.selector).on('click.filters', callback);
                },

                detachListeners: function () {
                    $(params.paginators.left.selector + ', ' + params.paginators.right.selector).off('click.filters');
                },

                setPage: function (currentPosition, callback) {
                    params.paginators.left.enabled = (currentPosition === 'start') ? false : true;
                    params.paginators.right.enabled = (currentPosition === 'end') ? false : true;

                    methods.performPagintorUpdate();
                },

                performPagintorUpdate: function () {
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
            updatePosition: function (position) {
                methods.setPage(position);
            },

            signals: {
                Clicked: new Signal()
            }
        });
    };
});