/**
 * Created by shaun on 1/18/14.
 */


var agency = agency || {};


agency.path = {
    config: null,

    target: function(pathConfig) {
        this.config = pathConfig;
    },

    setPosition: function(timeStep) {
        var positionX = agency.getDelta(this.config.velocityX, timeStep),
            positionY = agency.getDelta(this.config.velocityY, timeStep);

        this.config.$node.offset({left: this.config.startX + positionX, top: this.config.startY + positionY});
    },

    restart: function() {
        this.setPosition(this.config.timeStep = 0);
    },

    travel: function() {
        if(this.config.timeStep < this.config.timeSteps) {
            this.setPosition(this.config.timeStep++);
            return true;
        }

        return false;
    }
};