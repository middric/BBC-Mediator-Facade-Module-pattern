require(['jRespond', 'components/showcase/showcaseMediator'], function (jRespond, Showcase) {
    var sc = new Showcase();
    sc.signals.Loaded.addOnce(function () {
        // Ghetto removal of loader class
        document.getElementById('stream').className = '';
    });
    
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