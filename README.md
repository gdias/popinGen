#jQuery.PopinGen.js


## PopinGen
> v 1.0.1

The popinGen.js is an jQuery plugin permit to create easily and simplicity an popin or layer with all features. 

## Features
+ Easy generate popin or layer
+ Position centered for popin or relative at handler for layer
+ Bind Events classics or personalized by options
+ Popin follow on scroll
+ Delegate Events
+ Integrate Ajax Response on content
+ Toggle Events
+ Bind Close Event on Blur
+ Timer for auto close
+ Fullscreen popin
+ Add your own Css3 effect in Open and Close events
+ Multiple Callback methods for a best control
+ Bind ESC key for close event
+ And more...

> Tested on IE7+, Chrome, Firefox, Safari, IOS, Android 

#### Popin or Layer... understand the differencez !
Popin is a container placed up to all in page with an grey layer under, often call by click event
Layer is a container, less grey layer and placed relative at handler.

##Demos
You can find many examples by following this link :
http://data.guillaumedias.fr/popinGen/

## Usage
The more simple case for create an popin, you've need just 3 elements.

1. Handler
`<a href="#" class="open-popin">Open my popin</a>`

2. Container
```
<div id="popinContainer">
	<h1>Title</h1>
	<p>Content</p>
</div>
```

3. Javascript
```
$().popinGen({
	selector : ".open-popin",
	target : "popinContainer"
});
```

You can use CSS for add a minimum style. 
For example, add a white background and large padding, it's a basic CSS styles but enough for start. You can also to create a generic styles for all popin of your website.

For create a simple layer, just set option **mode** at **layer**. It so easy to switch.


## Options

#### Required
Many optional parameters are available, but two option are required : 'selector' and 'target'
**Selector** : String | _(Default : null)_ - Option represent an element of DOM, it trigger opening event.
**Target** : String | _(Default : null)_ - Option target an element container a content of popin.
NB : If this options are not different of null, error should appear on console.

#### Events 
**eventStart** : String | _(Default : "click")_ - Event handler for open popin or layer.
**eventStop** : String | _(Default : null)_ - Event handler for close popin or layer.
**toggle** : Boolean | _(Default : False)_ - Active toggle event handler for open/close layer only.
**outerClose** : Boolean | _(Default : False)_ - Active mode for close layer with blur event with layer only.

#### Ajax methods
**ajaxMode** : Boolean | _(Default : false)_ - Activate Ajax method content.
**ajaxMethod** : Function | Function represent ajax - request for load content of popin or layer.
**callbackMethod** : Function | Callback called at response of ajax request.
**ajaxLoaderLink** : String | _(Default : null)_ - Link of loader integrated in popin/layer during ajax request, show, hide and auto position.
**multiContent** : Boolean | _(Default : False)_ - ajaxMethod called at every open Popin/Layer.

Exist a special method for integrate Ajax response in content Popin or Layer.
**jSCallBack** : Function | Integrate Ajax response in your Popin/Layer.

#### Callback methods
**callbackMethodAfterCreate** : Function | Callback method called at create a popin/layer only once.
**callbackMethodOpen** : Function | Callback method called every open popin/layer.
**callbackMethodClose** : Function | Callback method called every close popin/layer.

#### Timers
**autoclose** : Boolean | _(Default : False)_ - Add a timer for auto close popin/layer.
**timeToAutoclose** : Number | _(Default : 3000)_ - Timer in ms before auto close popin/layer.
**timer** : Number | _(Default : 0)_ - Add Timer in ms for hover container less handler close, add interact with content.

#### Miscellaneous
**idLayer** : String | _(Default : "layerPopinGen")_ - ID of transparent layer in popin mode.
**closeOnLayer** : Boolean | _(Default : True)_ - Bind close event on transparent layer in popin mode.
**backgroundLayerColor** : String | _(Default : "#000")_ - Configure the color of transparent layer in popin mode.
**bindESC** : Boolean | _(Default : False)_ - Bind ESC key for close popin.
**scrollPopin** : Boolean | _(Default : True)_ - Active/desactive The popin follow scroll page.
**fullscreen** : Boolean | _(Default : False)_ - Remove top position minimum for fullscreen large content.



### Usage with Ajax content
You have need a refresh content popin or layer in Ajax. You don't care, let's easy do this together.
The point 1 & 2 for simple usecase are same, only the third part (JS) is different.
This plugin permit ajax method and response integrated directly on content of popin or layer.

####Javascript
```
$().popinGen({
	selector : ".open-popin",
	target : "popinContainer",
	ajaxMode : true,
	ajaxMethod : function(el, plugin, opts) {
		$.load('mycontentofpopin.html', function(response) {
			plugin.jsCallBack(response, opts);
		}
	}
});
```

##License
2014 MIT Open Source license

##Contact info
Website : http://guillaumedias.fr

Email : me@guillaumedias.fr





