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

        signals: []
    });

    return Facade;
});