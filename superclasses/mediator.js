define(['require', './class'], function (require, Class) {
    var Mediator = Class.extend({
        config: {},

        /**
         * Modules this component is reliant on
         * @type {Array}
         */
        moduleConstructors: [],

        /**
         * Loaded facade objects
         * @type {Object}
         */
        modules: {},

        init: function (settings) {
            var key, i;

            // Merge settings and default config
            for (key in settings) {
                if (settings.hasOwnProperty(key)) {
                    this.config[key] = settings[key];
                }
            }

            for (i = this.moduleConstructors.length - 1; i >= 0; i--) {
                this.ready(this.moduleConstructors[i]);
            }
        },

        addModule: function (Module) {
            this.moduleConstructors.push(Module);
        },

        ready: function (Module) {
            var name = Module.toString().match(/^function (\w+)/)[1],
                listener = function () {
                    this[method].apply(this, arguments);
                    
                    // Stop non-mediator code hijacking this event
                    m.signals[signal].halt();
                },
                m, signal, method;

            if (name) {
                m = new Module(this.config[name]);
                m.setup();
                this.modules[name] = m;
                // Set up signals
                for (signal in m.signals) {
                    if (m.signals.hasOwnProperty(signal)) {
                        method = 'on' + name + signal;
                        if (this[method] && typeof this[method] === 'function') {
                            m.signals[signal].add(listener, this);
                        } else {
                            if (this.config.debug) {
                                console.warn('Module signal has no corresponding listener method.', name, signal, method);
                            }
                        }
                    }
                }
            } else {
                if (this.config.debug) {
                    console.warn('Module name not defined.', module);
                }
            }
        },
        
        teardown: function () {
            var i;
            // Destroy each facade in turn
            for (i = this.modules.length - 1; i >= 0; i--) {
                this.modules[i].teardown();
            }
        }
    });

    return Mediator;
});