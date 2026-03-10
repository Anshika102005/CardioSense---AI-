import { motion } from 'motion/react';
import { useInView } from 'motion/react';
import { useRef, useState } from 'react';
import { User, Mail, ArrowRight } from 'lucide-react';
import type { UserData } from '../App';

interface UserIdentityFormProps {
  onSubmit: (data: UserData) => void;
}

export function UserIdentityForm({ onSubmit }: UserIdentityFormProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState({ name: '', email: '' });

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors = { name: '', email: '' };
    
    if (!name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    setErrors(newErrors);
    
    if (!newErrors.name && !newErrors.email) {
      onSubmit({ name: name.trim(), email: email.trim() });
    }
  };

  return (
    <section id="user-identity" ref={ref} className="relative py-24 px-4 scroll-mt-20">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Begin Your <span className="text-[#FF3B3B]">Health Journey</span>
          </h2>
          <p className="text-gray-400 text-lg">
            Tell us a bit about yourself before we start the analysis
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <form onSubmit={handleSubmit} className="relative p-8 md:p-12 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 shadow-2xl">
            {/* Decorative glow */}
            <div className="absolute -inset-1 bg-gradient-to-r from-[#FF3B3B]/20 to-red-500/20 rounded-2xl blur-xl opacity-50" />
            
            <div className="relative z-10 space-y-6">
              {/* Name Input */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-2 text-gray-300">
                  Full Name <span className="text-[#FF3B3B]">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      setErrors(prev => ({ ...prev, name: '' }));
                    }}
                    placeholder="Enter your full name"
                    className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#FF3B3B] focus:ring-2 focus:ring-[#FF3B3B]/20 transition-all"
                  />
                </div>
                {errors.name && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-2 text-sm text-red-400"
                  >
                    {errors.name}
                  </motion.p>
                )}
              </div>

              {/* Email Input */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2 text-gray-300">
                  Email Address <span className="text-[#FF3B3B]">*</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setErrors(prev => ({ ...prev, email: '' }));
                    }}
                    placeholder="your.email@example.com"
                    className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#FF3B3B] focus:ring-2 focus:ring-[#FF3B3B]/20 transition-all"
                  />
                </div>
                {errors.email && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-2 text-sm text-red-400"
                  >
                    {errors.email}
                  </motion.p>
                )}
              </div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                className="w-full py-4 bg-gradient-to-r from-[#FF3B3B] to-red-600 rounded-xl font-semibold text-lg flex items-center justify-center gap-2 shadow-lg shadow-[#FF3B3B]/50 hover:shadow-[#FF3B3B]/80 transition-all duration-300"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Continue to Analysis
                <ArrowRight className="w-5 h-5" />
              </motion.button>

              <p className="text-center text-xs text-gray-500 mt-4">
                Your information is kept private and secure. We do not share your data with third parties.
              </p>
            </div>
          </form>
        </motion.div>
      </div>
    </section>
  );
}
