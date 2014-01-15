/**
 * Created by shaun on 1/12/14.
 */

var agency = agency || {};

agency.start = function() {
    var STYLES = '<style type="text/css">' +
        '.aj-base { font-family: sans-serif }' +
        '.aj-debug { position: absolute; color: white; background-color: black; width: 32px; height: 25px; }' +
        '.aj-viewport { width: 500px; height: 500px; background-color: #0d3349; }' +
        '.aj-node { position: absolute; color: white; width: 100px; height: 100px; ' +
            'transform:translate3d(0,0,0);' +
            '-ms-transform:translate3d(0,0,0);' +
            '-webkit-transform:translate3d(0,0,0); }' +
        ' </style>';

    var nodeSpeed = 5;

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
        setTimeout($.proxy(agency.chrono.start, agency.chrono), 200);
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
            count = actions.length;

        for(var i = 0; i < count; i++) {
            handleAction(actions.shift());
        }
    }

    function handleAction(action) {
        var $node = action.$node,
            nodeX = $node.offset().left,
            nodeY = $node.offset().top,
            diffX = 0,
            diffY = 0,
            speedX = nodeSpeed,
            speedY = nodeSpeed,
            offsetX = nodeX,
            offsetY = nodeY;


        diffX = action.deltaX - action.distanceX;
        if(diffX != 0) {
            speedX = Math.min(speedX, Math.abs(diffX));
            if(action.deltaX > 0) {
                offsetX = nodeX - speedX;
                action.distanceX += speedX;
            } else {
                offsetX = nodeX + speedX;
                action.distanceX -= speedX;
            }
        }

        diffY = action.deltaY - action.distanceY;
        if(diffY != 0) {
            speedY = Math.min(speedY, Math.abs(diffY));
            if(action.deltaY > 0) {
                offsetY = nodeY - speedY;
                action.distanceY += speedY;
            } else {
                offsetY = nodeY + speedY;
                action.distanceY -= speedY;
            }
        }


        /*if(action.deltaY) {
            diffY = action.deltaY - action.distanceY;
            if(action.distanceY < diffY) {
                diffY = Math.min(diffY, nodeSpeed);
                offsetY = (action.deltaY > 0) ? nodeY - diffY : nodeY + diffY;
                action.distanceY += diffY;
            }
        }*/

        $node.offset({left: offsetX, top: offsetY});

        if(action.distanceX === action.deltaX && action.distanceY === action.deltaY) {
            agency.actionFactory.freeObject(action);
        } else {
            agency.actions.push(action);
        }
    }

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
            var $node = $(this);
            $node.addClass("aj-node");

            nodes.push({
                $node: $node,
                childNodes: getNodes($node)
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