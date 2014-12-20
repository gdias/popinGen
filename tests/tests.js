// TESTS.js

module("Basic Tests");
  

test("Create a simple popin", function() { 
	
	// control exist handler & container
	ok($('.open-popin0').length, "Have handler");
	ok($('#popinContent0').length, "Have container");

	$().popinGen({
		selector : ".open-popin0",
		target : "popinContent0"
	});

	// get plugin in data of handler
	var dataPlugin = $('.open-popin0').data('plugin_popinGen');

	// control exist plugin
	ok(dataPlugin, "Plugin started");

	// control options 
	equal(dataPlugin.options.selector, ".open-popin0", "Option target ok");

	$('.open-popin0').click(); // open-popin
 	console.log($('#popinContainer_popinContent0').length)
	// Control new container exist
	equal($('#popinContainer_popinContent0').length, 1, "Container has been generated by plugin");
	equal($('#popinContainer_popinContent0').children().length, 1, "Content of popin correctly deplaced");

	$("#popinContent0 .close").click(); // close popin

	// Control close
	equal($('#popinContainer_popinContent0').is(':visible'), false, "Popin has been closed");

});




test("Create a simple layer", function() { 

	// control exist handler & container
	ok($('.open-layer').length, "Have handler");
	ok($('#layerContent').length, "Have container");

	$().popinGen({
		eventStart : "mousedown",
		selector : ".open-layer",
		target : "layerContent",
		mode : "layer"
	});

	$(".open-layer").mousedown();

	// control if container generated exist and correctly deplaced
	equal($('#popinContainer_layerContent').length, 1, "Container has been generated by plugin");
	equal($('#popinContainer_layerContent').children().length, 1, "Layer correctly deplaced");

});


test("Control options of plugin in popin mode", function(){

	$().popinGen({
		selector : ".open-popin1",
		target : "popinContent1",
		classContainer : "myPopin1",
		zIndex:"9999",
		backgroundLayerColor :"#CCC"
	});

	$(".open-popin1").click(); // open popin Test 1

	equal($('#popinContainer_popinContent1').hasClass("myPopin1"), true, "Container has css class passed in parameter");

	var dataPlugin = $('.open-popin1').data('plugin_popinGen');

	equal(dataPlugin.options.mode, "popin", "Verifying default value for mode");
	equal(dataPlugin.options.targetId, "#popinContent1", "Parameter is correctly transformed for internal use in the case or 'target' have not #");

	equal($('#popinContainer_popinContent1').css("z-index"), "9999", "Parameter 'zIndex is correctly added on container of popin");

	//equal($('#popinContainer_popinContent1').css("z-index"), "9999", "Verifying if parameter 'zIndex is correctly added on container of popin");

	$("#popinContent1 .close").click(); // close popin

});

module("Advanced Tests");

test("Control toggle event for open layer", function(){

	$().popinGen({
		selector : ".open-layer2",
		target : "layerContent2",
		mode : "layer",
		toggle:true
	});

	ok($('.open-layer2').length, "Have handler");
	$('.open-layer2').click();
	equal($('#popinContainer_layerContent2').size(), 1, "Container of layer has been created");
	equal($('#popinContainer_layerContent2').children().size(), 1, "Content of layer has been deplaced");
	equal($('#popinContainer_layerContent2').css('display'), "block", "Click for open : Layer is visible");
	$('.open-layer2').click();
	equal($('#popinContainer_layerContent2').css('display'), "none", "Click for close : Layer is hidden");

});

test("Control outerClose property for close layer", function(){

	// control exist handler & container
	ok($('.open-layer3').length, "Have handler 3");
	ok($('#layerContent3').length, "Have container 3");

	$().popinGen({
		selector : ".open-layer3",
		target : "layerContent3",
		mode : "layer",
		toggle:true,
		outerClose:true
	});

	ok($('.open-layer3').length, "Have handler");

	//click event transform in mousedown event
	$('.open-layer3').mousedown();

	equal($('#popinContainer_layerContent3').size(), 1, "Container of layer has been created");
	equal($('#popinContainer_layerContent3').children().size(), 1, "Content of layer has been deplaced");
	equal($('#popinContainer_layerContent3').css('display'), "block", "Layer is visible");
	
	$('#popinContainer_layerContent3').blur();
	equal($('#popinContainer_layerContent3').css('display'), "none", "Layer is hidden when click on body");

});
