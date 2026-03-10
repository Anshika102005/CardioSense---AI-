import { motion } from "motion/react";
import { useInView } from "motion/react";
import { useRef, useState } from "react";
import { Activity, Heart } from "lucide-react";
import type { MedicalData } from "../App";

interface MedicalFormProps {
  onSubmit: (data: any) => void;
  userName: string;
}

export function MedicalForm({ onSubmit, userName }: MedicalFormProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    age: 50,
    gender: "",
    chestPainType: "",
    restingBP: " ",
    cholesterol: " ",
    fastingBS: "",
    restingECG: "",
    maxHeartRate: 150,
    exerciseAngina: "",
    oldpeak: 1.0,
    stSlope: "",
  });

  const updateField = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.gender ||
      !formData.chestPainType ||
      !formData.fastingBS ||
      !formData.restingECG ||
      !formData.exerciseAngina ||
      !formData.stSlope
    ) {
      alert("Please fill all required fields");
      return;
    }

    setIsLoading(true);

    await onSubmit(formData);

    setIsLoading(false);
  };

  return (
    <section ref={ref} className="relative py-24 px-4 scroll-mt-20">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <h2 className="text-4xl font-bold mb-4">
            Heart <span className="text-red-500">Risk Analysis</span>
          </h2>
          <p className="text-gray-400">
            Hi {userName}, please enter your medical information
          </p>
        </motion.div>

        <form
          onSubmit={handleSubmit}
          className="p-8 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10"
        >
          <div className="space-y-6">

            {/* Age */}
            <div>
              <label className="block text-sm mb-2">
                Age: {formData.age}
              </label>
              <input
                type="range"
                min="20"
                max="100"
                value={formData.age}
                onChange={(e) =>
                  updateField("age", parseInt(e.target.value))
                }
                className="w-full"
              />
            </div>

            {/* Gender */}
            <div>
              <label className="block text-sm mb-2">Gender *</label>
              <select
                value={formData.gender}
                onChange={(e) =>
                  updateField("gender", e.target.value)
                }
                className="w-full p-3 rounded bg-black/40"
              >
                <option value="">Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>

            {/* Chest Pain */}
            <div>
              <label className="block text-sm mb-2">
                Chest Pain Type *
              </label>
              <select
                value={formData.chestPainType}
                onChange={(e) =>
                  updateField("chestPainType", e.target.value)
                }
                className="w-full p-3 rounded bg-black/40"
              >
                <option value="">Select</option>
                <option value="Typical Angina">Typical Angina</option>
                <option value="Atypical Angina">Atypical Angina</option>
                <option value="Non-Anginal Pain">Non-Anginal Pain</option>
                <option value="Asymptomatic">Asymptomatic</option>
              </select>
            </div>

            {/* Resting BP */}
            <input
              type="number"
              placeholder="Resting Blood Pressure"
              value={formData.restingBP}
              onChange={(e) =>
                updateField("restingBP", parseInt(e.target.value))
              }
              className="w-full p-3 rounded bg-black/40"
            />

            {/* Cholesterol */}
            <input
              type="number"
              placeholder="Cholesterol"
              value={formData.cholesterol}
              onChange={(e) =>
                updateField("cholesterol", parseInt(e.target.value))
              }
              className="w-full p-3 rounded bg-black/40"
            />

            {/* Fasting BS */}
            <select
              value={formData.fastingBS}
              onChange={(e) =>
                updateField("fastingBS", e.target.value)
              }
              className="w-full p-3 rounded bg-black/40"
            >
              <option value="">Fasting BS &gt;120 *</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>

            {/* Rest ECG */}
            <select
              value={formData.restingECG}
              onChange={(e) =>
                updateField("restingECG", e.target.value)
              }
              className="w-full p-3 rounded bg-black/40"
            >
              <option value="">Rest ECG *</option>
              <option value="Normal">Normal</option>
              <option value="ST-T Wave Abnormality">
                ST-T Wave Abnormality
              </option>
              <option value="Left Ventricular Hypertrophy">
                Left Ventricular Hypertrophy
              </option>
            </select>

            {/* Max HR */}
            <div>
              <label>Max Heart Rate: {formData.maxHeartRate}</label>
              <input
                type="range"
                min="60"
                max="220"
                value={formData.maxHeartRate}
                onChange={(e) =>
                  updateField(
                    "maxHeartRate",
                    parseInt(e.target.value)
                  )
                }
                className="w-full"
              />
            </div>

            {/* Exercise Angina */}
            <select
              value={formData.exerciseAngina}
              onChange={(e) =>
                updateField("exerciseAngina", e.target.value)
              }
              className="w-full p-3 rounded bg-black/40"
            >
              <option value="">Exercise Angina *</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>

            {/* Oldpeak */}
            <div>
              <label>Oldpeak: {formData.oldpeak}</label>
              <input
                type="range"
                min="0"
                max="6"
                step="0.1"
                value={formData.oldpeak}
                onChange={(e) =>
                  updateField(
                    "oldpeak",
                    parseFloat(e.target.value)
                  )
                }
                className="w-full"
              />
            </div>

            {/* ST Slope */}
            <select
              value={formData.stSlope}
              onChange={(e) =>
                updateField("stSlope", e.target.value)
              }
              className="w-full p-3 rounded bg-black/40"
            >
              <option value="">ST Slope *</option>
              <option value="Upsloping">Upsloping</option>
              <option value="Flat">Flat</option>
              <option value="Downsloping">Downsloping</option>
            </select>

            {/* Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-red-600 rounded-xl font-semibold flex justify-center items-center gap-2"
            >
              {isLoading ? "Analyzing..." : "Predict Risk"}
            </button>

          </div>
        </form>
      </div>
    </section>
  );
}
