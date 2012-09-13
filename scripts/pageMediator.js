require([
    'jquery',
    'jRespond',
    'json!breakpoints.json',
    'components/showcase/showcaseMediator'
], function ($, jRespond, breakpointsConfig, Showcase) {
    var sc = new Showcase();

    sc.signals.Loaded.addOnce(function () {
        var bpChange = function () {
            var config = {
                Mediator: {
                    pageWidth: $('.stream:first').width()
                },
                Carousel: {
                    offset: $('.stream:first li').width()
                }
            };

            sc.updateConfig(config);
            sc.calculate();
        };

        // Ghetto removal of loader class
        document.getElementById('stream').className = '';
    
        jRespond = jRespond(breakpointsConfig);
        jRespond.addFunc({
            breakpoint: ['one', 'two'],
            enter: function () {
                sc.pause();
            }
        });
        jRespond.addFunc({
            breakpoint: 'three',
            enter: bpChange
        });
        jRespond.addFunc({
            breakpoint: 'four',
            enter: bpChange
        });

    });
});