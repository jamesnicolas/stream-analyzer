function main() {

var buttonQueue = [];

function addQueue(x) {
	$('button-select-prompt').hide();
	if (buttonQueue.length < 2) {
		buttonQueue.push(x);
		x.toggleClass('active');
	} else {
		x.toggleClass('active');
		buttonQueue.push(x);
		buttonQueue[0].toggleClass('active');
		buttonQueue.splice(0,1);
	}
}

function removeQueue(x) {
	x.toggleClass('active');
	buttonQueue.splice($.inArray(x,buttonQueue),1);
}

$m1 = $('.m1-button');
$m2 = $('.m2-button');
$k1 = $('.k1-button');
$k2 = $('.k2-button');

function mouseToggle(button) {
	if ($.inArray(button,buttonQueue) === -1) {
		addQueue(button);

	} else {
		removeQueue(button);
	}
}

function keyToggle(button) {
	if ($.inArray(button,buttonQueue) === -1) {
		addQueue(button);
		button.text("press key");
		$(document).on("keydown", function(event) {
			button.key = event.which;
			button.text(keyToString(event.which));
			$(document).off();
		});


	} else {
		removeQueue(button);

	}
}

$m1.on('click',function(){mouseToggle($m1)});
$m2.on('click',function(){mouseToggle($m2)});

$k1.on('click',function(){
	keyToggle($k1);

});
$k2.on('click',function(){keyToggle($k2)});



var clicks = 0;
var targetClicks = $(".non").val();
var bpm = 0;

function results() {
	bpm = ((clicks/ms)*6000)/4;
	$("#bpm").html("BPM: " + bpm);
	$("#clicks").text("Clicks: "+ clicks);
}

function tap() {
	if (clicks === 0) {
		timer();
	}
	if (clicks < targetClicks) {
		clicks++;
		results();
	} else {
		results();
	}
}
var ms = 0;
var k1Event = 0;
var k2Event = 0;

function ready() {
	targetClicks = $(".non").val();
	k1Down = $.Event( "keydown", { keyCode: $k1.key});
	k2Down = $.Event( "keydown", { keycode: $k2.key});
	$(document).on('mousedown',function(event) {
		if (!$(event.target).closest('#start').length) {
			tap();
		}
	});

	$(document).on('keydown',function(event) {
		if (event.which === $k1.key || event.which === $k2.key) {
			tap();
		}
	});




	$('#start').after("<p id='start-prompt'>The timer begins on your first tap.<br/></p>");
	$('#start').off();
	$('#start').text("restart");
	$('#start').on('click',restart);
}
var time = 0;
function restart() {
	$(document).off();
	clearInterval(time);
	time = 0;
	$("#bpm").html("BPM: ");
	$("#clicks").text("Clicks: ");
	$("#ms").text("ms: ");
	bpm = 0;
	clicks = 0;
	ms = 0;
	targetClicks = $('.non').val();
	$("#start").off();
	$("#start").text("start");
	$("#start").on('click',ready);
}

function timer() {
	time = 0;
	time = setInterval(function(){
		++ms;
		$('#ms').text("ms: " + ms);
		if (clicks >= targetClicks) {
			clearInterval(time);
			$(document).off();
		}
	},10);

}


$('#start').on('click',ready);

}
$(document).ready(main);