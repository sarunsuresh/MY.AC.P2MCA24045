import React, { useState } from 'react';

const AvgCalc = () => {
  const [PrevState, setPrevState] = useState([]);
  const [CurrState, setCurrState] = useState([]);
  const [numbers, setNumbers] = useState([]);
  const [avg, setAvg] = useState(null);
  const [error, setError] = useState('');

  const apiMap = {
    p: 'Prime',
    f: 'Fibonacci',
    e: 'Even',
    r: 'Random',
  };

 
  const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiZXhwIjoxNzQ3MDU0MzA1LCJpYXQiOjE3NDcwNTQwMDUsImlzcyI6IkFmZm9yZG1lZCIsImp0aSI6ImRkYzZlYjEzLTUwNmQtNDQzYi1hMTFlLTkxNmVhMzBlNDFiZSIsInN1YiI6Im15LmFjLnAybWNhMjQwNDVAbXkuc3R1ZGVudHMuYW1yaXRhLmVkdSJ9LCJlbWFpbCI6Im15LmFjLnAybWNhMjQwNDVAbXkuc3R1ZGVudHMuYW1yaXRhLmVkdSIsIm5hbWUiOiJzYXJ1biBzIiwicm9sbE5vIjoibXkuYWMucDJtY2EyNDA0NSIsImFjY2Vzc0NvZGUiOiJTd3V1S0UiLCJjbGllbnRJRCI6ImRkYzZlYjEzLTUwNmQtNDQzYi1hMTFlLTkxNmVhMzBlNDFiZSIsImNsaWVudFNlY3JldCI6ImRrU2tDWEN0Ym1GQWRWc0EifQ.To8GcoOojslAmp_p0Tz-BzsHJYLrgZ3jh461gWiWHkY";

  const handleFetch = async (type) => {
    setError(''); 
    try {
      const response = await fetch(`http://localhost:9876/numbers/${type}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }

      const data = await response.json();

     console.log('API Response:', data);

      if (data.error) {
        setError(data.error);
        return;
      }

      setPrevState(data.PrevState);
      setCurrState(data.CurrState);
      setNumbers(data.numbers);
      setAvg(data.avg);
    } catch (error) {
      setError('Error: ' + error.message);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Average Calculator Microservice</h2>

      <div>
        <button onClick={() => handleFetch('e')}>Even</button>
        <button onClick={() => handleFetch('p')}>Prime</button>
        <button onClick={() => handleFetch('f')}>Fibonacci</button>
        <button onClick={() => handleFetch('r')}>Random</button>
      </div>

      {error && (
        <div style={{ color: 'red', marginTop: '20px' }}>
          <p>{error}</p>
        </div>
      )}

      <div style={{ marginTop: '20px' }}>
        <h3>Previous Window State</h3>
        <pre>{JSON.stringify(PrevState, null, 2)}</pre>

        <h3>Current Window State</h3>
        <pre>{JSON.stringify(CurrState, null, 2)}</pre>

        <h3>Numbers Fetched</h3>
        <pre>{JSON.stringify(numbers, null, 2)}</pre>

        <h3>Average</h3>
        <p>{avg !== null ? avg : 'No average available'}</p>
      </div>
    </div>
  );
};

export default AvgCalc;
