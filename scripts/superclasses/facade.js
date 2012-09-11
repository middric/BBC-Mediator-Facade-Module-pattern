define(['lib/require/require', './class'], function (require, Class) {
    var Facade = Class.extend({
        init: function () {
            this.resume();
        },
        setup: function () {},

        resume: function () {
            var key;

            for (key in this.signals) {
                if (this.signals.hasOwnProperty(key)) {
                    this.signals[key].active = true;
                }
            }
        },

        stop: function () {
            var key;

            for (key in this.signals) {
                if (this.signals.hasOwnProperty(key)) {
                    this.signals[key].active = false;
                }
            }
        },

        merge: function (params, settings) {
            var key;

            // Merge settings and default config
            for (key in settings) {
                if (settings.hasOwnProperty(key)) {
                    params[key] = settings[key];
                }
            }

            return params;
        },

        signals: []
    });

    return Facade;
});