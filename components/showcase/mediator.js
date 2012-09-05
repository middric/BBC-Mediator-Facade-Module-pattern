define([
    'require',
    'json!./config.json',
    'superclasses/mediator',
    './modules/paginationModule',
    './modules/filtersModule'
], function (require, config, Mediator, Pagination, Filters) {
    var mediator = Mediator.extend({

        config: config,

        init: function (settings) {
            var that = this, key;
            this.addModules(Pagination, Filters);

            this._super(settings);

            // Load any variable dependencies
            require(['./modules/' + this.config.Mediator.showcaseType], function (module) {
                that.addModule(module);
                that.ready(module);
            });

            this.modules.Pagination.updatePosition(0, 0);
        },

        onFiltersClicked: function (index) {
            if (this.modules.Carousel) {
                this.modules.Carousel.moveToFilter(index);
            }
        },

        onPaginationClicked: function (dir) {
            if (this.modules.Carousel) {
                this.modules.Carousel.moveInDirection(dir);
            }
        },

        onCarouselMoved: function (newPosition, oldPosition) {
            this.modules.Pagination.updatePosition(newPosition, oldPosition);
        },

        onCarouselMovedToFilter: function (index) {
            this.modules.Pagination.updateToFilter(index);
        }
    });

    return mediator;
});