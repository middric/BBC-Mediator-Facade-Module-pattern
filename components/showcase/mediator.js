define(['require', 'json!./config.json', 'superclasses/mediator', './modules/paginationModule'], function (require, config, Mediator, Pagination) {
    var mediator = Mediator.extend({

        config: config,

        init: function (settings) {
            var that = this, key;
            this.addModule(Pagination);

            this._super(settings);

            // Load any variable dependencies
            require(['./modules/' + this.config.showcaseType], function (module) {
                that.addModule(module);
                that.ready(module);
            });
        },

        onPaginationClicked: function (dir) {
            if (this.modules.Carousel) {
                this.modules.Carousel.move(dir);
            }
        },

        onCarouselMoved: function (position) {
            if (this.modules.Pagination) {
                this.modules.Pagination.updatePosition(position);
            }
        }
    });

    return mediator;
});