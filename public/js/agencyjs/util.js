/**
 * Created by shaun on 1/13/14.
 */

var agency = agency || {};

agency.def = function(val, alt) {
    return (typeof(val) === "undefined") ? alt : val;
};

if (typeof Object.create !== 'function') {
    Object.create = function (o) {
        function F() {}
        F.prototype = o;
        return new F();
    };
}