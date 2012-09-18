define(['showcaseMediator'], function (Showcase) {
    describe("Showcase", function () {
        var sc = new Showcase(),
            loaded = false;
        
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
});