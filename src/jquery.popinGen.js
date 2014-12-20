/* 
*   Plugin jQuery | Pop-in Generator
*   Made easy Pop-in Or Layer with jQuery
*
*   License MIT
*   Developped by Guillaume DIAS COELHO
*   me@guillaumedias.fr
*/
 
; (function ($, window, document, undefined) {
    "use strict";

    var pluginName = "popinGen",
        base,
        defaults = {
            selector: null,                                 // [Required] Selector of DOM Element represent handler
            target: "",                                     // [Required] Target of popin/layer content
            mode: "popin",                                  // Select mode : Popin or layer
            idElem: "",                                     // [Internal parameter] Generate ID by CSS Class 
            targetId: "",                      		        // [Internal parameter] #ID of container popin/layer
            idPrefix: "popinContainer_",                    // Prefix ID auto construct for auto generated <div/>
            zIndex: 10000,                                  // Update z-Index of popin or layer
            classContainer: "",                             // Add CSS class into container auto generated

            eventStart: "click",                            // Binding Event for open
            eventStop: "",                                  // Binding Event for close
            toggle: false,                                  // Active Toggle Event 

            ajaxMode: false,                                // Activate AJAX mode
            ajaxMethod: function () { },                    // Execute AJAX method before show content
            callbackMethod: function () { },                // Execute Callback method at return AJAX response
            callbackMethodAfterCreate: function () { },     // Execute Callback just after create Element contain popin/layer
            callbackMethodOpen: function () { },            // Execute Callback method at each opening
            callbackMethodClose: function () { },           // Execute Callback method at each closing
            ajaxLoaderLink: "",                             // Link of image for loader ajax, interact and controlled by parameter "ajaxMethod"
            multiContent: false,                            // Activate for restart ajax method at each opening

            autoclose: false,                               // Activate a Timeout function for automatic close
            timeToAutoclose: 3000,                          // Choice time integrate at timer of autoclode option

            idLayer: "layerPopinGen",                       // [popin only] ID of transparent layer
            closeOnLayer: true,                             // [popin only] Bind close event in transparent layer
            backgroundLayerColor: "#000",                   // [popin only] Color of transparent layer            
            bindESC: false,                                 // [popin only] Bind ESC key for close
            scrollPopin: true,                              // [popin only] Follow scroll on page
            fullscreen: false,                              // [popin only] Desactive minimum top position for large content

            timer: 0,                                       // [layer only] Timer for integrate timeout before closing
            customPosition: false,                          // [layer only] Activate custom position
            relativePosition: { left: -1, top: -1 },        // [layer only] Object contain relative position at handler
            outerClose: false 						        // [layer only] Can close layer with blur event
        };

    function Plugin(options) {

        this.element = $(options.selector);
        this.options = $.extend({}, defaults, options);

        this._defaults = defaults;
        this._name = pluginName;
        this.layerID = this.hashControl(this.options.idLayer);

        base = this;
        this.init();
    }

    Plugin.prototype = {

        init: function () {
        	if (this.options.target === "") {console.error('The parameter "target" can\'t be empty, it\'s required for plugin works');return false;}

            this.options.targetId = this.hashControl(this.options.target);
            this.hideClassControl();

            if (this.options.mode !== "layer") 
                this.generateLayer(this.element, this.options);

            this.bindEvents(this.element, this.options);
        },
        bindEvents: function (el, options) {
            var timeEventStop, timeEventStart;

            function fnStart(event, elemCurrent) {

                var orginEvt = (!event.originalEvent) ? "trigger" : event.originalEvent.type;

                base.generateContainer(elemCurrent, options);

                if (options.mode === "layer") {

                    if ($(elemCurrent).data("alreadyCreate"))
                        base.popinPosition(elemCurrent, options);

	                    if (!$(elemCurrent).data("alreadyOpen")) {
	                        if (orginEvt === "trigger" || orginEvt === options.eventStart) {
	                        base.showPopinContent(elemCurrent, options);

	                        if (options.toggle)
	                            $(elemCurrent).data("alreadyOpen", true);
                            
	                        if (options.outerClose)
	                                $(options.idElem).focus();

                        }
                    } else {
                        $(elemCurrent).data("alreadyOpen", false);
                        base.hidePopinAndLayer(el, options);
                    }

                } else { // mode Popin

                    if (options.fullscreen)
                        $("body").css("overflow", "hidden");

                    base.showTransparencyLayer();
                    base.showPopinContent(elemCurrent, options);
                }
                options.callbackMethodOpen(elemCurrent, options);
            }

            if (options.eventStart === "click" && options.mode === "layer" && options.outerClose) { 
                // replace click by mousedown in layer mode and outerClose 
                options.eventStart = "mousedown";
                $(options.selector).click(function (e) { e.preventDefault(); });
            }

            $("html").on(options.eventStart, options.selector, function (e) {
                e.preventDefault();
                e.stopImmediatePropagation();

                var element = this;

                if (options.timer > 0)
                    timeEventStart = setTimeout(fnStart(e, element), options.timer);
                else
                    fnStart(e, element);

                clearTimeout(timeEventStop);

                if (options.autoclose) {
                    setTimeout(function () {
                        base.hidePopinAndLayer(el, options);
                    },
                    options.timeToAutoclose);
                }

            });

            if (options.closeOnLayer && options.mode !== "layer") {
                $("body").on("click", this.layerID, function (e) {
                    e.preventDefault();
                    base.hidePopinAndLayer(el, options);
                });
            }

            if (options.eventStart === "mouseenter" || options.eventStart === "mouseover" && options.mode === "layer") {
                $("body").on(
                    "mouseleave",
                    options.selector,
                    function () {
                        clearTimeout(timeEventStart);
                        timeEventStop = setTimeout(
                            function () {
                                base.hidePopinAndLayer(el, options);
                            }, parseInt(base.options.timer / 2, 10)
                        );
                    }
                );

                options.eventStop = "mouseleave";

                $("body").on(
                    "mouseenter",
                    options.targetId,
                    function () {
                        clearTimeout(timeEventStop);
                    }
                );
            }

            // Event leaveContent
            if (options.eventStop !== "") {
                $("body").on(
                    base.options.eventStop,
                    base.options.targetId,
                    function (e) {
                        e.preventDefault();
                        timeEventStop = setTimeout(
                            function () {
                                base.hidePopinAndLayer(el, options);
                            },
                            base.options.timer
                        );
                    }
                );
            }

            $("body").on("click", ".close", function (e) {
                e.preventDefault();
                $(this).trigger("close");
            });

            if (options.bindESC && options.mode !== "layer") {
                $(window).on("keyup", document, function (e) {
                    e.preventDefault();
                    if (e.keyCode === 27)
                        base.hidePopinAndLayer(el, options);
                });
            }
        },
        bindFocusBlurEvents: function (el, options) {
            if (options.outerClose || options.toggle && options.mode === "layer") {

                if (el.tagName.toLowerCase() !== "input")
                    $(el).attr("tabindex", "-1");

                $("body").on("focus", options.idElem, function (e) {
                    e.preventDefault();
                    $(options.idElem).css("outline", "none");
                    $(el).data("alreadyOpen", true);
                });

                $("body").on("blur", options.idElem, function (e) {
                    e.preventDefault();

                    var hasClassOnTarget = options.selector.substring(1, options.selector.length);

                    base.hidePopinAndLayer(el, options);

                    if (options.toggle || options.outerClose) {
                        $(el).data("alreadyOpen", false);
                    }
                });

            }
        },
        /*
        GenerateLayer()
        Method generate a Layer for popin mode
        */
        generateLayer: function (el, options) {
            var hVar;

            if ($(this.layerID).size() < 1) {

                hVar = this.getMaxHeight();

                $("body").append('<div id="' + options.idLayer + '"></div>');

                $(this.layerID).css({
                    "zIndex": 9999,
                    "background": options.backgroundLayerColor,
                    "opacity": "0.3",
                    "height": hVar + "px",
                    "width": "100%",
                    "position": "absolute",
                    "top": 0,
                    "left": 0,
                    "display": "none"
                });
            }

            if (options.ajaxMode && $("#Ajaxloading").size() < 1) {
                if (options.mode !== "layer") {
                    if (options.ajaxLoaderLink !== "") {
                        $("body").append("<img src='" + options.ajaxLoaderLink + "' alt='loader' id='Ajaxloading' />");
                        $("#Ajaxloading").css(
                            {
                                "zIndex": 10000,
                                "position": "absolute",
                                "top": 0,
                                "left": 0,
                                "display": "none"
                            }
                        );
                    }
                }
            }

        },
        /*
        generateContainer()
        Method generate a container for manipulate popin or layer
        */
        generateContainer: function (el, options) {

            var divCreated, imgSrcLoader, idTarget;

            divCreated = this.generatedId(options);
            imgSrcLoader = options.ajaxLoaderLink;
            options.idElem = "#" + divCreated;
            idTarget = options.targetId;



            if ($(options.idElem).size() < 1) {

                $(el).data("alreadyCreate", false);

                $("body").append('<div id="' + divCreated + '" tabindex="-1"></div>');

                $(options.idElem).css(
                    {
                        "z-index": options.zIndex,
                        "position": "absolute",
                        "top": "0",
                        "left": "-999em",
                        "visibility": "hidden"
                    }
                );

                if (options.classContainer !== "")
                    $(options.idElem).addClass(options.classContainer);

                if (options.target !== "" && options.idElem !== "") {
                    $(idTarget).appendTo(options.idElem).css('display','block');
                } else {
                    console.error("WARNING : Can't work ! target or ID automaticaly generated are empty");
                    return;
                }

                this.popinPosition(el, options);

                if (options.mode !== "layer") {
                    $(options.idElem).css("display", "none");
                    window.onresize = function () {
                        base.popinPosition(el, options);
                    };

                } else {

                    if (options.ajaxMode && $("#AjaxloadingLayer").size() < 1 && imgSrcLoader !== "") {
                        $(idTarget).append("<img src='" + imgSrcLoader + "' alt='loader' id='AjaxloadingLayer' />");
                        $("#AjaxloadingLayer").css(
                            {
                                "z-index": "1000",
                                "margin": "0 auto",
                                "display": "none"
                            }
                        );
                    }

                    if (options.outerClose)
                        base.bindFocusBlurEvents(el, options);
                }

                options.callbackMethodAfterCreate(el, options);

            } else {
                $(el).data("alreadyCreate", true);
            }
        },
        /* 
        popinPosition()
        Method enable calculate position of container in page 
        Enable relative position for Layer Mode
        */
        popinPosition: function (el, opts) {

            var popin, pos, wPopin, hPopin, positionWindowY, objPosition, posTrigger, realPosTop, realPosLeft, prop;

            if (!opts.customPosition) {
                popin = $(opts.idElem);
                pos = { top: 0, left: 0 };
                wPopin = popin.width();
                hPopin = popin.height();

                if (wPopin !== 0 && hPopin !== 0) {

                    positionWindowY = (window.pageYOffset !== undefined) ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;

                    if (opts.scrollPopin) 
                        positionWindowY = 0;

                    pos.left = parseInt(($(window).width() - wPopin) / 2, 10);
                    pos.top = parseInt((($(window).height() - hPopin) / 2) + positionWindowY, 10);

                    if (!opts.fullscreen) {
                        if (pos.top < 30)
                            pos.top = 30;
                    } else {
                        if (pos.top < 0)
                            pos.top = 0;
                    }

                    $(opts.idElem).css({
                        "top": pos.top,
                        "left": pos.left
                    });
                }

                if (opts.scrollPopin)
                    $(opts.idElem).css("position", "fixed");

            } else {
                objPosition = opts.relativePosition;
                posTrigger = $(el).offset();
                realPosTop = parseInt(posTrigger.top + 20, 10);
                realPosLeft = posTrigger.left;

                if (objPosition.left !== -1) {
                    for (prop in objPosition) {
                        switch (prop) {
                            case "left":
                                realPosLeft = (objPosition.left > 0) ? parseInt(objPosition.left + realPosLeft, 10) : realPosLeft = parseInt(realPosLeft + objPosition.left, 10);
                                break;

                            case "top":
                                realPosTop = (objPosition.top > 0) ? parseInt(objPosition.top + realPosTop, 10) : parseInt(realPosTop + objPosition.top, 10);
                                break;

                            case "right":
                                realPosLeft = (objPosition.right > 0) ? parseInt(objPosition.right + realPosLeft, 10) : parseInt(realPosLeft + objPosition.right, 10);
                                break;

                            case "bottom":
                                realPosTop = (objPosition.bottom > 0) ? parseInt(objPosition.bottom + realPosTop, 10) : parseInt(realPosTop + objPosition.bottom, 10);
                                break;
                        }
                    }
                }

                $(opts.idElem).css({
                    "top": realPosTop,
                    "left": realPosLeft
                });
            }

            $(this.layerID).height(this.getMaxHeight());

        },
        /*
        * layerLoaderPosition();
        * Method generate layer and loader for multiContent param
        */
        layerLoaderPosition: function () {
            var layer, wL, hL, loader, wLoad, hLoad, posLloader, posHloader, objImg;

            layer = $(base.options.idElem);
            wL = layer.width();
            hL = layer.height();

            if ($("#transparentLayerForLoader").size() > 0) {
                $("#transparentLayerForLoader").remove();
            }

            layer.append('<div id="transparentLayerForLoader"></div>');
            $("#transparentLayerForLoader").css({
                "zIndex": 999,
                "background": "#FFF",
                "opacity": "0.5",
                "height": hL + "px",
                "width": "100%",
                "position": "absolute",
                "top": 0,
                "left": 0,
                "display": "none"
            }).show();

            if ($(".ajaxLoaderStyle", base.options.idElem).size() > 0)
                $(".ajaxLoaderStyle", base.options.idElem).remove();

            $(base.options.idElem).append('<img src="' + base.options.ajaxLoaderLink + '" alt="loader" id="AjaxloadingLayer" class="ajaxLoaderStyle" />');

            loader = $(".ajaxLoaderStyle");

            // calculate position for loader
            objImg = new Image();
            objImg.src = loader.prop("src");
            wLoad = objImg.width;
            hLoad = objImg.height;
            posLloader = (wL / 2) - (wLoad / 2);
            posHloader = (hL / 2) - (hLoad / 2);

            loader.css({
                "zIndex": 1000,
                "margin": "0 auto",
                "display": "block",
                "position": "absolute",
                "top": posHloader + "px",
                "left": posLloader + "px"
            }).show();
            layer.show();
        },
        /*
        showTransparencyLayer()
        Method show transparency Layer under popin
        */
        showTransparencyLayer: function () {
            $(this.layerID).show();
        },
        /*
        hidePopinAndLayer()
        Method hide Popin and Layer and transparency Layer
        */
        hidePopinAndLayer: function (el, options) {
            if (options.idElem !== '') {
                $(options.idElem).hide();

                if (options.mode !== "layer")
                    $(this.layerID).hide();

                if (options.ajaxLoaderLink !== "")
                    $("#Ajaxloading").hide();

                if (options.fullscreen)
                    $("body").css("overflow", "auto");

                options.callbackMethodClose(el, options);
            }

            if (options.mode !== "layer") {
                if (options.bindESC) {
                    $(document).off("keyup");
                }
            }
        },
        /*
        getMaxHeight()
        Method return height of page
        */
        getMaxHeight: function () {
            var max = Math.max($(document).height(), $(window).height(), document.documentElement.clientHeight);
            return max;
        },
        /*
        jSCallBack()
        Method callback integrate response Ajax in popin/layer and show after
        Enable Ajax Fnac (ASPX) with separator in response
        */
        jSCallBack: function (response, options) {
            $(options.targetId).empty().append(response);

            if (!options.customPosition)
                base.popinPosition(null, options);

            $(options.idElem).css("visibility", "visible").show();

            base.options.callbackMethod();

            base.hideAjaxLoader();
        },
        /*
        viewAjaxLoader()
        Method positioning and show ajaxLoader for popin
        */
        viewAjaxLoader: function () {
            var loader, pos, wPopin, hPopin, positionWindowY;
            loader = $("#Ajaxloading");
            pos = { top: 0, left: 0 };
            wPopin = loader.width();
            hPopin = loader.height();

            positionWindowY = ($.support.boxSizing) ? window.scrollY : positionWindowY = document.documentElement.scrollTop;

            pos.left = parseInt(($(window).width() - wPopin) / 2, 10);
            pos.top = parseInt((($(window).height() - hPopin) / 2) + positionWindowY, 10);

            loader.css({
                top: pos.top,
                left: pos.left
            }).show();
        },
        /*
            showPopinContent()
        */
        showPopinContent: function (el, options) {

            if (options.ajaxMode && !$(el).data("alreadyCreate")) {
                if (options.mode !== "layer")
                    this.viewAjaxLoader();
                else
                    $("#AjaxloadingLayer," + options.idElem).css("display", "block");

                this.popinPosition(el, options);

                if (!options.multiContent)
                    options.ajaxMethod(el, this, options);

            } else {
                $(options.idElem).css("visibility", "visible").show();
            }

            if (options.multiContent && options.ajaxMode) {
                var imgSrcLoader = options.ajaxLoaderLink;
                if (imgSrcLoader !== "") {
                    if (options.mode === "layer")
                        this.layerLoaderPosition();

                    if (options.mode === "popin")
                        this.viewAjaxLoader();
                }
                options.ajaxMethod(el, this, options);
            }

        },
        /*
        hideAjaxLoader()
        Method hide ajax Loader
        */
        hideAjaxLoader: function () {
            $("#Ajaxloading, #AjaxloadingLayer, #transparentLayerForLoader").hide();
            $(base.options.idElem).show();
        },
        /*
        generatedID()
        Method generate ID with css class start open popin/layer
        */
        generatedId: function (options) {
            return options.idPrefix + options.targetId.substring(1);
        },
        /*
        hideClassControl();
        Method verifying if container popin has class .ide
        */
        hideClassControl: function () {
            if ($(this.options.targetId).is(':visible')) {
                $(this.options.targetId).css('display','none'); 
            }
        },
        /*
        hashControl() 
        Method verifying if target container has Hash before name or not
        */
        hashControl: function (controlValue) {
            return (controlValue.indexOf("#") === -1) ? "#" + controlValue : controlValue;
        }
    };

    $.fn[pluginName] = function (options) {
    	if (!options.selector) {console.error('The parameter "selector" can\'t be empty, it\'s required for plugin works'); return false;}
        	
        $(options.selector).data("plugin_"+pluginName, new Plugin(options));
        return this;
    };

})(jQuery, window, document);