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

        /** object nodes: {element, nodes:{}, distance, visible, position{}} */

        /**
         * Plugin client settings
         * @type Object
         */
        var settings = $.extend({
            borderEffect: true,
            borderEffectDuration: 500,
            borderSpace: 10,
            fitContainer: true,
            nodeDistance: '100px',
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
            node: $(),
            template: '<div class="mad-hierarchy-node-border"></div>',
            effectTpl: settings.borderEffect ? borderEffectElement.getEffect() : false,

            /**
             * Returns border element with or without effect
             * @returns {mad.hierarchyL#1.$.fn.madHierarchy.borderElement@call;borderElement@call;append|unresolved}
             */
            setFitToNode: function () {
                var $node = this.node;
                var $effectTpl = this.effectTpl;
                var $borderElement = this.borderElement().css({
                    width: parseFloat($node.width()) + 'px',
                    height: parseFloat($node.height()) + 'px',
                });
                $borderElement = this.setBorderRadius($node, $borderElement);
                if ($effectTpl) {
                    return $borderElement.append($effectTpl.clone(true, true));
                }
                return $borderElement;
            },

            setBorderRadius: function (node, borderElement) {
                var $leftTop = node.css('borderTopLeftRadius'),
                        $rightTop = node.css('borderTopRightRadius'),
                        $rightBottom = node.css('borderBottomRightRadius'),
                        $leftBottom = node.css('borderBottomLeftRadius');
                borderElement.css({
                    'border-radius': $leftTop + ' ' + $rightTop + ' ' + $rightBottom + ' ' + $leftBottom
                });
                return borderElement;
            },

            /**
             * Function returns basic border template
             * @returns {unresolved}
             */
            borderElement: function () {
                return $(this.template);
            },

            /**
             * Resets border effect animation
             * @param {function} onAnimationEnd
             */
            resetAnimation: function (onAnimationEnd, effectElement) {
                var $effect = effectElement;
                $effect.removeAttr('style');
                this.setAnimation(onAnimationEnd, $effect);
            },

            /**
             * Function that sets border effect animation
             * accepts parameter {function} to execute after animation has ended
             * @param {function} onAnimationEnd
             */
            setAnimation: function (onAnimationEnd, effectElement) {
                var $effect = effectElement;
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

            setBorderHover: function (borderElement) {
                var $effect = borderElement.find('.mad-hierarchy-node-border-effect');
                var $bElement = this;
                var $node = this.node,
                        $width = $node.width(), $height = $node.height();
                borderElement.mouseenter(function () {
                    $(this).animate({
                        'width': (parseFloat($width) + settings.borderSpace) + 'px',
                        'height': (parseFloat($height) + settings.borderSpace) + 'px'
                    }, 100);
                    if ($effect.length > 0) {
                        $bElement.resetAnimation(settings.afterBorderAnimation, $effect);
                    }
                }).mouseleave(function () {
                    $(this).animate({
                        width: parseFloat($width) + 'px',
                        height: parseFloat($height) + 'px'
                    });
                    $effect.stop().css({
                        'top': '0px',
                        'left': '0px'
                    });
                });
                return borderElement;
            },

            /**
             * Returns border element with effect, if enabled
             * @returns {@this;@call;setFitToNode|@this;@call;setFitToNode@call}
             */
            createBorder: function (node) {
                this.node = node;
                if (this.node.hasTransparentBackground()) {
                    this.node.css({'background-color': 'white'});
                }
                return this.setBorderHover(this.setFitToNode()).append(node);
            }
        };

        var distanceElement = {
            create: function (x, y) {
                return $('<div></div>').css({
                    'position': 'relative',
                    'top': x + 'px',
                    'left': y + 'px',
                    'border': '1px solid black',
                    'width': '0px',
                    'display': 'none'
                });
            }
        };

        function AutoPosition () {
            this.autoPosition = 'left',
            this.autoPositions = ['left', 'bottom', 'right', 'top'],
            this.parent = '',
            this.current = '',
            this.top = function () {
                var lr = ['left', 'right'];
                if (lr.indexOf(this.autoPosition) >= 0) {
                    return parseFloat(this.currPos.top) + 
                   ((parseFloat(this.parent.height()) - 
                        parseFloat(this.current.height())) / 2)
                }
            },

            this.left = function () {
                return '';
            },

            this.getPosition = function () {
                return this.autoPosition;
            },

            this.setPosition = function (pos) {
                this.autoPosition = pos;
            },

            this.getNextPosition = function () {
                var index = this.autoPositions.indexOf(this.autoPosition);
                if (index < 0) {
                    return this.autoPositions[0];
                }
                if ((parseInt(index) + 1) === this.autoPositions.length) {
                    return this.autoPositions[0];
                }
                return this.autoPositions[parseInt(index) + 1];
            };
            
            this.relatedNodes = function (parent, current) {
                this.parent = parent;
                this.current = current;
                this.currPos = current.position();
            };
        };


        var madFinisher = {
            autoPosition: new AutoPosition(),
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
                            $createdNode = borderElement.createBorder($currNode.element);
                    this.createdNodes.push($createdNode);
                    $parent.append($createdNode);
                    this.setNodePosition(elementToStick, $currNode.distance);
                }
                var $parser = this;
                elementToStick.mouseenter(function () {
                    $(this).addClass('bigger-caption');
                    $parser.resizeBond($(this), parseInt(settings.nodeDistance));
                });
                elementToStick.mouseleave(function () {
                    $(this).finish();
                    $(this).removeClass('bigger-caption');
                    $parser.resizeBond($(this), 0, 0);
                });
            },

            setNodePosition: function (parentNode, distance) {
                var nodeCount = this.createdNodes.length,
                        current = this.createdNodes[parseInt(nodeCount) - 1],
                        prev = this.createdNodes[parseInt(nodeCount) - 2],
                        currPos = current.position();
                //var $distance = typeof distance !== 'undefined' ? distance : settings.nodeDistance;
                this.autoPosition.distance = typeof distance !== 'undefined' ? distance : settings.nodeDistance;
                this.autoPosition.relatedNodes(parentNode, current);
                console.log(this.autoPosition.distance)
                current.css({
                    'top': this.autoPosition.top()
                });
                /*if (typeof prev === 'undefined') {
                    current.css({
                        'left': (parseFloat(currPos.left) +
                                parseFloat(parentNode.width()) +
                                parseFloat($distance)) + 'px',
                        'top': parseFloat(currPos.top) + ((parseFloat(parentNode.height()) - parseFloat(current.height())) / 2)
                    });
                } else {
                    
                }*/
                this.drawBond(parentNode, current);
            },

            drawBond: function (parentNode, currNode) {
                var distanceStartTop = parseFloat(parentNode.position().top) + parseFloat(parentNode.height()) / 2;
                var distanceStartLeft = parseFloat(parentNode.position().left) + parseFloat(parentNode.width()) + settings.borderSpace;
                var $distance = distanceElement.create(distanceStartTop, distanceStartLeft);
                currNode.before($distance);
            },

            resizeBond: function (node, width, animationSpeed) {
                var relatedNodes = $('div').filter(function () {
                    return node.getSelector().indexOf($(this).attr('data-parent')) >= 0;
                });
                var dists = relatedNodes.parent().prev();
                dists.toggle();
                dists.animate({
                    'width': width + 'px'
                }, animationSpeed);
            }
        };

        //applying styles
        this.css(settings.style);

        //adding classes
        this.addClass('mad-hierarchy mad-hierarchy-node');

        //appending border element in place of original node element
        var $parent = this.parent();
        $parent.append(borderElement.createBorder(this));

        madFinisher.prepareNodes(madRoot, settings.nodes);

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

$(function () {
    $.fn.hasTransparentBackground = function () {
        var bkg = this.css('background-color');
        var regex = /0/gi, result, indices = [];
        while ((result = regex.exec(bkg))) {
            indices.push(result.index);
        }
        if (bkg === 'transparent' || (bkg.indexOf('rgba') >= 0 &&
                (indices.length === 4 && indices[3] === 14))) {
            return true;
        }
        return false;
    };
}(jQuery));
