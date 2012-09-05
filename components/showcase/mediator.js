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
            require(['./modules/' + this.config.showcaseType], function (module) {
                that.addModule(module);
                that.ready(module);
            });

            this.modules.Pagination.updatePosition('start');
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

        onCarouselMoved: function (position) {
            if (this.modules.Pagination) {
                this.modules.Pagination.updatePosition(position);
            }
        },

        onCarouselAtStart: function () {
            if (this.modules.Pagination) {
                this.modules.Pagination.updatePosition('start');
            }
        },

        onCarouselAtEnd: function () {
            if (this.modules.Pagination) {
                this.modules.Pagination.updatePosition('end');
            }
        }
    });

    return mediator;
});