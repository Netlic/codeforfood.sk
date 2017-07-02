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

        var settings = $.extend({
            borderEffect: true,
            borderEffectDuration: 500,
            afterBorderAnimation: function() {}
        }, options);
        settings.style = Object.assign({}, defaultStyle, settings.style)

        /** @var root hierarchy element */
        var madRoot = this;

        /**
         * Element that represents border effect on hover
         * @type object
         */
        var borderEffectElement = {
            template: '<div class="mad-hierarchy-node-border-effect"></div>',
            getEffect: function () {
                return $(this.template).css({
                    'border-radius': settings.style['border-radius']
                });
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
                        $bElement.setAnimation(settings.afterBorderAnimation);
                    }
                }).mouseleave(function () {
                    $(this).animate({
                        'width': '100px',
                        'height': '100px'
                    });
                });
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

            createBorder: function () {
                var $border = this.setFitToNode();
                if (this.effect) {
                    $border = this.setFitToNode().append(this.effect);
                }

                return $border;
            }
        };

        //applying styles
        this.css(settings.style);

        //adding classes
        this.addClass('mad-hierarchy mad-hierarchy-node');

        //appending border element in place of original node element
        var $parent = this.parent();
        $parent.append(borderElement.createBorder()/*.append(this)*/);

        return this;
    };
}(jQuery));
