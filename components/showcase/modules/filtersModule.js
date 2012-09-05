define(['jquery', 'signals', 'superclasses/facade'], function ($, Signal, Facade) {
    return function Filters(settings) {
        var params = {},
            methods = {
                attachListeners: function (callback) {
                    $('#' + params.containerID + ' li').on('click.filters', function () {
                        methods.setFilter($(this).index(), callback);
                    });
                },

                detachListeners: function () {
                    $('#' + params.containerID + ' li').off('click.filters');
                },

                setFilter: function (index, callback) {
                    params.currentFilter = index;

                    callback = (typeof callback !== 'function') ? function () {} : callback;
                    callback();
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

                methods.attachListeners(function (e) {
                    that.signals.Clicked.dispatch(params.currentFilter);
                    e.preventDefault();
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