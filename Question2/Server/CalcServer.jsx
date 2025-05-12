const http = require('http');
const fetch = require('node-fetch');

const PORT = 9876;
const WINDOW_SIZE = 10;
let windowData = [];

const apiMap = {
  p: 'primes',
  f: 'fibo',
  e: 'even',
  r: 'rand',
};

const fetchWithTimeout = (url, timeout = 500) => {
  return Promise.race([
    fetch(url).then((res) => res.json()),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Timeout')), timeout)
    ),
  ]);
};

const calculateAverage = (numbers) => {
  if (numbers.length === 0) return 0;
  const sum = numbers.reduce((acc, num) => acc + num, 0);
  return (sum / numbers.length).toFixed(2);
};

const updateWindow = (newNumbers) => {
  const uniqueNumbers = [...new Set([...windowData, ...newNumbers])];
  if (uniqueNumbers.length > WINDOW_SIZE) {
    uniqueNumbers.splice(0, uniqueNumbers.length - WINDOW_SIZE);
  }
  windowData = uniqueNumbers;
};

const requestHandler = async (req, res) => {
  const urlParts = req.url.split('/');
  const numberid = urlParts[2];

  if (!apiMap[numberid]) {
    res.statusCode = 400;
    res.end(JSON.stringify({ error: 'Invalid number ID' }));
    return;
  }

  const apiUrl = `http://20.244.56.144/evaluation-service/${apiMap[numberid]}`;

  try {
    const data = await fetchWithTimeout(apiUrl, 500);
    const newNumbers = data.numbers;

    if (!newNumbers || newNumbers.length === 0) {
      res.statusCode = 404;
      res.end(JSON.stringify({ error: 'No numbers returned from the API' }));
      return;
    }

    updateWindow(newNumbers);

    const avg = calculateAverage(windowData);

    const response = {
      windowPrevState: windowData.slice(0, windowData.length - newNumbers.length),
      windowCurrState: windowData,
      numbers: newNumbers,
      avg: parseFloat(avg),
    };

    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(response));
  } catch (error) {
    console.log('Error or timeout:', error.message);
    res.statusCode = 500;
    res.end(JSON.stringify({ error: 'Request failed or timed out' }));
  }
};

const server = http.createServer(requestHandler);

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
