define(['jquery', 'signals', 'superclasses/facade'], function ($, Signal, Facade) {
    return function Pagination(settings) {
        var params = {},
            methods = {
                setPage: function (currentPosition) {
                    if (currentPosition === 0) {
                        $('#' + params.paginators[0]).css('color', '#ccc');
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

                $('#' + params.paginators.join(', #')).on('click.filters', function () { that.signals.Clicked.dispatch(this.id); });

                this._super();
            },
            teardown: function () {
                var i;
                $('#' + params.paginators.join(', #')).off('click.filters');

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