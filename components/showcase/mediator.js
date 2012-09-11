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

        historyPopped: false,

        init: function (settings) {
            var that = this, key;
            this.addModules(Pagination, Filters, History);

            this._super(settings);

            // Load any variable dependencies
            require(['./modules/' + this.config.Mediator.showcaseType], function (module) {
                that.addModule(module);
                that.ready(module);

                that.modules.Carousel.moveToFilter(0, 0);
            });
        },

        resume: function () {
            if (this.modules.Carousel) {
                this.modules.Carousel.moveToFilter(0, 0);
            }

            this._super();
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
            if (this.modules.Filters) {
                this.modules.Filters.updateFilter(page);
            }
        },

        onCarouselMoved: function (position) {
            if (this.modules.Pagination) {
                this.modules.Pagination.updatePosition(position);
            }
        },

        onCarouselMovedToFilter: function (index) {
            if (this.modules.Pagination) {
                this.modules.Pagination.updateToFilter(index);
            }
        },

        onFiltersChanged: function (filter, page) {
            if (this.modules.History && !this.historyPopped) {
                this.modules.History.updateURL(filter, page);
            }
            this.historyPopped = false;
        },

        onHistoryPopState: function (attributes) {
            var filter = this.modules.Filters.getIndexById(attributes.r1),
                page = (filter * (this.config.Mediator.numPages / this.config.Mediator.numFilters)) + attributes.r2;

            if (this.modules.Carousel) {
                this.historyPopped = true;
                this.modules.Carousel.moveToPage(page);
            }
        }
    });

    return mediator;
});