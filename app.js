//DEPENDENCIES 
var five = require("johnny-five");
// var nforce = require('nforce');
var jsforce = require('jsforce');

//Components
var board = new five.Board();
var conn = new jsforce.Connection();

//CUSTOM VARS
var TOTALLITERS = 20, pulses = 0, lastFlowRateTimer = 0; lastPulses = 0; lastFlowPinState = 0, ledLow = null, ledNotLow= null, ledActiveFlow=null, lastLitersSend = 0 ,pintSize = 2.11338;

// Open the connection
var boardConnected = connectWithSalesforce();


board.on("ready", function () {
		console.log('Board Ready!');
		
		// Led Map
		ledActiveFlow = new five.Led(10);
		ledLow = new five.Led(5);
		ledNotLow = new five.Led(6);

		// Reset Button with holdtime 1000ms
		button = new five.Button(9);
		board.repl.inject({ button: button, holdtime: 1000 });
		button.on("hold", fullTheBarrel);

		// Flow Metter trasition Pin
		this.pinMode(2, five.Pin.INPUT);

		// Check Digital Pin to see if theres a change
		var x = this.digitalRead(2, function (value) {
			// send the pin status to flowSignal helper
			flowSignal(value);
		});

		// Set how often to Emit data to Salesforce
		setInterval(checkActualLitters, 2000);

	});

	

function fullTheBarrel() {
	pulses = 0;
	lastFlowRateTimer = 0;
	lastPulses = 0;
	lastFlowPinState = 0;
	console.log('Keg Barrel is full again!');
}

/** 
 * connectWithSalesforce
 * return bool succeded connection
*/
function connectWithSalesforce() {
	// Salesforce Login
	console.log(process.env.CONSUMER_PASSWORD);
	console.log(process.env.CONSUMER_TOKEN);
	conn.login(process.env.CONSUMER_USERNAME, process.env.CONSUMER_PASSWORD + process.env.CONSUMER_TOKEN, function (err, res) {
		if (err) { console.error(err); return false;  }
		else { console.log('Logged succesfull');  return true; }
	});
}


function ledPulseAnimation() {
	ledActiveFlow.pulse({
		easing: "linear",
		duration: 500,
		cuePoints: [0, 0.2, 0.4, 0.6, 0.8, 1],
		keyFrames: [0, 150, 0, 150, 0, 150],
		onstop: function () {
			ledActiveFlow.off();
		}
	});
}

/*
* checkActualLitters
*/
function checkActualLitters() {
	var litres = pulses;
	// Turn on and turn off based on the flux
	var s = (litres != lastPulses) ? ledPulseAnimation() : ledActiveFlow.stop();
	lastPulses = pulses;
	litres /= 7.5;
	litres /= 60;
	litres = Math.round(litres * 100) / 100;
	var currentLiters = TOTALLITERS - litres;

	
	// Json Format data
	var data = { time: getDateString(), litersUsed: litres, litersAvailables: currentLiters, pintsAvailables: Math.round(currentLiters*pintSize) };
	
	// Send values only if it changes
	if (currentLiters != lastLitersSend) {
		console.log(data);

		conn.sobject("Bar_Tap_Reading__e").create({ deviceId__c: 'pirate', liters__c: TOTALLITERS - litres }, function (err, ret) {
			if (err || !ret.success) { return console.error(err, ret); }
			else {
				lastLitersSend = currentLiters;
				console.log(ret);
				console.log("Cheers! Platform event saved!");
			}
		});
	} else {
		console.log("Same quantity of beer(%s) data not sent, boring bar.", currentLiters);
	}

	// Light Handlers
	statusLed(litres);
}

/*
* statusLed
* 
*/
function statusLed(currentLitters) {

	//low barrel patrullero

	if (currentLitters == 0) {
		ledLow.stop();
		ledNotLow.pulse({
			easing: "linear",
			duration: 3000,
			cuePoints: [0, 0.2, 0.4, 0.6, 0.8, 1],
			keyFrames: [0, 0, 0, 150, 0, 0],
			onstop: function () {
				ledNotLow.off();
			}
		});
	} else {
		ledNotLow.stop();
		ledLow.pulse({
			easing: "linear",
			duration: 3000,
			cuePoints: [0, 0.2, 0.4, 0.6, 0.8, 1],
			keyFrames: [0, 0, 0, 150, 0, 0],
			onstop: function () {
				ledLow.off();
			}
		});
	}
}

/*
* flowSignal
* helper function to keep track of pulses
*/
function flowSignal(value) {
	if (value === 0) {
		lastFlowRateTimer++;
		return;
	}
	if (value === 1) {
		pulses++;
	}
	lastFlowPinState = value;
	flowrate = 1000.0;
	flowrate /= lastFlowRateTimer;
	lastFlowRateTimer = 0;
}


/*
* getDateString
* little helper function to get a nicely formatted date string
*/
function getDateString() {
	var time = new Date();
	// 10800000 is (GMT-3 Montevideo)
	// for your timezone just multiply +/-GMT by 3600000
	var datestr = new Date(time - 10800000).toISOString().replace(/T/, ' ').replace(/Z/, '');
	return datestr;
}