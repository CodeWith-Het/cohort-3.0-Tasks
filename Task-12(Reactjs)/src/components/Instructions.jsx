import React from 'react'

const Instructions = () => {
  return (
    <div className="mt-6 text-gray-400 text-sm leading-relaxed max-w-5xl bg-[#111] p-5 rounded-xl border border-gray-800 w-full">
      <p>
        <strong className="text-white">How to play:</strong>
        <br />- <strong className="text-white">Open Palm ✋</strong> → Aim mode.
        Hath hilao → crosshair palm ke center se move hoga.
        <br />- <strong className="text-white">Closed Fist ✊</strong> → Shoot!
        Duck pe aim karo aur mutthi banao.
        <br />- Duck miss karne pe ek life jaayegi. 5 lives khatam = Game Over!
      </p>
    </div>
  );
}

export default Instructions
