(function ($) {
    $.fn.madHierarchy = function (options) {

        /**
         * Set of default styles
         * @type object
         */
        var defaultStyle = {
            'width': '100px',
            'height': '100px',
            'background-color': 'white',
            'border-radius': '50%'
        };

        /** object nodes: {element, nodes:{}, distance} */
        
        /**
         * Plugin client settings
         * @type Object
         */
        var settings = $.extend({
            borderEffect: true,
            borderEffectDuration: 500,
            fitContainer: true,
            nodeDistance: '25px',
            nodes: {},
            afterBorderAnimation: function () {
                console.log('animation end');
            }
        }, options);

        settings.style = Object.assign({}, defaultStyle, settings.style);

        /** @var root hierarchy element */
        var madRoot = this;

        /**
         * Element that represents border effect on hover
         * @type object
         */
        var borderEffectElement = {
            template: '<div class="mad-hierarchy-node-border-effect"></div>',
            getEffect: function () {
                return $(this.template);
            }
        };

        /**
         * Element that appears as border of node
         * @type object
         */
        var borderElement = {
            node: madRoot,
            template: '<div class="mad-hierarchy-node-border"></div>',
            effect: settings.borderEffect ? borderEffectElement.getEffect() : false,

            setFitToNode: function () {
                var $bElement = this;
                var $effect = this.effect;
                return $(this.template).css({
                    width: '100px',
                    height: '100px',
                    'border-radius': settings.style['border-radius']
                }).mouseenter(function () {
                    $(this).animate({
                        'width': '110px',
                        'height': '110px'
                    }, 100);
                    if ($effect) {
                        $bElement.resetAnimation(settings.afterBorderAnimation);
                    }
                }).mouseleave(function () {
                    $(this).animate({
                        'width': '100px',
                        'height': '100px'
                    });
                    $effect.stop().css({
                        'top': '0px',
                        'left': '0px'
                    });
                });
            },

            /**
             * Resets border effect animation
             * @param {function} onAnimationEnd
             */
            resetAnimation: function (onAnimationEnd) {
                var $effect = $(this.effect);
                $effect.removeAttr('style');
                this.setAnimation(onAnimationEnd);
            },

            /**
             * Function that sets border effect animation
             * accepts parameter {function} to execute after animation has ended
             * @param {function} onAnimationEnd
             */
            setAnimation: function (onAnimationEnd) {
                var $effect = $(this.effect);
                $effect.animate({
                    'right': '0px'
                }, settings.borderEffectDuration,
                        function () {
                            $effect.animate({
                                'bottom': '0px'
                            }, settings.borderEffectDuration,
                                    function () {
                                        $effect.animate({
                                            'left': '0px'
                                        }, settings.borderEffectDuration,
                                                function () {
                                                    $effect.animate({
                                                        'top': '0px'
                                                    }, settings.borderEffectDuration, onAnimationEnd);
                                                });
                                    });
                        });
            },

            /**
             * Returns border element with effect, if enabled
             * @returns {@this;@call;setFitToNode|@this;@call;setFitToNode@call;append}
             */
            createBorder: function () {
                var $border = this.setFitToNode();
                if (this.effect) {
                    $border = this.setFitToNode().append(this.effect);
                }

                return $border;
            }
        };

        var nodeParser = {
            createdNodes: [],
            prepareNodes: function (elementToStick, nodes, level) {
                level = typeof level === 'undefined' ? 0 : parseInt(level);
                var $nodes = nodes;
                for (var node in $nodes) {
                    var $currNode = $nodes[node];
                    if (typeof $currNode.nodes !== 'undefined') {
                        this.prepareNodes($currNode.element, $currNode.nodes, level + 1);
                    }
                    $currNode.element.addClass('mad-hierarchy-hidden-node')
                        .attr('data-level', level).attr('data-parent', elementToStick.getSelector());
                    var $parent = $currNode.element.parent(), 
                    $createdNode = borderElement.createBorder().append($currNode.element);
                    this.createdNodes.push($createdNode);
                    $parent.append($createdNode);
                    this.setNodePosition(elementToStick, $currNode.distance);
                }

                elementToStick.hover(function () {
                    $(this).addClass('bigger-caption');
                });
                elementToStick.mouseleave(function () {
                    $(this).removeClass('bigger-caption');
                });
            },
            
            setNodePosition: function(parentNode, distance) {
                var nodeCount = this.createdNodes.length,
                current = this.createdNodes[parseInt(nodeCount) - 1],
                prev = this.createdNodes[parseInt(nodeCount) - 2],
                currPos = current.position();
                var $distance = typeof distance !== 'undefined' ? distance : settings.nodeDistance;
                if (typeof prev === 'undefined') {
                    current.css({'left': (parseFloat(currPos.left) + parseFloat(current.width()) + parseFloat($distance)) + 'px'});
                }
            }
        };

        nodeParser.prepareNodes(madRoot, settings.nodes);

        //applying styles
        this.css(settings.style);

        //adding classes
        this.addClass('mad-hierarchy mad-hierarchy-node');

        //appending border element in place of original node element
        var $parent = this.parent();
        $parent.append(borderElement.createBorder().append(this));

        return this;
    };
}(jQuery));

$(function () {
    $.fn.getSelector = function () {
        var selector = $(this).prop('tagName').toLowerCase();

        var id = $(this).attr("id");
        if (id) {
            selector += "#" + id;
        }

        var classNames = $(this).attr("class");
        if (classNames) {
            selector += "." + $.trim(classNames).replace(/\s/gi, ".");
        }

        return selector;
    };
}(jQuery));
