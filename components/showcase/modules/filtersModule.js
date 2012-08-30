define(['jquery', 'signals'], function ($, Signal) {
    return function Filters(settings) {
        var params = {},
            methods = {
                setPage: function (currentPosition) {
                    if (currentPosition === 0) {
                        $('#' + params.paginators[0]).css('color', '#ccc');
                    }
                }
            };

        return {
            setup: function () {
                var that = this,
                    key;

                // Merge settings and default config
                for (key in settings) {
                    if (settings.hasOwnProperty(key)) {
                        params[key] = settings[key];
                    }
                }

                $('#' + params.paginators.join(', #')).on('click.filters', function () { that.signals.Clicked.dispatch(this.id); });
            },
            teardown: function () {
                var i;
                $('#' + params.paginators.join(', #')).off('click.filters');
            },
            signals: {
                Clicked: new Signal()
            },

            updatePosition: function (position) {
                methods.setPage(position);
            }
        };
    };
});