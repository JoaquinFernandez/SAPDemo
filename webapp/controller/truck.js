var lastStopTime = new Date()
var lastStop = [0,0,0,0]
var lastStopDuration = 0

function printTime(time) {
  return time.getDate() + "/"
          + (time.getMonth()+1)  + "/" 
          + time.getFullYear() + " @ "  
          + ('0' + time.getHours()).substr(-2) + ":"  
          + ('0' + time.getMinutes()).substr(-2);
}

function printStopDuration(duration) {
  var ms = duration % 1000;
  duration = (duration - ms) / 1000;
  var secs = duration % 60;
  duration = (duration - secs) / 60;
  var mins = duration % 60;
  var hrs = (duration - mins) / 60;

  return ('0' + hrs).substr(-2) + ':' + ('0' + mins).substr(-2) + ':' + ('0' + secs).substr(-2);
}

function calculateLastStop(payload) {
  var accelX = parseFloat(payload["accelX"])
  var accelY = parseFloat(payload["accelY"])
  var accelZ = parseFloat(payload["accelZ"])
  
  if (accelX != lastStop[0] || accelY != lastStop[1] || accelZ != lastStop[2]) {
    if (lastStop[3] == 0) {
      lastStop[3] = 1
    }
    lastStop[0] = accelX
    lastStop[1] = accelY
    lastStop[2] = accelZ
  } else {
    if (lastStop[3] == 1) {
      lastStopTime = new Date()
      lastStop[3] = 0
    } else {
      lastStopDuration = Math.abs(new Date() - lastStopTime.getTime());
    }
  } 
}


var wsbroker = "iot.eclipse.org";  //mqtt websocket enabled broker
var wsport = 443 // port for above
var client = new Paho.MQTT.Client(wsbroker, wsport, "myclientid_" + parseInt(Math.random() * 100, 10));
client.onConnectionLost = function (responseObject) {
  console.log("connection lost: " + responseObject.errorMessage);
};
client.onMessageArrived = function (message) {
  var payload = JSON.parse(message.payloadString)["messages"][0]
  calculateLastStop(payload)
  $("#deviceID").text("ID: " + payload["sensor"])
  $("#ambientTemp").text("Temperature: " + parseFloat(payload["ambientTemp"]).toFixed(2) + "°C")
  $("#pressure").text("Pressure: " + parseFloat(payload["pressure"]).toFixed(2) + " mbar")
  $("#altitude").text("Altitude: " + parseFloat(payload["altitude"]).toFixed(2) + " meter")
  $("#light").text("Light: " + parseFloat(payload["light"]).toFixed(2) + " lux")
  $("#lastStop").text("Last stop: " + printTime(lastStopTime))
  $("#lastStopDuration").text("Duration: " + printStopDuration(lastStopDuration))
  console.log(message.destinationName, ' -- ', message.payloadString);
};
var options = {
  timeout: 3,
  useSSL: true,
  onSuccess: function () {
    console.log("mqtt connected");
    // Connection succeeded; subscribe to our topic, you can add multile lines of these
    client.subscribe('iot/data/iotmmsp2000234487trial/v1/f56fe2b5-88cc-44d6-bf35-80eb15fe4a13', {qos: 1});

  },
  onFailure: function (message) {
    console.log("Connection failed: " + message.errorMessage);
  }
};

client.connect(options);