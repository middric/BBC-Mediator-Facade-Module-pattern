define(['./class'], function (Class) {
    var Facade = Class.extend({
        init: function () {
            this.attach();
            this.setup();
        },
        setup: function () {},

        attach: function () {
            var key;

            for (key in this.signals) {
                if (this.signals.hasOwnProperty(key)) {
                    this.signals[key].active = true;
                }
            }
        },

        detach: function () {
            var key;

            for (key in this.signals) {
                if (this.signals.hasOwnProperty(key)) {
                    this.signals[key].active = false;
                }
            }
        },

        merge: function (params, settings) {
            return this._deepExtend(params, settings);
        },

        _deepExtend: function (destination, source) {
            for (var property in source) {
                if (source[property] && source[property].constructor &&
                    source[property].constructor === Object) {
                    destination[property] = destination[property] || {};
                    arguments.callee(destination[property], source[property]);
                } else {
                    destination[property] = source[property];
                }
            }
            return destination;
        },

        signals: []
    });

    return Facade;
});