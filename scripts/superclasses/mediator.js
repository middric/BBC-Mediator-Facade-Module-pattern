define(['./class'], function (Class) {
    var Mediator = Class.extend({

        init: function (settings) {
            this.updateConfig(settings);
        },

        /**
         * Update facade configuration
         * @param  {Object} settings
         */
        updateConfig: function (settings) {
            var module, name;

            // Merge settings and default config
            this.config = this._deepExtend(this.config, settings);

            for (module in this.modules) {
                if (this.modules[module].updateConfig && typeof this.modules[module].updateConfig === 'function') {
                    this.modules[module].updateConfig(this.config[module], this.config.Mediator);
                }
            }
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

        /**
         * Add module constructor to the list of modules
         * @param {Function} Module A module constructor
         */
        addModule: function (Module) {
            var err = false;
            if (!this.moduleConstructors) {
                console.error('Component mediator missing vital parameter, moduleConstructor: []');
                this.moduleConstructors = [];
                err = true;
            }
            if (!this.modules) {
                console.error('Component mediator missing vital parameter, modules: {}');
                this.modules = {};
                err = true;
            }

            if (!err) {
                this.moduleConstructors.push(Module);
            }
        },

        /**
         * Add an arbitrary number of modules
         */
        addModules: function () {
            var i;

            for (i = arguments.length - 1; i >= 0; i--) {
                this.addModule(arguments[i]);
            }

            // Run module constructors
            for (i = this.moduleConstructors.length - 1; i >= 0; i--) {
                this.ready(this.moduleConstructors[i]);
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
                    if (this.config.Mediator.debug) {
                        console.markTimeline('Signal: ' + listenerMethod);
                        console.log('Module signal fired - ' + listenerMethod, args);
                    }

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
                            if (this.config.Mediator.debug) {
                                console.warn('Module signal has no corresponding listener method.', name, signal, method);
                            }
                        }
                    }
                }
            } else {
                if (this.config.Mediator.debug) {
                    console.warn('Module name not defined.', module);
                }
            }
        },

        setup: function () {
            var key;
            for (key in this.modules) {
                if (this.modules.hasOwnProperty(key)) {
                    this.modules[key].setup();
                }
            }
        },

        resume: function () {
            var key;
            for (key in this.modules) {
                if (this.modules.hasOwnProperty(key)) {
                    this.modules[key].attach();
                    this.modules[key].setup();
                }
            }
        },

        /**
         * Stop the mediator and associated modules
         */
        pause: function () {
            var key;
            for (key in this.modules) {
                if (this.modules.hasOwnProperty(key)) {
                    this.modules[key].detach();
                }
            }
        }
    });

    return Mediator;
});