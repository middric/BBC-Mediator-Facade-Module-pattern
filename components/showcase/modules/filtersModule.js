define(['jquery', 'signals', 'superclasses/facade'], function ($, Signal, Facade) {
    return function Filters(settings, mediatorConfig) {
        var params = {},
            methods = {
                attachListeners: function (callback) {
                    methods.getFilters().on('click.filters', function (e) {
                        methods.setFilter($(this).index(), callback);

                        e.preventDefault();
                    });
                },

                detachListeners: function () {
                    methods.getFilters().off('click.filters');
                },

                setFilter: function (index, callback) {
                    params.currentFilter = index;

                    methods.performFilterUpdate();

                    if (typeof callback === 'function') {
                        callback();
                    }
                },

                performFilterUpdate: function () {
                    methods.getFilters()
                        .removeClass('selected')
                        .eq(params.currentFilter)
                        .addClass('selected');
                },

                getFilters: function () {
                    if (!params._filters) {
                        params._filters = $('#' + params.containerID + ' li');
                    }
                    return params._filters;
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

            updatePosition: function () {

            },

            signals: {
                Clicked: new Signal()
            }
        });
    };
});