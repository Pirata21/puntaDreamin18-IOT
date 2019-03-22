//DEPENDENCIES 
var five = require("johnny-five");

//Components
var board = new five.Board();

//CUSTOM VARS



board.on("ready", function() {

  console.log('Board Ready!');


  // Track led to show if we have active flow
  led = new five.Led(13);
  
  // Set Flow trasition Pin
  this.pinMode(2, five.Pin.INPUT);
  
  var random = Math.random().toString(36).replace(/[^a-z]+/g, "").substr(0, 4).toUpperCase();

  var p = new five.LCD({
    pins: [8, 9, 4, 5, 6, 7],
    backlight: 10,
  });

  p.useChar("heart");
  p.cursor(0, 0).print("hello :heart:");
  p.blink();
  p.cursor(1, 0).print("Blinking? ");
  p.cursor(0, 10).print(random);

  // Controller: JHD1313M1 (Grove)
  var j = new five.LCD({
    controller: "QC1602A"
  });

  j.useChar("heart");
  j.cursor(0, 0).print("hello :heart:");
  j.blink();
  j.cursor(1, 0).print("Blinking? ");
  j.cursor(0, 10).print(random);



  setTimeout(function() {
    process.exit(0);
  }, 3000);


//   // Check Digital Pin to see if theres a change
//   var x = this.digitalRead(2, function(value) {
//     // send the pin status to flowSignal helper
//     flowSignal(value);
    
//   });

//   // Set how often to Emit data to Salesforce
//   setInterval(checkActualLitters, 2000);

});


// /*
// * checkActualLitters
// */
// function checkActualLitters () {
//     var liters = pulses;
//     // Turn on and turn off based on the flux
//     var s = (liters !=  lastPulses) ? led.on() : led.off();

//     lastPulses = pulses;
    
//     liters /= 7.5;
//     liters /= 60;
    
//     var data = {time:getDateString(), litersUsed :liters, litersAvailable: TOTALLITERS - liters};
//     console.log(data);
//     conn.sobject("Bar_Tap_Reading__e").create({ deviceId__c : '1235', liters__c: 0 }, function(err, ret) {
//       if (err || !ret.success) { return console.error(err, ret); }
//       else {
//         console.log(ret);
//       }
//       console.log("saved");
//       // ...
//     });
    
//     // flow_stream.emit('data', JSON.stringify(data)+'\n');
// }

// /*
// * flowSignal
// * helper function to keep track of pulses
// */
// function flowSignal (value) {
//     if (value === 0) {
//       lastFlowRateTimer ++;
//       return;
//     }
//     if (value === 1) {
//       pulses ++;
//     }
//     lastFlowPinState = value;
//     flowrate = 1000.0;
//     flowrate /= lastFlowRateTimer;
//     lastFlowRateTimer = 0;
// }


// /*
// * getDateString
// * little helper function to get a nicely formatted date string
// */
// function getDateString () {
//   var time = new Date();
//   // 10800000 is (GMT-3 Montevideo)
//   // for your timezone just multiply +/-GMT by 3600000
//   var datestr = new Date(time - 10800000).toISOString().replace(/T/, ' ').replace(/Z/, '');
//   return datestr;
// }



// function isSetup() {
//   return (process.env.CONSUMER_KEY != null) && (process.env.CONSUMER_SECRET != null);
// }