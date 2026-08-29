import React from 'react'
import { useState } from 'react';

const App = () => {

  const [count, setCount] = useState(0)
  
  const handleIncrement = () => {
    setCount(count+1)
  }

  const handleDecrement = () => {
    setCount(count-1)
  }

  const handleReset = () => {
    setCount(0)
  }

  return (
    <div className="h-screen flex flex-col items-center justify-center gap-2">
      <h1 className="font-bold text-3xl underline">counter App</h1>
      <h2 className="border border-white p-2 text-xl mt-2">counter:{count}</h2>

      <div className="flex gap-2 mt-2 font-medium">
        <button
          onClick={handleIncrement}
          className="border border-white p-2 cursor-pointer bg-green-400 text-black"
        >
          increment
        </button>
        <button
          onClick={handleDecrement}
          className="border border-white p-2 cursor-pointer bg-red-400 text-white"
        >
          decrement
        </button>

        <button
          onClick={handleReset}
          className="border border-white p-2 cursor-pointer bg-linear-to-r from-red-400 to-pink-600"
        >
          Reset
        </button>
      </div>
    </div>
  );
}

export default App
