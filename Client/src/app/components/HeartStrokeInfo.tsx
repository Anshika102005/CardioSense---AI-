import { motion } from 'motion/react';
import { useInView } from 'motion/react';
import { useRef } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';

export function HeartStrokeInfo() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="relative py-24 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="grid lg:grid-cols-2 gap-12 items-center"
        >
          {/* Left: Text Content */}
          <div>
            <motion.h2
              initial={{ opacity: 0, x: -30 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.2 }}
              className="text-4xl md:text-5xl font-bold mb-6"
            >
              What is a{' '}
              <span className="text-[#FF3B3B]">Heart Stroke</span>?
            </motion.h2>

            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.3 }}
              className="space-y-4 text-gray-300 leading-relaxed"
            >
              <p>
                A <strong className="text-white">heart stroke</strong>, also known as a <strong className="text-white">myocardial infarction</strong> or <strong className="text-white">heart attack</strong>, occurs when blood flow to a part of the heart muscle becomes blocked. This blockage is typically caused by a buildup of plaque—consisting of fat, cholesterol, and other substances—in the coronary arteries.
              </p>
              
              <p>
                When the heart muscle is deprived of oxygen-rich blood for an extended period, the affected tissue begins to die. This can lead to permanent damage to the heart muscle, significantly affecting the heart's ability to pump blood effectively throughout the body.
              </p>

              <div className="pl-4 border-l-4 border-[#FF3B3B] bg-[#FF3B3B]/5 p-4 rounded-r-lg backdrop-blur-sm">
                <p className="text-[#FF3B3B] font-semibold mb-2">
                  ⚠️ Critical Warning Signs:
                </p>
                <ul className="space-y-2 text-sm">
                  <li>• Chest pain or discomfort (pressure, squeezing, fullness)</li>
                  <li>• Pain radiating to arms, neck, jaw, or back</li>
                  <li>• Shortness of breath</li>
                  <li>• Cold sweats, nausea, or lightheadedness</li>
                </ul>
              </div>

              <p className="text-sm italic text-gray-400">
                Early detection and immediate medical attention can save lives. Every minute counts during a heart attack.
              </p>
            </motion.div>
          </div>

          {/* Right: Medical Illustration */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="relative"
          >
            <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-[#FF3B3B]/20 backdrop-blur-sm bg-white/5">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1715111965920-b6d4b4fc579f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRpY2FsJTIwaGVhcnQlMjBhbmF0b215JTIwaWxsdXN0cmF0aW9uJTIwYmxvY2tlZCUyMGFydGVyeXxlbnwxfHx8fDE3NzEzMTczMjl8MA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Medical heart anatomy illustration"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B1220] via-transparent to-transparent" />
            </div>

            {/* Decorative glow */}
            <div className="absolute -inset-4 bg-gradient-to-r from-[#FF3B3B]/20 to-transparent rounded-2xl blur-2xl -z-10" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
