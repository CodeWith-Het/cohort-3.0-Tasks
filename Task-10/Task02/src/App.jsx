import React, { useState } from 'react'

const App = () => {
  const [name, setName] = useState("")
  const [savedName, setSavedName] = useState("")

  const handleSavedName = () => {
  setSavedName(name)
  }
  
  const handleGetName = () => {
    console.log(savedName)
  }

  return (
    <div className="h-screen flex flex-col justify-center items-center gap-2">
      <input
        value={name}
        onChange={(e)=>setName(e.target.value)}
        type="text"
        placeholder="enter the name"
        className="border border-white p-2"
      />

      <div className="flex gap-2 justify-center items-center mt-2">
        <button
          className="border border-white pl-4 pr-4 text-xl cursor-pointer bg-green-500"
          onClick={handleSavedName}
        >
          save
        </button>
        <button className="border border-white pl-4 pr-4 text-xl cursor-pointer bg-red-500"
        onClick={handleGetName}>
          get
        </button>
      </div>

      <h6 className="text-3xl mt-2">{savedName}</h6>
    </div>
  );
}

export default App
