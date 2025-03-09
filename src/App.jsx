import React, { useState } from 'react';

export default function DiskSchedulingSimulator() {
  const [requests, setRequests] = useState('');
  const [head, setHead] = useState('');
  const [algorithm, setAlgorithm] = useState('SCAN');
  const [seekSequence, setSeekSequence] = useState([]);
  const [seekTime, setSeekTime] = useState(0);

  const handleCalculate = () => {
    let reqArray = requests.split(',').map(Number);
    let currentHead = parseInt(head);
    let seq = [];
    let time = 0;

    if (algorithm === 'FCFS') {
      for (let i = 0; i < reqArray.length; i++) {
        seq.push(reqArray[i]);
        time += Math.abs(currentHead - reqArray[i]);
        currentHead = reqArray[i];
      }
    }

    else if (algorithm === 'SCAN') {
      reqArray.sort((a, b) => a - b);
      let left = reqArray.filter(r => r < currentHead);
      let right = reqArray.filter(r => r >= currentHead);

      for (let i = 0; i < right.length; i++) {
        seq.push(right[i]);
        time += Math.abs(currentHead - right[i]);
        currentHead = right[i];
      }

      time += Math.abs(currentHead - 199);
      currentHead = 199;

      for (let i = left.length - 1; i >= 0; i--) {
        seq.push(left[i]);
        time += Math.abs(currentHead - left[i]);
        currentHead = left[i];
      }
    }

    else if (algorithm === 'C-SCAN') {
      reqArray.sort((a, b) => a - b);
      let right = reqArray.filter(r => r >= currentHead);
      let left = reqArray.filter(r => r < currentHead);

      for (let i = 0; i < right.length; i++) {
        seq.push(right[i]);
        time += Math.abs(currentHead - right[i]);
        currentHead = right[i];
      }

      time += Math.abs(currentHead - 0);
      currentHead = 0;

      for (let i = 0; i < left.length; i++) {
        seq.push(left[i]);
        time += Math.abs(currentHead - left[i]);
        currentHead = left[i];
      }
    }

    else if (algorithm === 'SSTF') {
      while (reqArray.length > 0) {
        let minDistance = Infinity;
        let minIndex = -1;

        for (let i = 0; i < reqArray.length; i++) {
          let distance = Math.abs(currentHead - reqArray[i]);
          if (distance < minDistance) {
            minDistance = distance;
            minIndex = i;
          }
        }

        seq.push(reqArray[minIndex]);
        time += minDistance;
        currentHead = reqArray[minIndex];
        reqArray.splice(minIndex, 1);
      }
    }

    setSeekSequence(seq);
    setSeekTime(time);
  };

  return (
    <div className="p-6 bg-gray-900 min-h-screen text-orange-500">
      <h1 className="text-3xl font-bold mb-4">Disk Scheduling Simulator</h1>

      <div className="mb-4">
        <label>Request Queue (comma separated):</label>
        <input 
          type="text" 
          value={requests} 
          onChange={(e) => setRequests(e.target.value)} 
          className="p-2 text-red-500 w-full" 
        />
      </div>

      <div className="mb-4">
        <label>Initial Head Position:</label>
        <input 
          type="number" 
          value={head} 
          onChange={(e) => setHead(e.target.value)} 
          className="p-2 text-red-500 w-full" 
        />
      </div>

      <div className="mb-4">
        <label>Select Algorithm:</label>
        <select 
          value={algorithm} 
          onChange={(e) => setAlgorithm(e.target.value)}
          className="p-2 text-blue-600 w-full">
          <option value="FCFS">FCFS</option>
          <option value="SCAN">SCAN</option>
          <option value="C-SCAN">C-SCAN</option>
          <option value="SSTF">SSTF</option>
        </select>
      </div>

      <button 
        onClick={handleCalculate} 
        className="bg-blue-500 px-4 py-2 rounded-md">
        Calculate Seek Time
      </button>

      {seekSequence.length > 0 && (
        <div className="mt-4">
          <h2 className="text-xl">Seek Sequence:</h2>
          <p>{seekSequence.join(' ➞ ')}</p>
          <h2 className="text-xl mt-2">Total Seek Time:</h2>
          <p>{seekTime} Cylinders</p>
        </div>
      )}

      <div className="mt-10 text-center text-gray-500">
        <a 
          href="https://github.com/irregular-luck" 
          target="_blank"
          className="text-xl font-bold text-purple-400 animate-pulse">
          💻 Owned by <span className="text-yellow-400">Irregular_Luck</span>
        </a>
      </div>
    </div>
  );
}
