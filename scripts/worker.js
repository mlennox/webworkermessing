onmessage = function(message) {
  console.log("Message received from main script", message);
  let reply = message.data.fn(message.data);
  postMessage(reply);
};
