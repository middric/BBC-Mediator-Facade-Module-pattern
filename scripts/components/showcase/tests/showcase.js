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
                function () {
                    return loaded;
                },
                "Showcase never completed loading or never fired the Loaded signal",
                10000
            );
            runs(function () {
                expect(loaded).toEqual(true);
            });
        });
    });

    describe("Carousel", function () {
        var module;

        it("has loaded", function () {
            var loaded = false;
            waitsFor(
                function () {
                    module = sc.modules.Carousel;
                    loaded = true;
                    return module;
                },
                "Carousel module never loads",
                10000
            );
            runs(function () {
                expect(loaded).toEqual(true);
            });
        });

        it("has fired the 'Moved' signal on moveInDirection", function () {
            var fired = false;
            module.signals.Moved.addOnce(function () {
                fired = true;
            });
            module.moveInDirection('scroll-right');

            waitsFor(
                function () {
                    return fired;
                },
                "Carousel module does not fire 'Moved' signal",
                10000
            );
            runs(function () {
                expect(fired).toEqual(true);
            });
        });

        it("has fired the 'Moved' signal on moveToPage", function () {
            var fired = false;
            module.signals.Moved.addOnce(function () {
                fired = true;
            });
            module.moveToPage(1);

            waitsFor(
                function () {
                    return fired;
                },
                "Carousel module does not fire 'Moved' signal",
                10000
            );
            runs(function () {
                expect(fired).toEqual(true);
            });
        });

        it("has fired the 'MovedToFilter' signal on moveToFilter", function () {
            var fired = false;
            module.signals.MovedToFilter.addOnce(function () {
                fired = true;
            });
            module.moveToFilter(0);

            waitsFor(
                function () {
                    return fired;
                },
                "Carousel module does not fire 'MovedToFilter' signal",
                10000
            );
            runs(function () {
                expect(fired).toEqual(true);
            });
        });
    });
});