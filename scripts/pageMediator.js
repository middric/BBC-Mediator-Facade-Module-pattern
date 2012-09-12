require(['jRespond', 'components/showcase/showcaseMediator'], function (jRespond, Showcase) {
    var sc = new Showcase();
    
    jRespond = jRespond();
    jRespond.addFunc({
        breakpoint: 'handheld',
        enter: function () {
            sc.stop();
        },
        exit: function () {
            sc.resume();
        }
    });
});