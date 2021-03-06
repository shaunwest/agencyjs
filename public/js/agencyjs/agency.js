/**
 * Created by shaun on 1/12/14.
 */

var agency = agency || {};

agency.start = function() {
    var STYLES = '<style type="text/css">' +
        '.aj-base { font-family: sans-serif }' +
        '.aj-debug { position: absolute; color: white; background-color: black; width: 32px; height: 25px; }' +
        '.aj-viewport { position: relative; width: 500px; height: 500px; background-color: #0d3349; overflow: hidden;}' +
        '.aj-node { position: absolute; color: white; width: 100px; height: 100px; ' +
            'transform:translate3d(0,0,0);' +
            '-ms-transform:translate3d(0,0,0);' +
            '-webkit-transform:translate3d(0,0,0); }' +
        ' </style>';

    var nodeSpeed = 10;

    init();

    function init() {
        agency.debugging    = false;
        agency.viewports    = [];
        agency.actions      = [];

        createStyles();

        convertViewportTags();
        convertNodeTags();

        getViewports();

        agency.chrono.init(60, update, draw);

        // delay startup
        setTimeout($.proxy(agency.chrono.start, agency.chrono), 500);
    }

    function createStyles() {
        $(STYLES).appendTo("head");
    }

    function update() {
        if(agency.debugging) {
            agency.eachViewport(function($viewport) {
               $viewport.children(".aj-debug").text(agency.chrono.fps);
            });
        }

        handleActions();
    }

    function handleActions() {
        var actions = agency.actions,
            count = actions.length,
            action;

        for(var i = 0; i < count; i++) {
            action = actions.shift();
            agency.path.target(action);
            if(agency.path.travel()) {
                actions.push(action);
            } else {
                // free resource?
            }
        }
    }

    /*function handleAction(action) {
        var positionX = agency.getDelta(action.velocityX, action.timeStepX),
            positionY = agency.getDelta(action.velocityY, action.timeStepY);

        if(action.timeStepX < action.totalTime) {
            action.timeStepX += action.timeStepLengthX;
        }

        if(action.timeStepY < action.totalTime) {
            action.timeStepY += action.timeStepLengthY;
        }

        action.$node.offset({left: action.startX + positionX, top: action.startY + positionY});

        if(action.timeStepX === action.totalTime && action.timeStepY === action.totalTime) {
            agency.actionFactory.freeObject(action);
        } else {
            agency.actions.push(action);
        }
    }*/



    /*function handleAction(action) {
        var $node = action.$node,
            nodeX = $node.offset().left,
            nodeY = $node.offset().top,
            speedX = nodeSpeed,
            speedY = nodeSpeed,
            offsetX = nodeX,
            offsetY = nodeY,
            diffX = Math.abs(action.deltaX) - action.distanceX,
            diffY = Math.abs(action.deltaY) - action.distanceY;

        if(diffX != 0) {
            speedX = Math.min(speedX, diffX);
            if(action.deltaX > 0) {
                offsetX = nodeX - speedX;
                action.distanceX += speedX;
            } else {
                offsetX = nodeX + speedX;
                action.distanceX += speedX;
            }
        }

        if(diffY != 0) {
            speedY = Math.min(speedY, diffY);
            if(action.deltaY > 0) {
                offsetY = nodeY - speedY;
                action.distanceY += speedY;
            } else {
                offsetY = nodeY + speedY;
                action.distanceY += speedY;
            }
        }

        $node.offset({left: offsetX, top: offsetY});

        if(action.distanceX === action.deltaX && action.distanceY === action.deltaY) {
            agency.actionFactory.freeObject(action);
        } else {
            agency.actions.push(action);
        }
    }*/

    function draw() {
    }

    function convertViewportTags() {
        $("body").find("aj-viewport").each(function() {
            var $viewport = $(this),
                html = $viewport.html();

            $viewport.replaceWith('<div data-ajviewport="">' + html + '</div>');
        });
    }

    function convertNodeTags() {
        $("body").find("aj-node").each(function() {
            var $node = $(this),
                id = $node.attr("id"),
                html = $node.html();

            $node.replaceWith('<div data-ajnode="" id="' + id + '">' + html + '</div>');
        });
    }

    function getViewports() {
        $("body").find("div[data-ajviewport='']").each(function() {
            var $viewport = $(this);
            $viewport.addClass("aj-viewport");

            agency.viewports.push({
                $viewport: $viewport,
                childNodes: getNodes($viewport)
            });
        });
    }

    function getNodes($parent) {
        var nodes = [];

        $parent.children("div[data-ajnode='']").each(function() {
            var $node = $(this),
                maximize = ($node.attr("data-maximize")) ? true : false;

            $node.addClass("aj-node");
            if(maximize) {
                $node.width($parent.width());
                $node.height($parent.height());
            }

            nodes.push({
                $node: $node,
                childNodes: getNodes($node),
                props: {
                    maximize: maximize
                }
            });
        });

        return nodes;
    }
};

agency.eachViewport = function(callback) {
    var viewports = agency.viewports,
        count = viewports.length,
        i;
    for(i = 0; i < count; i++) {
        callback(viewports[i].$viewport);
    }
};

agency.debug = function() {
    if(agency.debugging) {
        agency.debugging = false;
        agency.eachViewport(function($viewport) {
            $viewport.children('.aj-debug').remove();
        });
    } else {
        agency.eachViewport(function($viewport) {
            $viewport.append('<div class="aj-base aj-debug"></div>');
        });

        agency.debugging = true;
    }

    return agency.debugging;
};