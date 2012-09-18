define([
    'require',
    'jquery',
    'signals',
    'json!./config.json',
    'superclasses/mediator',
    './modules/imageryModule'
], function (require, $, Signal, config, Mediator, Imagery) {
    var mediator = Mediator.extend({

        config: config,
        modules: {},
        moduleConstructors: [],

        init: function (settings) {
            var that = this, key;
            this.addModules(Imagery);
            this._super(settings);
        },

        run: function () {
            this.modules.Imagery.evaluate();
        },

        /**
         * Pass up the signal to the page mediator, so it can do what it likes
         * @return {void}
         */
        onImageryEvaluated: function () {
            this.signals.Ran.dispatch();
        },

        signals: {
            // Fires every time new images are loaded
            Ran: new Signal()
        }
    });

    return mediator;
});