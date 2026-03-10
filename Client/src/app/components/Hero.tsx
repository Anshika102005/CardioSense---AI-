import { motion } from 'motion/react';
import { Heart } from 'lucide-react';

export function Hero() {
  const handleStartAnalysis = () => {
    const userSection = document.getElementById('user-identity');
    userSection?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden">
      {/* Gradient orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#FF3B3B]/20 rounded-full blur-[100px] animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-red-500/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />

      <div className="relative z-10 max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
        {/* Left: Text Content */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-block mb-4"
          >
            <span className="px-4 py-2 bg-[#FF3B3B]/10 border border-[#FF3B3B]/30 rounded-full text-[#FF3B3B] text-sm font-medium backdrop-blur-sm">
              CardioSense AI
            </span>
          </motion.div>

          <motion.h1
            className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            Understand, Prevent &{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF3B3B] to-red-400">
              Predict
            </span>{' '}
            Heart Stroke Risk
          </motion.h1>

          <motion.p
            className="text-xl text-gray-400 mb-8 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            AI-powered early detection combined with medical awareness.
          </motion.p>

          <motion.button
            onClick={handleStartAnalysis}
            className="group relative px-8 py-4 bg-gradient-to-r from-[#FF3B3B] to-red-600 rounded-full font-semibold text-lg overflow-hidden shadow-lg shadow-[#FF3B3B]/50 hover:shadow-[#FF3B3B]/80 transition-all duration-300"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="relative z-10 flex items-center gap-2">
              Start Analysis
              <Heart className="w-5 h-5" />
            </span>
            <motion.div
              className="absolute inset-0 bg-white/20"
              initial={{ x: '-100%' }}
              whileHover={{ x: '100%' }}
              transition={{ duration: 0.5 }}
            />
          </motion.button>
        </motion.div>

        {/* Right: 3D Heart Animation */}
        <motion.div
          className="relative flex items-center justify-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          <AnimatedHeart />
        </motion.div>
      </div>
    </section>
  );
}

function AnimatedHeart() {
  return (
    <div className="relative w-80 h-80 flex items-center justify-center">
      {/* Glowing background */}
      <motion.div
        className="absolute inset-0 bg-[#FF3B3B]/30 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Heart Container */}
      <motion.div
        className="relative z-10"
        animate={{
          y: [0, -15, 0],
          rotateY: [0, 360],
        }}
        transition={{
          y: {
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          },
          rotateY: {
            duration: 10,
            repeat: Infinity,
            ease: "linear"
          }
        }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        <Heart 
          className="w-64 h-64 text-[#FF3B3B] fill-[#FF3B3B]"
          strokeWidth={1}
        />
      </motion.div>

      {/* Pulse rings */}
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="absolute inset-0 border-2 border-[#FF3B3B] rounded-full"
          initial={{ scale: 0.8, opacity: 0.8 }}
          animate={{
            scale: [0.8, 1.5],
            opacity: [0.8, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: i * 0.6,
            ease: "easeOut"
          }}
        />
      ))}

      {/* Orbiting particles */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-[#FF3B3B] rounded-full"
          style={{
            top: '50%',
            left: '50%',
          }}
          animate={{
            x: Math.cos((i / 8) * Math.PI * 2) * 150,
            y: Math.sin((i / 8) * Math.PI * 2) * 150,
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            delay: (i / 8) * 3,
            ease: "linear"
          }}
        />
      ))}
    </div>
  );
}
