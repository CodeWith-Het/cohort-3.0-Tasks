import React from "react";
import { motion } from "framer-motion";

const HUD = ({ score, lives, shots }) => {
  return (
    <div className="absolute top-4 left-4 flex gap-3 z-10 pointer-events-none">
      <motion.div
        whileHover={{ scale: 1.05 }}
        className="bg-black/70 border border-gray-800 px-3 py-2 rounded-lg text-sm backdrop-blur-sm"
      >
        Score:{" "}
        <strong className="text-[#BFFF00] text-base ml-1">{score}</strong>
      </motion.div>
      <motion.div
        whileHover={{ scale: 1.05 }}
        className="bg-black/70 border border-gray-800 px-3 py-2 rounded-lg text-sm backdrop-blur-sm"
      >
        Lives:{" "}
        <strong className="text-[#BFFF00] text-base ml-1">{lives}</strong>
      </motion.div>
      <motion.div
        whileHover={{ scale: 1.05 }}
        className="bg-black/70 border border-gray-800 px-3 py-2 rounded-lg text-sm backdrop-blur-sm"
      >
        Shots:{" "}
        <strong className="text-[#BFFF00] text-base ml-1">{shots}</strong>
      </motion.div>
    </div>
  );
};

export default HUD;
