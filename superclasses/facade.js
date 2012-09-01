define(['require', './class'], function (require, Class) {
    var Facade = Class.extend({
        init: function() {
            //console.log(params);
        },
        setup: function () {},
        teardown: function () {},
        signals: []
    });

    return Facade;
});