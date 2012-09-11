define(['signals', 'superclasses/facade'], function(Signal, Facade) {
    return function History(settings, mediatorConfig) {
        var params = {
            replacements: []
        },
            methods = {
                setupHistoryAPI: function(callback) {
                    window.addEventListener('popstate', function(e) {
                        if (e.state && typeof callback === 'function') {
                            callback(e.state);
                        }
                    });
                },

                updateURL: function(r1, r2) {
                    var url = params.pattern.replace('$1', r1).replace('$2', r2);

                    if (window.history && window.history.pushState) {
                        window.history.pushState({r1: r1, r2: r2}, '', url);
                    }

                    params.replacements[0] = r1;
                    params.replacements[1] = r2;
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

                methods.setupHistoryAPI(function (attributes) {
                    that.signals.PopState.dispatch(attributes);
                });

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