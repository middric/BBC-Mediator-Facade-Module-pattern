define(['jquery', 'signals', 'superclasses/facade'], function ($, Signal, Facade) {
    return function Filters(settings, mediatorConfig) {
        var params = {},
            methods = {
                /**
                 * Attach DOM event listeners
                 * @param {Function} callback Function to execute on event
                 */
                attachListeners: function (callback) {
                    methods.getFilters().on('click.filters', function (e) {
                        methods.setFilter($(this).index(), callback);

                        e.preventDefault();
                    });
                },

                /**
                 * Detach DOM event listeners
                 */
                detachListeners: function () {
                    methods.getFilters().off('click.filters');
                },

                /**
                 * Set the module filter reference
                 * @param {Index}    index    The filter index
                 * @param {Function} callback Function to execute after setting the filter
                 */
                setFilter: function (index, callback) {
                    params.currentFilter = index;

                    methods.performFilterUpdate();

                    if (typeof callback === 'function') {
                        callback();
                    }
                },

                /**
                 * Update the DOM to reflect the current filter
                 */
                performFilterUpdate: function () {
                    methods.getFilters()
                        .removeClass('selected')
                        .eq(params.currentFilter)
                        .addClass('selected');
                },

                /**
                 * Get a reference to the DOM filter buttons
                 * @return {Object} jQuery object containing the filter buttons
                 */
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
                    that.signals.Changed.dispatch(
                        $('#' + params.containerID + ' a:eq(' + (params.currentFilter) + ')').attr('data-id'),
                        0
                    );
                });

                this._super();
            },
            teardown: function () {
                methods.detachListeners();

                this._super();
            },

            updateFilter: function (page) {
                var filter = Math.floor(page / (mediatorConfig.numPages / mediatorConfig.numFilters));

                this.signals.Changed.dispatch(
                    $('#' + params.containerID + ' a:eq(' + (filter) + ')').attr('data-id'),
                    page
                );
                
                methods.setFilter(filter);
            },

            getIndexById: function (id) {
                return $('#' + params.containerID + ' a[data-id="' + id + '"]').parent('li').index();
            },

            signals: {
                Clicked: new Signal(),
                Changed: new Signal()
            }
        });
    };
});