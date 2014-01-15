/**
 * Created by shaun on 1/13/14.
 */

var agency = agency || {};

agency.move = function(nodeId, targetX, targetY) {
    var $node   = $(nodeId),
        nodeX   = $node.offset().left,
        nodeY   = $node.offset().top,
        action  = agency.actionFactory.getObject();

    targetX = agency.def(targetX, nodeX);
    targetY = agency.def(targetX, nodeY);

    action['$node']     = $node;
    action['targetX']   = targetX;
    action['targetY']   = targetY;
    action['deltaX']    = nodeX - targetX;
    action['deltaY']    = nodeY - targetY;

    agency.actions.push(action);
};