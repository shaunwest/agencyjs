/**
 * Created by shaun on 1/13/14.
 */


agency.actionFactory = (function() {
    var objects = [],
        template =  {
            $node       : null,
            startX      : 0,
            startY      : 0,
            timeSteps   : 0,
            timeStep    : 0,
            velocityX   : 0,
            velocityY   : 0
        };

    function resetObject(object) {
        for(var prop in object) {
            if(object.hasOwnProperty(prop)) {
                object[prop] = template[prop];
            }
        }
    }

    function objectIsCached(object) {
        var count = objects.length,
            i;

        for(i = 0; i < count; i++) {
            if(objects[i] === object) {
                return true;
            }
        }
        return false;
    }

    return {
        getObject: function() {
            var object = objects.pop();

            if(!object) {
                object = Object.create(template);
            }

            return object;
        },

        freeObject: function(object) {
            resetObject(object);

            if(!objectIsCached(object)) {
                objects.push(object);
            }
        }
    };
})();