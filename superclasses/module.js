define(['require', './class'], function (require, Class) {
    var Module = Class.extend({
        init: function() {},
        setup: function () {},
        teardown: function () {},
        signals: []
    });

    return Module;
});