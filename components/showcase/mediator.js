define([
    'require',
    'json!./config.json',
    'superclasses/mediator',
    './modules/paginationModule',
    './modules/filtersModule',
    './modules/historyModule'
], function (require, config, Mediator, Pagination, Filters, History) {
    var mediator = Mediator.extend({

        config: config,

        init: function (settings) {
            var that = this, key;
            this.addModules(Pagination, Filters, History);

            this._super(settings);

            // Load any variable dependencies
            require(['./modules/' + this.config.Mediator.showcaseType], function (module) {
                that.addModule(module);
                that.ready(module);

                that.modules.Carousel.moveToFilter(0);
            });
        },

        onFiltersClicked: function (index) {
            if (this.modules.Carousel) {
                this.modules.Carousel.moveToFilter(index);
            }
        },

        onPaginationPaged: function (dir, page) {
            if (this.modules.Carousel) {
                this.modules.Carousel.moveInDirection(dir);
            }
        },

        onPaginationPageComplete: function (page) {
            this.modules.Filters.updateFilter(page);
            this.modules.History.updateURL(null, page);
        },

        onCarouselMoved: function (newPosition, oldPosition) {
            this.modules.Pagination.updatePosition(newPosition, oldPosition);
        },

        onCarouselMovedToFilter: function (index) {
            this.modules.Pagination.updateToFilter(index);
        },

        onFiltersChanged: function (filter, page) {
            this.modules.History.updateURL(filter, page);
        }
    });

    return mediator;
});