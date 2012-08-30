define(['require', 'json!./config.json', 'superclasses/mediator', './modules/filtersModule'], function(require, config, Mediator, Filters) {
    return Mediator.extend({

        config: config,

        init: function(settings) {
            var that = this, key;
            this.addModule(Filters);

            this._super(settings);

            // Load any variable dependencies
            require(['./modules/' + this.config.showcaseType], function (module) {
                that.addModule(module);
                that.ready(module);
            });
        },

        onFiltersClicked: function (dir) {
            if (this.modules.Carousel) {
                this.modules.Carousel.move(dir);
            }
        },

        onCarouselMoved: function (position) {
            if (this.modules.Filters) {
                this.modules.Filters.updatePosition(position);
            }
        }
    });
});