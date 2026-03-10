import { motion } from 'motion/react';

export function ECGBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none opacity-10 z-0">
      <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <motion.path
          d="M 0 100 L 50 100 L 60 100 L 65 50 L 70 150 L 75 100 L 100 100 L 150 100 L 160 100 L 165 50 L 170 150 L 175 100 L 200 100 L 250 100 L 260 100 L 265 50 L 270 150 L 275 100 L 300 100 L 350 100 L 360 100 L 365 50 L 370 150 L 375 100 L 400 100"
          stroke="#FF3B3B"
          strokeWidth="2"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </svg>
    </div>
  );
}
