function main() {

var buttonQueue = [];

function addQueue(x) {
	$('button-select-prompt').hide();
	if (buttonQueue.length < 2) {
		buttonQueue.push(x);
		x.valid = true;
		x.toggleClass('active');
	} else {
		x.toggleClass('active');
		buttonQueue.push(x);
		buttonQueue[0].toggleClass('active');
		buttonQueue[0].valid = false;
		buttonQueue.splice(0,1);
	}
}

function removeQueue(x) {
	x.toggleClass('active');
	x.valid = false;
	buttonQueue.splice($.inArray(x,buttonQueue),1);
}

$m1 = $('.m1-button');
$m2 = $('.m2-button');
$k1 = $('.k1-button');
$k2 = $('.k2-button');

$m1.valid = false;
$m2.valid = false;
$k1.valid = false;
$k2.valid = false;

function mouseToggle(button) {
	if ($.inArray(button,buttonQueue) === -1) {
		addQueue(button);

	} else {
		removeQueue(button);
	}
}

function keyToggle(button) {
	if ($.inArray(button,buttonQueue) === -1) {
		button.text("press key");
		$(document).on("keydown", function(event) {
			button.key = event.which;
			button.text(keyToString(event.which));
			$(document).off();
			addQueue(button);
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



var clicks = [];
var targetClicks = $(".non").val();
var bpm = 0;
var variance = 0;
var startTime = 0;

function sqr(x) {
	return Math.pow(x,2);
}

function results() {
	if (clicks.length > 1) {
	clicks[clicks.length-1].mean = (clicks[clicks.length-2].mean*(clicks.length-2)
	+ clicks[clicks.length-1].diff)/(clicks.length-1);

	var curr_mean = clicks[clicks.length-1].mean;
	var old_mean = clicks[clicks.length-2].mean;
	var x_new = clicks[clicks.length-1].diff;
	var old_var = variance;

	variance = (old_var + sqr(old_mean) - sqr(curr_mean))
	           + (sqr(x_new) - old_var - sqr(old_mean))/(clicks.length-1);



    }
	bpm = ((clicks.length/(clicks[clicks.length-1].since))*60000)/4;
	$("#bpm").html("BPM: " + bpm);
	$("#clicks").text("Clicks: "+ clicks.length);
	$("#UR").text("UR: " + (Math.sqrt(variance)*10));
	$("#mean").text("Mean: "+clicks[clicks.length-1].mean);
	$("#currdiff").text("Currdiff: "+clicks[clicks.length-1].diff);
}

function clickTime(a, b, c) {
	this.since = a;
	this.diff = b;
	this.mean = c;
}

function tap() {
	if (clicks.length === 0) {
		startTime = $.now();
		var ct = new clickTime(0,0,0);
		clicks.push(ct);
		timer();
		results();
		return true;
	} else if (clicks.length < targetClicks) {
		var n = $.now();
		var currDiff = (n - startTime) - (clicks[clicks.length-1]).since;
		var ct = new clickTime(n - startTime,currDiff,currDiff);
		clicks.push(ct);
		results();
	} else {
		results();
	}
}
var ms = 0;
var k1Event = 0;
var k2Event = 0;
var tries = 0;
function ready() {
	targetClicks = $(".non").val();
	k1Down = $.Event( "keydown", { keyCode: $k1.key});
	k2Down = $.Event( "keydown", { keycode: $k2.key});
	$(document).on('mousedown',function(event) {
		if (!$(event.target).closest('#start').length) {
			if ($m1.valid && event.which === 1) {
				tap();
			} else if ($m2.valid && event.which == 3) {
				tap();
			}
		}
	});
	$(document).on('keydown',function(event) {
		if ((event.which === $k1.key && $k1.valid) || (event.which === $k2.key && $k2.valid)) {
			tap();
		}
	});
	$('.start-prompt').show();
	$('#start').off();
	$('#start').text("restart");
	$('#start').on('click',restart);
}
var time = 0;
function restart() {
	tries++;
	if (tries >= 2) {
		$('.retries').text(""+tries+" retries and counting...");
		$('.retries').show();
	}
	$(document).off();
	clearInterval(time);
	time = 0;
	$("#bpm").html("BPM: ");
	$("#clicks").text("Clicks: ");
	$("#ms").text("ms: ");
	bpm = 0;
	clicks = [];
	ms = 0;
	variance = 0;
	targetClicks = $('.non').val();
	$("#start").off();
	$("#start").text("start");
	ready();
}
function timer() {
	$('.start-prompt').hide();
	time = 0;
	time = setInterval(function(){
		++ms;
		$('#ms').text("ms: " + ms);
		if (clicks.length >= targetClicks) {
			clearInterval(time);
			$(document).off();
		}
	},10);

}


$('#start').on('click',function() {
	if (buttonQueue.length === 0) {
		alert('Please select at least 1 button');
	} else {
		ready();
	}
});

}
$(document).ready(main);