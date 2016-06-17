/*! jQuery Tiny Layer - v0.1.0
 * https://github.com/floriancapelle/jquery-tiny-layer
 * Licensed MIT
 */
(function( $ ) {
    'use strict';

    var api = {};

    /* Configuration
     * closeBtnMarkup {string} - markup of the close button to be appended, false if not
     * autoCloseOthers {bool} - close other open layers when opening a layer
     * cssClasses {string} - supply css classes if you want, e.g. to identify a layer in css
     * events {object} - supply jQuery-like events with delegation, delegateTarget is item root
     */
    var defaults = {
        appendTo: 'body',
        triggerSelector: '[data-layer-target]',
        triggerTargetKey: 'layerTarget',
        layerOptions: {
            closeBtnMarkup: '<button class="tiny-layer-item-close btn btn-default btn-has-icon" type="button"><svg class="svg-icon svg-icon-cross"><use xlink:href="#still-cross"></use></svg></button>',
            autoCloseOthers: true,
            closeOnOverlayClick: true,
            cssClasses: '',
            events: {}
        }
    };
    var $root;
    var $layerItemTpl;
    var uniqIdBase = 0;
    var layers = {};

    /*$.fn.tinyLayer = function( options ) {
        return this;
    };*/

    /*
     * Anforderungen
     * - tiny, nur die notwendigsten funktionen
     * - layer inhalt kann alles sein
     * - mehrere layer müssen gleichzeitig möglich sein
     * - kein init oder add, layer werden bei klick des triggers erst initialisiert
     * - events müssen pro layer komfortabel möglich sein
     *   - events schon am layer registrieren und clone(true)?
     * - Jeder Layer ist inklusive overlay komplett mit css anpassbar
     *
     * TODO
     *
     * - add entfernen und bei open einsetzen, ggf. mehrere functions nutzen
     */

    /**
     * Initialize the component
     */
    function init() {
        $root = $('<aside class="tiny-layer"></aside>');
        $layerItemTpl = $('<article class="tiny-layer-item"><div class="tiny-layer-item-content"></div></article>');

        $(defaults.appendTo).append($root);

        $('body').on('click.tinyLayer', defaults.triggerSelector, function( event ) {
            var $trigger = $(this);

            open($trigger.data([defaults.triggerTargetKey]));
        });

        $root.on('click.tinyLayer', '.tiny-layer-item', function( event ) {
            var $layer = $(this);

            if ( !$layer.is(event.target) ) return;
            if ( $layer.data('options').layerOptions.closeOnOverlayClick !== true ) return;
            close($layer);
        });
        $root.on('click.tinyLayer', '.tiny-layer-item-close', function( event ) {
            close($(this).closest('.tiny-layer-item'));
        });
    }

    function add( newLayerContent, options ) {
        if ( typeof newLayerContent === 'undefined' ) return;

        options = $.extend(true, {}, defaults.layerOptions, options);
        uniqIdBase += 1;

        var $newLayer = $layerItemTpl.clone();
        var $newLayerContent = $newLayer.children('.tiny-layer-item-content');

        $newLayerContent.append(newLayerContent);

        if ( options.closeBtnMarkup ) {
            $newLayerContent.append($(options.closeBtnMarkup));
        }
        $newLayer.addClass(options.cssClasses);
        $newLayer.on(options.events);
        $newLayer.data('id', uniqIdBase);

        layers[uniqIdBase] = {
            $el: $newLayer,
            options: options
        };

        $root.append($newLayer);

        return uniqIdBase;
    }

    function open( layerSelector ) {
        if ( !layerSelector ) return api;

        var $layer = $root.children(layerSelector);
        if ( !$layer || !$layer.length ) return api;

        if ( !$layer.data('options') ) {
            $layer.data('options', $.extend(true, {}, defaults.layerOptions));
        }
        var layerOptions = $layer.data('options');

        if ( layerOptions.autoCloseOthers === true ) {
            close($root.children('.is-visible'))
        }
        $layer.addClass('is-visible');

        return api;
    }

    function close( layer ) {
        layer = layer || '';

        $root.children(layer).removeClass('is-visible');

        return api;
    }

    // Public API
    $.extend(api, {
        open: open,
        close: close
    });

    $(function() {
        init();
        $.tinyLayer = api;
    });

}(jQuery));