define(['jquery', 'signals', 'superclasses/facade'], function ($, Signal, Facade) {
    return function Imagery(settings, mediatorConfig) {
        var cache = {},
            params = {
                // Flag to store evaluating state so we don't run multiple times
                _evaluating: false,
                // Params that could be overridden by config.json - here because
                // if they weren't defined, the script would error
                id: "responsive-placeholder",
                selector: ".r-image"
            },
            methods = {
                /**
                 * Finds the element on the page and returns a jQuery object of it
                 * If not found, it is created and returned
                 * @return {jQuery}
                 */
                getPlaceholder: function () {
                    var el = document.getElementById(params.id);
                    if (el) {
                        return $(el);
                    }
                    return $('<div id="' + params.id + '" class="placeholder"><div class="height"></div><div class="width"></div></div>').appendTo('body');
                },
                /**
                 * Get width and height for a 'type' (a class)
                 * @param  {string} t The image 'type', or class
                 * @return {object}   Object containing width and height properties
                 */
                getWidthHeightForType: function (t) {
                    cache.$placeholder.addClass(t);
                    var width = parseInt(cache.$placeholder.find('.width').css('z-index'), 10) || 0,
                        height = parseInt(cache.$placeholder.find('.height').css('z-index'), 10) || 0;
                    cache.$placeholder.removeClass(t);

                    return {
                        'width': width,
                        'height': height
                    };
                },
                /**
                 * Renders an image
                 * @param  {Node} el The responsive image div
                 * @return {void}
                 */
                render: function (el) {
                    var type = el.getAttribute('data-ip-type') || false,
                        src = el.getAttribute('data-ip-src') || false,
                        alt = el.getAttribute('data-ip-alt') || '',
                        variables = [],
                        i, dimensions, matches, pattern, url;

                    // No image source? Nothing to do
                    if (!src) {
                        return;
                    }

                    // Find a pattern from the config for the URL, or quit
                    pattern = methods.validateSrc(src);
                    if (!pattern || !pattern.regex || !pattern.variables) {
                        return;
                    }

                    // Split the URL up
                    matches = src.match(pattern.regex);

                    // Find the image width and height that we use in this breakpoint
                    dimensions = methods.getWidthHeightForType(type);

                    // Replace the width and height with the new ones
                    matches[pattern.variables.width] = dimensions.width;
                    matches[pattern.variables.height] = dimensions.height;

                    // Remove the first match, as it's the entire URL
                    matches.shift();

                    // Join the remaining pieces back together to form the full URL
                    url = matches.join('');

                    // Find the IMG tag, and set the source...
                    for (i in el.childNodes) {
                        if (el.childNodes[i].nodeName === "IMG") {
                            el.childNodes[i].src = url;
                            return;
                        }
                    }

                    // ..or if we can't find it, add a new img tag
                    $('<img src="' + url + '" alt="' + alt + '" />').appendTo(el);
                },
                /**
                 * Iterates through the patterns provided by the config to find one
                 * that matches. If it does, it returns the pattern, otherwise false.
                 * @param  {string} src The Image Src URL
                 * @return {mixed}     The pattern object, or false
                 */
                validateSrc: function (src) {
                    var pattern, re;
                    for (pattern in params.patterns) {
                        if (params.patterns.hasOwnProperty(pattern)) {
                            re = new RegExp(params.patterns[pattern].regex);
                            if (!!src.match(re)) {
                                return params.patterns[pattern];
                            }
                        }
                    }

                    return false;
                }
            };

        return Facade.extend({
            /**
             * Initialiser
             * Sets up configuration
             * @return {void}
             */
            init: function () {
                params = this.merge(params, settings);
                cache.$placeholder = methods.getPlaceholder();
                this._super();
            },
            /**
             * Iterate over the images on the page and load the best size for
             * the current breakpoint
             * @return {void}
             */
            evaluate: function () {
                // Ensure only one evaluate function is run at a time
                if (!params._evaluating) {
                    params._evaluating = true;

                    // No cached selector used, as new images could been added to the page
                    $(params.selector).each(function () {
                        methods.render(this);
                    });

                    params._evaluating = false;

                    // Tell the mediator we're done
                    this.signals.Evaluated.dispatch();
                }
            },
            signals: {
                // Ran after the images on the page are re-evaluated
                Evaluated: new Signal()
            }
        });
    };
});