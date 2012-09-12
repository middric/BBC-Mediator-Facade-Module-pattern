require(['jquery', 'jRespond', 'components/showcase/mediator'], function ($, jRespond, Showcase) {
    var sc = new Showcase({
        containerID: 'showcaseContainer',
        paginators: ['left', 'right']
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