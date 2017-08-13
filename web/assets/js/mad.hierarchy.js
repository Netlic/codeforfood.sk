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
                var $position = $node.position();
                var $borderElement = this.borderElement().css({
                    width: parseFloat($node.width()) + 'px',
                    height: parseFloat($node.height()) + 'px',
                    top: $position.top,
                    left: $position.left
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

        /**
         * Object that graphically represents bond between nodes
         * @type object
         */
        var distanceElement = {
            create: function (x, y, degree) {
                return $('<div></div>').css({
                    'position': 'relative',
                    'top': x + 'px',
                    'left': y + 'px',
                    'border': '1px solid black',
                    'width': '0px',
                    'display': 'none',
                    '-ms-transform': 'rotate(' + degree + 'deg)', /* IE 9 */
                    '-webkit-transform': 'rotate(' + degree + 'deg)', /* Safari */
                    'transform': 'rotate(' + degree + 'deg)',
                });
            }
        };

        var PositionCalculator = {
            nodes: [],
            settings: {},

            current: function () {
                var currNode = this.nodes[parseInt(this.nodes.length) - 1];
                return {
                    top: function () {
                        return currNode.borderedNode.position().top;
                    },
                    left: function () {
                        return currNode.borderedNode.position().left;
                    },
                    height: function () {
                        return currNode.borderedNode.height();
                    }
                };
            },

            calculate: function (settings) {
                var result = 0;
                if (typeof settings !== 'undefined') {
                    for (var key in settings) {
                        var value = 0;
                        switch (key) {
                            case 'ct':
                            {
                                value = parseFloat(this.current().top());
                                break;
                            }
                            case 'cl':
                            {
                                value = parseFloat(this.current().left());
                                break;
                            }
                            case 'ph':
                            {
                                value = parseFloat(this.parent.height());
                                break;
                            }
                            case 'ch': 
                            {
                                value = parseFloat(this.current().height());
                                break;
                            }
                            case 'expression': 
                            {
                                value = this.calculate(settings[key]);
                                break;
                            }
                        }
                        result += this.getFromSettings(settings, key, value);
                    }
                };

                return result;
            },

            getFromSettings: function (settings, key, value) {
                var part = settings[key];
                if (typeof part.div !== 'undefined') {
                    value = parseFloat(value) / parseFloat(part.div);
                }
                if (part.adder === '+') {
                    return value;
                }

                return -1 * parseFloat(value);
            }
        };
        
        /**
         * Object for count autosizing values for node positioning
         */
        function AutoPosition() {
            this.autoPosition = 'left';
            this.autoPositions = ['left', 'bottom', 'right', 'top'];
            this.parent = '';
            this.current = '';
            this.calculatedPositions = '';
            this.autoNodePosition = function () {
                var lr = ['left', 'right'];
                return {    
                    top: function () {
                        if (lr.indexOf(this.autoPosition) >= 0) {
                            var result = PositionCalculator.calculate({
                                'ct': {
                                    'adder': '+'
                                },
                                'expression': {
                                    'ph': {
                                        'adder': '+'
                                    },
                                    'ch': {
                                        'adder': '-',
                                    },
                                    'adder': '+',
                                    'div': 2
                                }
                            });

                            return result;
                        }
                        return (parseFloat(this.currPos.top) +
                            parseFloat(this.parent.height()) +
                            parseFloat(this.distance));
                        
                    },
                    left: function () {
                        return;
                    }
                };
            };
            this.top = function () { 
                if (this.lr.indexOf(this.autoPosition) >= 0) {
                    var result = PositionCalculator.calculate({
                        'ct': {
                            'adder': '+'
                        },
                        'expression': {
                            'ph': {
                                'adder': '+'
                            },
                            'ch': {
                                'adder': '-',
                            },
                            'adder': '+',
                            'div': 2
                        }
                    });

                    return result;
                }
                return (parseFloat(this.currPos.top) +
                        parseFloat(this.parent.height()) +
                        parseFloat(this.distance));
            };

            this.left = function () {
                if (this.lr.indexOf(this.autoPosition) >= 0) {
                    return (parseFloat(this.currPos.left) +
                            parseFloat(this.parent.width()) +
                            parseFloat(this.distance));
                }
                return parseFloat(this.currPos.left) +
                        ((parseFloat(this.parent.width()) -
                                parseFloat(this.current.width())) / 2);
            };

            /**
             * function returns current autoposition representation eq. top, left, bottom, right 
             * @returns {@param;String}
             */
            this.getPosition = function () {
                return this.autoPosition;
            };

            /**
             * Function to set current autoposition representation
             * @param {string} pos
             */
            this.setPosition = function (pos) {
                this.autoPosition = pos;
            };

            /**
             * Returns next autoposition value
             * @returns {String}
             */
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

            /**
             * Gets degree for autopositioned node to draw bond
             * @returns {mad.hierarchyL#1.$.fn.madHierarchy.AutoPosition.positions.degree}
             */
            this.getDegree = function () {
                return this.positions().degree;
            };

            /**
             * Gets position for nodes in autoposition 
             * @returns {undefined}
             */
            this.getNodePositions = function () {
                console.log(this.positions())
                return this.positions().node;
            };

            /**
             * Gets positions for bond between nodes to draw 
             * @returns {mad.hierarchyL#1.$.fn.madHierarchy.AutoPosition.positions.bond}
             */
            this.bondStart = function () {
                return this.positions().bond;
            };

            /**
             * Gets general positions, degrees for hierarchy to draw
             * @returns {mad.hierarchyL#1.$.fn.madHierarchy.AutoPosition.positions.mad.hierarchyAnonym$3|mad.hierarchyL#1.$.fn.madHierarchy.AutoPosition.positions.mad.hierarchyAnonym$2|mad.hierarchyL#1.$.fn.madHierarchy.AutoPosition.positions.mad.hierarchyAnonym$1|mad.hierarchyL#1.$.fn.madHierarchy.AutoPosition.positions.mad.hierarchyAnonym$4}
             */
            this.positions = function () {
                switch (this.getPosition()) {
                    case 'left' :
                    {
                        return {
                            degree: 0,
                            node: this.autoNodePosition()
                        };
                    }
                    case 'bottom' :
                    {
                        return {degree: -90};//-90;
                    }
                    case 'right' :
                    {
                        return {degree: 180};//180;
                    }
                    case 'top' :
                    {
                        return {degree: 90};//90;
                    }
                }
            };
        }

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
                    PositionCalculator.nodes.push({
                        'originalNode': $currNode,
                        'borderedNode': $createdNode
                    });
                    PositionCalculator.parent = elementToStick;
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
                        current = this.createdNodes[parseInt(nodeCount) - 1];
                this.autoPosition.distance = typeof distance !== 'undefined' ? distance : settings.nodeDistance;
                this.autoPosition.relatedNodes(parentNode, current);
                current.css({
                    'top': this.autoPosition.getNodePositions().top(),
                    'left': this.autoPosition.left()
                });
                this.drawBond(parentNode, current);
                this.autoPosition.setPosition(this.autoPosition.getNextPosition());
            },
            drawBond: function (parentNode, currNode) {
                var distanceStartTop = parseFloat(parentNode.position().top) + parseFloat(parentNode.height()) / 2;
                var distanceStartLeft = parseFloat(parentNode.position().left) + parseFloat(parentNode.width()) + settings.borderSpace;
                var degree = this.autoPosition.getDegree();
                var $distance = distanceElement.create(distanceStartTop, distanceStartLeft, degree);
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
}(
        jQuery));
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
