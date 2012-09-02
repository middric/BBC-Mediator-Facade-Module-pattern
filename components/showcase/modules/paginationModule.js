define(['jquery', 'signals', 'superclasses/facade'], function ($, Signal, Facade) {
    return function Pagination(settings) {
        var params = {},
            methods = {
                setPage: function (currentPosition) {
                    switch (currentPosition) {
                    case 'start':
                        params.paginators.left.enabled = false;
                        break;
                    case 'end':
                        params.paginators.right.enabled = false;
                        break;
                    default:
                        params.paginators.left.enabled = true;
                        params.paginators.right.enabled = true;
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
                var i;
                $('#' + params.paginators.join(', #')).off('click.filters');

                this._super();
            },
            updatePosition: function (position) {
                var key;
                methods.setPage(position);
                for (key in params.paginators) {
                    if (params.paginators.hasOwnProperty(key)) {
                        if (!params.paginators[key].enabled) {
                            $(params.paginators[key].selector).addClass('disabled');
                        } else {
                            $(params.paginators[key].selector).removeClass('disabled');
                        }
                    }
                }
            },

            signals: {
                Clicked: new Signal()
            }
        });
    };
});