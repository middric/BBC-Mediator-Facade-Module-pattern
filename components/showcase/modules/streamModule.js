define('modules/stream', function () {
    var Stream = function () {
        return {
            move: function (dif, el, callback) {
                //performMove
                if (callback && typeof callback === 'function') {
                    callback();
                }
            }
        };
    };

    return Stream;
});