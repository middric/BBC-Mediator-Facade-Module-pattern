define(['jquery', 'signals', 'superclasses/facade'], function ($, Signal, Facade) {
    return function Pagination(settings) {
        var params = {},
            methods = {
                setPage: function (currentPosition, callback) {
                    params.paginators.left.enabled = (currentPosition === 'start') ? false : true;
                    params.paginators.right.enabled = (currentPosition === 'end') ? false : true;

                    if (typeof callback === 'function') {
                        callback();
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
                $(params.paginators.left.selector + ', ' + params.paginators.right.selector).on('click.filters', function () {
                    that.signals.Clicked.dispatch(this.id);
                });

                this._super();
            },
            teardown: function () {
                $('#' + params.paginators.join(', #')).off('click.filters');

                this._super();
            },
            updatePosition: function (position) {
                methods.setPage(position, function () {
                    var key, selector;
                    for (key in params.paginators) {
                        if (params.paginators.hasOwnProperty(key)) {
                            selector = $(params.paginators[key].selector).removeClass('disabled');
                            if (!params.paginators[key].enabled) {
                                selector.addClass('disabled');
                            }
                        }
                    }
                });
            },

            signals: {
                Clicked: new Signal()
            }
        });
    };
});