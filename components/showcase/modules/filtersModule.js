define(['jquery', 'signals', 'superclasses/facade'], function ($, Signal, Facade) {
    return function Filters(settings) {
        var params = {},
            methods = {
                attachListeners: function (callback) {
                    callback = (typeof callback !== 'function') ? function () {} : callback;

                    $('#' + params.containerID + ' li').on('click.filters', callback);
                },

                detachListeners: function () {
                    $('#' + params.containerID + ' li').off('click.filters');
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
                    var index = $(this).index();
                    that.signals.Clicked.dispatch(index);
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