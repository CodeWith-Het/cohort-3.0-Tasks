import React from "react";
import { motion, AnimatePresence } from "framer-motion";

const GameOver = ({ show, score, onRestart }) => {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="absolute inset-0 bg-black/90 z-20 flex flex-col items-center justify-center backdrop-blur-md"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
        >
          <h2 className="text-[#ff3b3b] text-4xl m-0 tracking-[4px] uppercase font-bold">
            Game Over
          </h2>
          <p className="text-gray-400 text-lg my-3">Final Score</p>
          <div className="text-[#BFFF00] text-6xl font-black mb-6">{score}</div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-3 bg-[#BFFF00] text-black border-none rounded-lg text-base font-extrabold cursor-pointer tracking-widest uppercase shadow-lg shadow-[#BFFF00]/20"
            onClick={onRestart}
          >
            ↺ Restart
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default GameOver;
