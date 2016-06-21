/*! jQuery Tiny Layer - v0.1.0
 * https://github.com/floriancapelle/jquery-tiny-layer
 * Licensed MIT
 */
(function( $ ) {
    'use strict';

    // Public API
    var api = {};

    /* Configuration
     * closeBtnMarkup {string} - markup of the close button to be appended, false if not
     * autoCloseOthers {bool} - close other open layers when opening a layer
     * events {object} - supply jQuery-like events with delegation, delegateTarget is item root
     */
    var defaults = {
        appendTo: 'body',
        triggerSelector: '[data-layer-target]',
        triggerTargetKey: 'layerTarget',
        layerItemClass: 'tiny-layer-item',
        layerItemContentClass: 'layer-item-content',
        layerItemTpl: '<article class="tiny-layer-item"><div class="layer-item-content"></div></article>',
        layerOptions: {
            closeBtnMarkup: '<button class="layer-item-close" type="button">x</button>',
            autoCloseOthers: true,
            closeOnOverlayClick: true,
            events: []
        }
    };
    var conf = {};
    var $root;
    var $layerItemTpl;

    /*
     * @TODO
     * - close icon mit css statt svg icon
     * - animationen bei open und close
     */

    /**
     * Initialize the component
     * @param {{}} customConf - custom configuration to overwrite the defaults
     * @returns {{}}
     */
    function init( customConf ) {
        conf = $.extend(true, {}, defaults, customConf);

        // create wrapper and append to configured element
        $root = $('<aside class="tiny-layer"></aside>');
        $layerItemTpl = $(conf.layerItemTpl);

        $(conf.appendTo).append($root);

        // trigger event handling
        // open target layer on click on a trigger
        $('body').on('click.tinyLayer', conf.triggerSelector, function( event ) {
            var $trigger = $(this);
            var layerId = $trigger.data(conf.triggerTargetKey);

            // stop if the layer already has been added
            if ( getLayerInRoot(layerId).length ) return;

            initLayer(layerId);
            open(layerId);
        });

        // overlay event handling
        // close layer on click on overlay
        $root.on('click.tinyLayer', '.' + conf.layerItemClass, function( event ) {
            var $layer = $(this);

            if ( !$layer.is(event.target) ) return;
            if ( $layer.data('options').closeOnOverlayClick !== true ) return;
            close($layer.data('id'));
        });
        // close layer on click on close btn
        $root.on('click.tinyLayer', '.layer-item-close', function( event ) {
            close($(this).closest('.' + conf.layerItemClass).data('id'));
        });

        // Reveal public api
        $.extend(api, {
            open: open,
            close: close,
            // replace with no-op to just call this once
            init: function() {return api;}
        });
        $.tinyLayer = api;

        return api;
    }

    /**
     * Initialize a layer by copying the source layer content and appending it to a new layer
     * @param layerId - layer id like '#layer', will be used as jQuery selector
     * @returns {boolean} - whether the initialization was successful or not
     */
    function initLayer( layerId ) {
        if ( !layerId ) return false;

        var $sourceLayer = $(layerId);
        if ( !$sourceLayer || !$sourceLayer.length ) return false;

        var layerContent = $sourceLayer.html();
        if ( typeof layerContent === 'undefined' ) return false;

        // create a new layer item
        var $newLayer = $layerItemTpl.clone();
        var $newLayerContent = $newLayer.children('.' + conf.layerItemContentClass);
        // merge options with defaults and options on the source layer tag if defined
        // like: data-close-btn-markup="false" => closeBtnMarkup: false
        var options = $.extend(true, {}, conf.layerOptions, $sourceLayer.data());

        // set id and options for later use
        $newLayer.data('id', layerId);
        $newLayer.data('options', options);
        // append the source markup to the new item content
        $newLayerContent.append(layerContent);

        if ( options.closeBtnMarkup ) {
            $newLayerContent.append($(options.closeBtnMarkup));
        }
        // copy all classes from target layer to new layer item
        // except the hide class
        $newLayer.addClass($sourceLayer.attr('class').replace('tiny-layer-hide', ''));
        // apply custom events if defined
        options.events.forEach(function( val ) {
            $newLayer.on(val);
        });

        $root.append($newLayer);
        return true;
    }

    /**
     * open a layer
     * @param layerId
     * @returns {{}}
     */
    function open( layerId ) {
        layerId = layerId || '';

        var $layer = getLayerInRoot(layerId);
        // if the layer is not initialized yet, do it and open it afterwards
        if ( !$layer || !$layer.length ) {
            if ( initLayer(layerId) === true ) {
                open(layerId);
            }
            return api;
        }

        var layerOptions = $layer.data('options');

        if ( layerOptions.autoCloseOthers === true ) {
            // close every child layer that's visible
            $root.children('.is-visible').each(function() {
                close($(this).data('id'));
            });
        }
        $layer.addClass('is-visible');

        return api;
    }

    /**
     * Close and remove a layer
     * @param layerId
     * @returns {{}}
     */
    function close( layerId ) {
        if ( !layerId ) return api;

        //$root.children('[data-id="' + layerId + '"]').removeClass('is-visible');
        getLayerInRoot(layerId).remove();

        return api;
    }

    /**
     * Get layer element by id in wrapper, match layerId with data property
     * @param layerId - must match the
     * @returns {*|HTMLElement}
     */
    function getLayerInRoot( layerId ) {
        var $layer = $();

        $root.children().each(function() {
            if ( $(this).data('id') === layerId ) {
                $layer = $(this);
                return false;
            }
        });

        return $layer;
    }

    $.tinyLayer = {
        init: init
    };

}(jQuery));