require([
    'jquery',
    'jRespond',
    'json!breakpoints.json',
    'components/showcase/showcaseMediator',
    'components/responsiveimages/responsiveimagesMediator'
], function ($, jRespond, breakpointsConfig, Showcase, ResponsiveImages) {
    // Set up JRespond with our configuration
    jRespond = jRespond(breakpointsConfig);

    // Initialise Showcase
    var sc = new Showcase(),
        responsiveImages;

    // Once the Showcase has loaded, add some extra functionality
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
            sc.setup();
        };

        // Ghetto removal of loader class
        document.getElementById('stream').className = '';

        jRespond.addFunc({
            breakpoint: ['one', 'two'],
            enter: function () {
                sc.pause();
            },
            exit: function () {
                sc.resume();
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

    responsiveImages = new ResponsiveImages();

    // Set up so we run whenever a breakpoint changes
    jRespond.addFunc({
        breakpoint: '*',
        enter: function () {
            responsiveImages.run();
        }
    });

});