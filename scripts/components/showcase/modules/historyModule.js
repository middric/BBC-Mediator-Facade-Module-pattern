define(['jquery', 'signals', 'superclasses/facade'], function ($, Signal, Facade) {
    return function History(settings, mediatorConfig) {
        var params = {
            replacements: []
        },
            methods = {
                attachHistoryAPI: function (callback) {
                    $(window).on('popstate.history', function (e) {
                        if (e.originalEvent.state && typeof callback === 'function') {
                            callback(e.originalEvent.state);
                        }
                    });
                },

                detachHistoryAPI: function () {
                    $(window).off('popstate.history');
                },

                updateURL: function (r1, r2) {
                    var url = params.pattern.replace('$1', r1).replace('$2', r2);

                    /*if (window.history && window.history.pushState) {
                        window.history.pushState({r1: r1, r2: r2}, '', url);
                    }*/

                    params.replacements[0] = r1;
                    params.replacements[1] = r2;
                }
            };

        return Facade.extend({
            init: function () {
                params = this.merge(params, settings);

                this._super();
            },

            attach: function () {
                var that = this;

                methods.attachHistoryAPI(function (attributes) {
                    that.signals.PopState.dispatch(attributes);
                });

                this._super();
            },

            detach: function () {
                methods.detachHistoryAPI();

                this._super();
            },

            updateURL: function (r1, r2) {
                r1 = r1 || params.replacements[0];
                r2 = (r2 % (mediatorConfig.numPages / mediatorConfig.numFilters)) + 1;
                if (params.replacements[0] !== r1 || params.replacements[1] !== r2) {
                    methods.updateURL(r1, r2);
                }
            },

            signals: {
                PopState: new Signal()
            }
        });
    };
});