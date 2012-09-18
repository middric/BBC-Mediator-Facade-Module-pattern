define(['showcaseMediator'], function (Showcase) {
    describe("Showcase", function () {
        var sc = new Showcase();
        it("has instantiated attached modules", function () {
            expect(sc.moduleConstructors.length).toEqual(Object.keys(sc.modules).length);
        });
    });
});