require(['components/showcase/mediator'], function (Showcase) {
    var sc = new Showcase({
        containerID: 'showcaseContainer',
        paginators: ['left', 'right']
    });
});