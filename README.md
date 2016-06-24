# tinyLayer
tinyLayer is a lightweight jQuery plugin for fully customizable basic layers, notifications, modals or any feature alike.

Open a layer by clicking any element you want which has a custom attribute containing the id of the target layer.

- Layer CSS & HTML is fully customizable
- Layer is positioned with CSS only by using flex
- Simple API with just an open & close method
- Requires jQuery 1.8+
- Browser Support: Evergreen browsers & IE9+

## Demo

- Open the index.html

## Install

Download latest release and place the following css and js files in the corresponding directories.

Add a link to the css file in your `<head>`:
```html
<link rel="stylesheet" href="css/jquery.tiny-layer.css"/>
```

Then, before your closing ```<body>``` tag add:
```html
<script src="js/jquery.tiny-layer.js"></script>
```

*Make sure to check and maybe edit the paths to fit your file structure.*

## Usage

TODO
- data attribute options
- $.tinyLayer.close without param will close all layers

### API

Namespace is `$.tinyLayer`

Method | Arguments | Description
------ | -------- | -----------
open | layerId : string (e.g. '#layer-1') | open the target layer
close | layerId : string (e.g. '#layer-1') | close the target layer

### Configuration

Modify `$.tinyLayer.defaults` to change the default configuration.

Key | Type | Default | Description
------ | ---- | ------- | -----------
triggerSelector | string | '[data-layer-target]' | used as filter selector in click event delegation for body
triggerTargetKey | string | 'layerTarget' | data object key containing layer id on trigger element
layerItemClass | string | 'tiny-layer-item' | -
layerItemContentClass | string | 'layer-item-content' | -
layerItemTpl | string | see js file | used to create layer items with jQuery
visibilityToggleClass | string | 'is-visible' | css class for open and close handling
layerOptions.closeBtnMarkup | string | see js file | markup of the close button to be appended, false if not
layerOptions.autoCloseOthers | boolean | true | close other open layers when opening a layer
layerOptions.closeOnOverlayClick | boolean | true | close the layer whose overlay was clicked
layerOptions.events | array | [] | supply jQuery-like events with delegation, delegateTarget is layer item

## License

[MIT License](https://github.com/floriancapelle/jquery-tiny-layer/blob/master/LICENSE)

------------------

## Questions & Contribution
Please feel free to reach out to me if you have any questions, suggestions or contributions.
