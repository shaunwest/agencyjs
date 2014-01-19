/**
 * Created by shaun on 1/13/14.
 */

var agency = agency || {};

agency.def = function(val, alt) {
    return (typeof(val) === "undefined") ? alt : val;
};

// distance = pixels
// totalTime = milliseconds
agency.getVelocity = function(distance, totalTime) {
    return distance / totalTime;
};

agency.getTimestep = function(totalTime, distance) {
    return totalTime / distance;
};

// velocity = pixels per millisecond
// timeStep = millisecond
agency.getDelta = function (velocity, timeStep) {
    return velocity * timeStep;
};

if (typeof Object.create !== 'function') {
    Object.create = function (o) {
        function F() {}
        F.prototype = o;
        return new F();
    };
}