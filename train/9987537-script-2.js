// WEB AUDIO API CHECK
window.AudioContext = window.AudioContext || window.webkitAudioContext;
if (!AudioContext) {
  alert("Sorry, your browser doesn't support the Web Audio APIs.");
  throw new Error("Sorry, your browser doesn't support the Web Audio APIs. Execution Aborted."); // ABORT ALL
}
      
var frequencyByKey = {
  65: 261.626, // C4
  87: 277.183, // C#4
  83: 293.665, // D4
  69: 311.127, // D#4
  68: 329.628, // E4
  70: 349.228, // F4
  84: 369.994, // F#4
  71: 391.995, // G4
  89: 415.305, // G#4
  72: 440.000, // A4
  85: 466.164, // A#4
  74: 493.883, // B4
  75: 523.251, // C5
  79: 554.365, // C#5
  76: 587.330, // D5
  80: 622.254 // D#5
};

var nameByKey = {
  65: "C4",
  87: "C#4",
  83: "D4",
  69: "D#4",
  68: "E4",
  70: "F4",
  84: "F#4",
  71: "G4",
  89: "G#4",
  72: "A4",
  85: "A#4",
  74: "B4",
  75: "C5",
  79: "C#5",
  76: "D5",
  80: "D#5"
};
      
var show = document.getElementById("show");

var context = new AudioContext(),
    gain = context.createGain(),
    nodes = [];

gain.gain.value = 0.5;
gain.connect(context.destination);

document.addEventListener('keydown', function (event) {
  var alreadyPressed = false;
  for (var i = 0; i < nodes.length; i++) {
    if (nodes[i].code === event.keyCode) {
      alreadyPressed = true;
      break;
    }
  }
  if (event.keyCode >= 65 && event.keyCode <= 90 && !alreadyPressed) {
    var osc = context.createOscillator();
    osc.type = "square";
    osc.frequency.value = frequencyByKey[event.keyCode];
    osc.connect(gain);
    try {
      osc.start(0);
    } catch (e) {}
    nodes.push({
      code: event.keyCode,
      node: osc
    });
              	
    var str = "";
    for (var i = 0; i < nodes.length; i++) {
      str += nameByKey[nodes[i].code] + " ";
    }
    show.textContent = str;
  }
}, false);

document.addEventListener('keyup', function (event) {
  var garbage = [];
  for (var i = 0; i < nodes.length; i++) {
    if (nodes[i].code === event.keyCode) {
      nodes[i].node.stop(0);
      nodes[i].node.disconnect();
      garbage.push(i);
    }
  }
  for (var i = 0; i < garbage.length; i++) {
    nodes.splice(garbage[i], 1);
  }
  var str = "";
  for (var i = 0; i < nodes.length; i++) {
    str += nameByKey[nodes[i].code] + " ";
  }
  show.textContent = str;
}, false);