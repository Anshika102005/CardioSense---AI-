import { motion } from 'motion/react';
import { useInView } from 'motion/react';
import { useRef } from 'react';
import { Apple, Activity, CigaretteOff, Heart, Stethoscope, CheckCircle } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

const preventionMeasures = [
  {
    icon: Apple,
    title: 'Heart-Healthy Diet',
    description: 'Consume a balanced diet rich in fruits, vegetables, whole grains, lean proteins, and healthy fats. Limit sodium, saturated fats, trans fats, and added sugars. Focus on foods that support cardiovascular health.'
  },
  {
    icon: Activity,
    title: 'Regular Physical Exercise',
    description: 'Engage in at least 150 minutes of moderate-intensity aerobic activity or 75 minutes of vigorous activity weekly. Include strength training exercises twice a week to improve heart function and circulation.'
  },
  {
    icon: CigaretteOff,
    title: 'Avoid Smoking & Alcohol',
    description: 'Quit smoking immediately and avoid secondhand smoke exposure. Limit alcohol consumption to moderate levels. Both smoking and excessive drinking significantly increase cardiovascular disease risk.'
  },
  {
    icon: Heart,
    title: 'Stress Management',
    description: 'Practice stress-reduction techniques such as meditation, yoga, deep breathing exercises, and mindfulness. Maintain work-life balance and ensure adequate sleep (7-9 hours) to reduce cortisol levels.'
  },
  {
    icon: Stethoscope,
    title: 'Regular Health Checkups',
    description: 'Schedule routine medical examinations to monitor blood pressure, cholesterol levels, blood sugar, and overall cardiovascular health. Early detection allows for timely intervention and lifestyle modifications.'
  }
];

export function PreventionSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="relative py-24 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-[#FF3B3B]">Prevention</span> is Better Than Cure
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Take proactive steps to protect your heart and reduce stroke risk
          </p>
        </motion.div>

        {/* Prevention Measures */}
        <div className="space-y-6 mb-16">
          {preventionMeasures.map((measure, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -30 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              className="group"
            >
              <div className="relative p-6 md:p-8 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 hover:border-[#FF3B3B]/50 transition-all duration-300 overflow-hidden">
                {/* Background glow */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#FF3B3B]/0 via-[#FF3B3B]/5 to-[#FF3B3B]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="relative z-10 flex flex-col md:flex-row gap-6 items-start">
                  {/* Icon */}
                  <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-[#FF3B3B]/10 flex items-center justify-center border border-[#FF3B3B]/30 group-hover:bg-[#FF3B3B]/20 transition-colors">
                    <measure.icon className="w-7 h-7 text-[#FF3B3B]" />
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-2xl font-semibold text-white">
                        {measure.title}
                      </h3>
                      <CheckCircle className="w-5 h-5 text-green-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <p className="text-gray-400 leading-relaxed">
                      {measure.description}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Healthcare Lifestyle Illustration */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="relative max-w-5xl mx-auto"
        >
          <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-[#FF3B3B]/20 backdrop-blur-sm bg-white/5">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1752659985958-cb2bc9e5875e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWFsdGhjYXJlJTIwbGlmZXN0eWxlJTIwam9nZ2luZyUyMGV4ZXJjaXNlJTIwd2VsbmVzc3N8ZW58MXx8fHwxNzcxMzE3MzI5fDA&ixlib=rb-4.1.0&q=80&w=1080"
              alt="Healthcare lifestyle illustration"
              className="w-full h-[500px] object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B1220] via-transparent to-transparent" />
            
            <div className="absolute bottom-8 left-8 right-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 1 }}
                className="backdrop-blur-md bg-black/50 p-6 rounded-xl border border-white/10"
              >
                <p className="text-lg mb-2">
                  <strong className="text-[#FF3B3B]">Remember:</strong> Small lifestyle changes today can prevent major health complications tomorrow.
                </p>
                <p className="text-sm text-gray-300">
                  Consistency in healthy habits is key to long-term cardiovascular wellness.
                </p>
              </motion.div>
            </div>
          </div>

          {/* Decorative glow */}
          <div className="absolute -inset-4 bg-gradient-to-r from-[#FF3B3B]/20 via-transparent to-[#FF3B3B]/20 rounded-2xl blur-3xl -z-10" />
        </motion.div>
      </div>
    </section>
  );
}