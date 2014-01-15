/**
 * Created by shaun on 1/13/14.
 */


agency.actionFactory = (function() {
    var objects = [],
        template =  {
            $node       : null,
            targetX     : 0,
            targetY     : 0,
            deltaX      : 0,
            deltaY      : 0,
            distanceX   : 0,
            distanceY   : 0
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