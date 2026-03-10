import { motion } from 'motion/react';
import { useInView } from 'motion/react';
import { useRef, useEffect, useState } from 'react';
import { AlertCircle, CheckCircle, AlertTriangle, RefreshCw, Shield } from 'lucide-react';
import type { PredictionResult } from '../App';

interface ResultSectionProps {
  result: PredictionResult;
  userName: string;
  onNewAnalysis: () => void;
}

export function ResultSection({ result, userName, onNewAnalysis }: ResultSectionProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [displayPercentage, setDisplayPercentage] = useState(0);

  useEffect(() => {
    if (isInView) {
      const duration = 2000;
      const steps = 60;
      const increment = result.riskPercentage / steps;
      let current = 0;

      const timer = setInterval(() => {
        current += increment;
        if (current >= result.riskPercentage) {
          setDisplayPercentage(result.riskPercentage);
          clearInterval(timer);
        } else {
          setDisplayPercentage(Math.round(current));
        }
      }, duration / steps);

      return () => clearInterval(timer);
    }
  }, [isInView, result.riskPercentage]);

  const getRiskColor = () => {
    switch (result.riskLevel) {
      case 'Low': return '#22C55E';
      case 'Medium': return '#F59E0B';
      case 'High': return '#FF3B3B';
    }
  };

  const getRiskIcon = () => {
    switch (result.riskLevel) {
      case 'Low': return CheckCircle;
      case 'Medium': return AlertTriangle;
      case 'High': return AlertCircle;
    }
  };

  const RiskIcon = getRiskIcon();

  return (
    <section ref={ref} className="relative py-24 px-4 scroll-mt-20">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Hello, <span className="text-[#FF3B3B]">{userName}</span>
          </h2>
          <p className="text-gray-400 text-lg">
            Your heart stroke risk analysis is complete
          </p>
        </motion.div>

        {/* Main Result Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="relative p-8 md:p-12 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 shadow-2xl mb-12"
        >
          {/* Decorative glow */}
          <div 
            className="absolute -inset-1 rounded-2xl blur-xl opacity-50"
            style={{ background: `radial-gradient(circle, ${getRiskColor()}40, transparent)` }}
          />
          
          <div className="relative z-10">
            <div className="grid md:grid-cols-2 gap-12 items-center mb-8">
              {/* Circular Gauge */}
              <div className="flex justify-center">
                <CircularGauge percentage={displayPercentage} color={getRiskColor()} />
              </div>

              {/* Risk Details */}
              <div className="text-center md:text-left space-y-6">
                <div>
                  <p className="text-gray-400 text-sm mb-2">Risk Assessment</p>
                  <div className="flex items-center gap-3 justify-center md:justify-start">
                    <RiskIcon 
                      className="w-8 h-8" 
                      style={{ color: getRiskColor() }}
                    />
                    <h3 
                      className="text-4xl font-bold"
                      style={{ color: getRiskColor() }}
                    >
                      {result.riskLevel} Risk
                    </h3>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <p className="text-sm text-gray-400 mb-1">Risk Score</p>
                  <p className="text-3xl font-bold" style={{ color: getRiskColor() }}>
                    {displayPercentage}%
                  </p>
                </div>

                {result.riskLevel === 'High' && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 }}
                    className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl"
                  >
                    <p className="text-red-400 text-sm font-medium flex items-center gap-2">
                      <AlertCircle className="w-5 h-5" />
                      Immediate medical attention recommended
                    </p>
                  </motion.div>
                )}
              </div>
            </div>

            {/* Precautions Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="border-t border-white/10 pt-8"
            >
              <div className="flex items-center gap-2 mb-6">
                <Shield className="w-6 h-6 text-[#FF3B3B]" />
                <h4 className="text-2xl font-bold">Recommended Precautions</h4>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {result.precautions.map((precaution, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: 0.7 + index * 0.1, duration: 0.4 }}
                    className="flex items-start gap-3 p-4 rounded-xl bg-white/5 border border-white/10 hover:border-[#FF3B3B]/30 transition-colors"
                  >
                    <div 
                      className="w-2 h-2 rounded-full mt-2 flex-shrink-0"
                      style={{ backgroundColor: getRiskColor() }}
                    />
                    <p className="text-sm text-gray-300 leading-relaxed">
                      {precaution}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Medical Disclaimer */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 1, duration: 0.6 }}
              className="mt-8 p-6 rounded-xl bg-yellow-500/10 border border-yellow-500/30"
            >
              <p className="text-sm text-yellow-200 leading-relaxed">
                <strong className="text-yellow-400">⚕️ Medical Disclaimer:</strong> This AI-powered analysis is for educational and informational purposes only. It is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition. Never disregard professional medical advice or delay in seeking it because of this analysis.
              </p>
            </motion.div>

            {/* New Analysis Button */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 1.2 }}
              className="mt-8 text-center"
            >
              <motion.button
                onClick={onNewAnalysis}
                className="px-8 py-4 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl font-semibold flex items-center gap-2 mx-auto transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <RefreshCw className="w-5 h-5" />
                Start New Analysis
              </motion.button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function CircularGauge({ percentage, color }: { percentage: number; color: string }) {
  const radius = 120;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative w-80 h-80">
      <svg className="w-full h-full transform -rotate-90">
        {/* Background circle */}
        <circle
          cx="160"
          cy="160"
          r={radius}
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="20"
          fill="none"
        />
        
        {/* Progress circle */}
        <motion.circle
          cx="160"
          cy="160"
          r={radius}
          stroke={color}
          strokeWidth="20"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 2, ease: "easeOut" }}
          style={{
            filter: `drop-shadow(0 0 10px ${color})`
          }}
        />
      </svg>

      {/* Center text */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
          >
            <p className="text-6xl font-bold" style={{ color }}>
              {percentage}
            </p>
            <p className="text-2xl text-gray-400">%</p>
          </motion.div>
        </div>
      </div>

      {/* Pulse effect */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{ 
          border: `2px solid ${color}`,
          opacity: 0.3
        }}
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.3, 0, 0.3]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </div>
  );
}
