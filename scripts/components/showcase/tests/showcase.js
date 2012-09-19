define(['jquery', 'showcaseMediator', 'json!config.json'], function ($, Showcase, config) {
    $('<div id="' + config.Carousel.containerID + '">').appendTo('body');
    $('<div id="' + config.Filters.containerID + '"><a class="filter-name" data-id="filter-id"></a></div>').appendTo('body');

    var sc = new Showcase({ testMode: true });

    describe("Showcase", function () {
        var loaded = false;
        
        sc.signals.Loaded.addOnce(function () { loaded = true; });

        it("has instantiated attached modules", function () {
            var size = 0, key;
            for (key in sc.modules) {
                if (sc.modules.hasOwnProperty(key)) {
                    size++;
                }
            }
            expect(sc.moduleConstructors.length).toEqual(size);
        });

        it("has fired the Loaded signal", function () {
            waitsFor(
                function () { return loaded; },
                "Showcase never completed loading or never fired the Loaded signal",
                10000
            );
            runs(function () {
                expect(loaded).toBeTruthy();
            });
        });

        describe("Carousel", function () {
            var module,
                signalTest = function (err, signal, method) {
                var fired = false;
                signal.addOnce(function () { fired = true; });
                method.apply(module, Array.prototype.slice.call(arguments, 3));

                waitsFor(function () { return fired; }, err, 10000);
                runs(function () { expect(fired).toEqual(true); });
            };

            it("has loaded", function () {
                waitsFor(
                    function () {
                        module = sc.modules.Carousel;
                        return module;
                    },
                    "Carousel module never loads",
                    10000
                );
                runs(function () {
                    expect(module).toBeTruthy();
                });
            });

            it("has fired the 'Moved' signal on moveInDirection", function () {
                signalTest(
                    "Carousel module does not fire 'Moved' signal",
                    module.signals.Moved,
                    module.moveInDirection,
                    'scroll-right'
                );
            });

            it("has fired the 'Moved' signal on moveToPage", function () {
                signalTest(
                    "Carousel module does not fire 'Moved' signal",
                    module.signals.Moved,
                    module.moveToPage,
                    1
                );
            });

            it("has fired the 'MovedToFilter' signal on moveToFilter", function () {
                signalTest(
                    "Carousel module does not fire 'MovedToFilter' signal",
                    module.signals.MovedToFilter,
                    module.moveToFilter,
                    0
                );
            });
        });
    });
});