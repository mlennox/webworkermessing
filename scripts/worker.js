const bigCalc = (size) => {
  size = size || 10000;
  for (let i = 0; i < size; i++) {
    Math.random();
  }
};

onmessage = function(message) {
  console.log('message received by worker', message);
  const start = Date.now();
  bigCalc(message.data.size);
  postMessage(`bigCalc : for ${message.data.size} it took ${Date.now() - start}ms`);
};

