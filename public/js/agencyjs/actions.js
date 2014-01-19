/**
 * Created by shaun on 1/13/14.
 */

var agency = agency || {};

agency.newPath = function(nodeId, targetX, targetY) {
    var $node   = $(nodeId),
        nodeX   = $node.offset().left,
        nodeY   = $node.offset().top,
        path  = agency.actionFactory.getObject(),
        timeSteps = 100;

    targetX = agency.def(targetX, nodeX);
    targetY = agency.def(targetX, nodeY);

    path['$node']     = $node;
    path['startX']    = nodeX;
    path['startY']    = nodeY;
    path['timeSteps'] = timeSteps;
    path['timeStep']  = 0;
    path['velocityX'] = agency.getVelocity(targetX - nodeX, timeSteps);
    path['velocityY'] = agency.getVelocity(targetY - nodeY, timeSteps);

    return path;
};

