define(['jquery', 'signals', 'superclasses/facade'], function ($, Signal, Facade) {
    return function Filters(settings) {
        var params = {},
            methods = {
                attachListeners: function (callback) {
                    $('#' + params.containerID + ' li').on('click.filters', function (e) {
                        methods.setFilter($(this).index(), callback);

                        e.preventDefault();
                    });
                },

                detachListeners: function () {
                    $('#' + params.containerID + ' li').off('click.filters');
                },

                setFilter: function (index, callback) {
                    params.currentFilter = index;

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

                methods.attachListeners(function () {
                    that.signals.Clicked.dispatch(params.currentFilter);
                });

                this._super();
            },
            teardown: function () {
                methods.detachListeners();

                this._super();
            },

            signals: {
                Clicked: new Signal()
            }
        });
    };
});