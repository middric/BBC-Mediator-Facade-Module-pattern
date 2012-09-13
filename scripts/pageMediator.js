require([
    'jRespond',
    'json!breakpoints.json',
    'components/showcase/showcaseMediator'
], function (jRespond, breakpointsConfig, Showcase) {
    var sc = new Showcase({
        numPAges: 1
    });










    sc.signals.Loaded.addOnce(function () {
        // Ghetto removal of loader class
        document.getElementById('stream').className = '';
    });
    
    jRespond = jRespond(breakpointsConfig);
    jRespond.addFunc({
        breakpoint: ['one', 'two'],
        enter: function () {
            sc.pause();
        }
    });
    jRespond.addFunc({
        breakpoint: ['three', 'four'],
        enter: function () {
            sc.resume();
        }
    });
});