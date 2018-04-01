var wsbroker = "test.mosquitto.org";  //mqtt websocket enabled broker
var wsport = 8080 // port for above
var client = new Paho.MQTT.Client(wsbroker, wsport, "myclientid_" + parseInt(Math.random() * 100, 10));
client.onConnectionLost = function (responseObject) {
  console.log("connection lost: " + responseObject.errorMessage);
};
client.onMessageArrived = function (message) {
  console.log(message.destinationName, ' -- ', message.payloadString);
};
var options = {
  timeout: 3,
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