define(['require', 'superclasses/class'], function (require, Class) {
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
            var i = this.moduleConstructors.length - 1,
                key;

            // Merge settings and default config
            for (key in settings) {
                if (settings.hasOwnProperty(key)) {
                    this.config.Mediator[key] = settings[key];
                }
            }
            
            // Run module constructors
            for (; i >= 0; i--) {
                this.ready(this.moduleConstructors[i]);
            }
        },

        /**
         * Add module constructor to the list of modules
         * @param {Function} Module A module constructor
         */
        addModule: function (Module) {
            this.moduleConstructors.push(Module);
        },

        /**
         * Add an arbitrary number of modules
         */
        addModules: function () {
            for (var i = arguments.length - 1; i >= 0; i--) {
                this.addModule(arguments[i]);
            }
        },

        /**
         * Run after a module dependency has loaded. Runs the module
         * constructor, passes through config overrides, and maps module
         * signals to mediator listeners.
         *
         * @param  {Function} Module Module constructor
         */
        ready: function (Module) {
            var name = Module.toString().match(/^function (\w+)/)[1],
                listener = function (listenerMethod, signalObject) {
                    var args = Array.prototype.slice.call(arguments, 2);
                    // Call mediator listener with original arguments
                    this[listenerMethod].apply(this, args);

                    // Stop event propogation in order to enforce the mediator/facade/module pattern
                    signalObject.halt();
                },
                moduleInstance, signal, method, binding;

            if (name) {
                moduleInstance = new (new Module(this.config[name], this.config.Mediator))();
                this.modules[name] = moduleInstance;

                // Set up signals
                for (signal in moduleInstance.signals) {
                    if (moduleInstance.signals.hasOwnProperty(signal)) {
                        method = 'on' + name + signal;
                        if (this[method] && typeof this[method] === 'function') {
                            // Set priority to Infinity so that the mediator listeners execute first
                            binding = moduleInstance.signals[signal].add(listener, this, Infinity);
                            binding.params = [method, moduleInstance.signals[signal]];
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
        
        /**
         * Tear down the mediator and associated modules
         */
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