define(['jquery', 'signals', 'superclasses/facade'], function ($, Signal, Facade) {
    return function Filters(settings, mediatorConfig) {
        var cache = {},
            params = {},
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
                var i, j;
                params = this.merge(params, settings);

                cache.filters = cache.filters || $('#' + params.containerID + ' a.filter-name');
                for (i = cache.filters.length - 1; i >= 0; i--) {
                    j = $(cache.filters[i]);
                    cache.filters[j.attr('data-id')] = j;
                    cache.filters[i] = j;
                }

                this._super();
            },

            attach: function () {
                var that = this;

                methods.attachListeners(function () {
                    that.signals.Clicked.dispatch(params.currentFilter);
                    that.signals.Changed.dispatch(
                        cache.filters[params.currentFilter].attr('data-id'),
                        0
                    );
                });

                this._super();
            },

            detach: function () {
                methods.detachListeners();

                this._super();
            },

            updateFilter: function (page) {
                var filter = Math.floor(page / (mediatorConfig.numPages / mediatorConfig.numFilters));
                this.signals.Changed.dispatch(
                    cache.filters[filter].attr('data-id'),
                    page
                );
                
                methods.setFilter(filter);
            },

            getIndexById: function (id) {
                return cache.filters[id].parent('li').index();
            },

            signals: {
                Clicked: new Signal(),
                Changed: new Signal()
            }
        });
    };
});