import { motion } from 'motion/react';
import { useInView } from 'motion/react';
import { useRef } from 'react';
import { Activity, Cigarette, Droplet, Scale, TrendingUp, Zap } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

const causes = [
  {
    icon: TrendingUp,
    title: 'High Blood Pressure',
    description: 'Hypertension damages artery walls, leading to plaque buildup and increased stroke risk.'
  },
  {
    icon: Cigarette,
    title: 'Smoking',
    description: 'Tobacco smoke damages blood vessels, increases clotting, and reduces oxygen in blood.'
  },
  {
    icon: Droplet,
    title: 'Diabetes',
    description: 'High blood sugar levels damage blood vessels and nerves that control the heart.'
  },
  {
    icon: Activity,
    title: 'High Cholesterol',
    description: 'Excess LDL cholesterol forms plaques in arteries, restricting blood flow to the heart.'
  },
  {
    icon: Scale,
    title: 'Obesity',
    description: 'Excess weight strains the heart and contributes to high blood pressure and diabetes.'
  },
  {
    icon: Zap,
    title: 'Chronic Stress',
    description: 'Prolonged stress increases blood pressure and inflammation, damaging the cardiovascular system.'
  }
];

export function CausesSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="relative py-24 px-4 bg-gradient-to-b from-transparent via-[#FF3B3B]/5 to-transparent">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Major <span className="text-[#FF3B3B]">Risk Factors</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Understanding the primary causes can help you take preventive action
          </p>
        </motion.div>

        {/* Causes Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {causes.map((cause, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="group relative"
            >
              {/* Glassmorphism Card */}
              <div className="relative h-full p-6 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 hover:border-[#FF3B3B]/50 transition-all duration-300 overflow-hidden">
                {/* Glow effect on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#FF3B3B]/0 to-[#FF3B3B]/0 group-hover:from-[#FF3B3B]/10 group-hover:to-transparent transition-all duration-300" />
                
                <div className="relative z-10">
                  <div className="w-12 h-12 mb-4 rounded-lg bg-[#FF3B3B]/10 flex items-center justify-center border border-[#FF3B3B]/30 group-hover:bg-[#FF3B3B]/20 transition-colors">
                    <cause.icon className="w-6 h-6 text-[#FF3B3B]" />
                  </div>
                  
                  <h3 className="text-xl font-semibold mb-2 text-white">
                    {cause.title}
                  </h3>
                  
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {cause.description}
                  </p>
                </div>

                {/* Animated border */}
                <motion.div
                  className="absolute inset-0 rounded-2xl border-2 border-[#FF3B3B] opacity-0 group-hover:opacity-100"
                  initial={{ scale: 0.95 }}
                  whileHover={{ scale: 1 }}
                  transition={{ duration: 0.3 }}
                  style={{ pointerEvents: 'none' }}
                />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Medical Illustration */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="relative max-w-4xl mx-auto"
        >
          <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-[#FF3B3B]/20 backdrop-blur-sm bg-white/5">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1715111183948-ee02f78b9175?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcnRlcnklMjBibG9ja2FnZSUyMGNob2xlc3Rlcm9sJTIwbWVkaWNhbCUyMGRpYWdyYW18ZW58MXx8fHwxNzcxMzE3MzI5fDA&ixlib=rb-4.1.0&q=80&w=1080"
              alt="Artery blockage medical diagram"
              className="w-full h-96 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B1220] via-transparent to-transparent" />
            
            <div className="absolute bottom-6 left-6 right-6">
              <p className="text-sm text-gray-300 backdrop-blur-md bg-black/50 p-4 rounded-lg border border-white/10">
                <strong className="text-[#FF3B3B]">Visualization:</strong> Arterial plaque buildup restricts blood flow, 
                increasing the risk of heart attack and stroke. Regular screening can detect early warning signs.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
