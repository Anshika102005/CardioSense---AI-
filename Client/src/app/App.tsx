import { useState, useRef } from "react";
import { motion } from "motion/react";
import { Hero } from "./components/Hero";
import { HeartStrokeInfo } from "./components/HeartStrokeInfo";
import { CausesSection } from "./components/CausesSection";
import { PreventionSection } from "./components/PreventionSection";
import { UserIdentityForm } from "./components/UserIdentityForm";
import { MedicalForm } from "./components/MedicalForm";
import { ResultSection } from "./components/ResultSection";
import { ECGBackground } from "./components/ECGBackground";

export interface UserData {
  name: string;
  email: string;
}

export interface MedicalData {
  name: string;
  email: string;
  age: number;
  gender: string;
  chestPainType: string;
  restingBP: number;
  cholesterol: number;
  fastingBS: string;
  restingECG: string;
  maxHeartRate: number;
  exerciseAngina: string;
  oldpeak: number;
  stSlope: string;
}

export interface PredictionResult {
  riskPercentage: number;
  riskLevel: "Low" | "Medium" | "High";
  precautions: string[];
}

// Use relative URL for proxy - Vite will forward to backend server
const API_URL = "http://127.0.0.1:5000";
export default function App() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [predictionResult, setPredictionResult] =
    useState<PredictionResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const medicalFormRef = useRef<HTMLDivElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  const handleUserSubmit = (data: UserData) => {
    setUserData(data);
    setTimeout(() => {
      medicalFormRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100);
  };

  const handleMedicalSubmit = async (data: MedicalData) => {
    setError(null);
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/predict`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Backend server not responding.");
      }

      const result = await response.json();
      console.log("ML Response:", result);

      if (result.error) {
        throw new Error(result.error);
      }

      // SAFE probability handling
      const probability = result.probability ?? 0;
      const riskPercentage = Math.round(probability * 100);

      let riskLevel: "Low" | "Medium" | "High";
      let precautions: string[];

      if (riskPercentage < 30) {
        riskLevel = "Low";
        precautions = [
          "Maintain a balanced diet",
          "Exercise 30 minutes daily",
          "Monitor BP & cholesterol yearly",
          "Avoid smoking",
          "Manage stress properly",
        ];
      } else if (riskPercentage < 60) {
        riskLevel = "Medium";
        precautions = [
          "Consult a cardiologist",
          "Adopt heart-healthy diet",
          "Monitor BP every 3-6 months",
          "Quit smoking",
          "Maintain healthy weight",
        ];
      } else {
        riskLevel = "High";
        precautions = [
          "⚠️ URGENT: Visit cardiologist immediately",
          "Follow medications strictly",
          "Daily BP monitoring",
          "Avoid heavy physical stress",
          "Get ECG / Echo tests",
        ];
      }

      setPredictionResult({
        riskPercentage,
        riskLevel,
        precautions,
      });

      setTimeout(() => {
        resultRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 100);
    } catch (err: any) {
      console.error("Prediction Error:", err);
      
      // Parse error message from server response
      let errorMessage = "Backend server not responding. Please ensure both servers are running.";
      
      if (err.response) {
        // Server responded with an error
        const serverError = err.response.data?.error;
        const serverDetails = err.response.data?.details;
        
        if (serverError) {
          if (serverError.includes("ML service") || serverError.includes("unavailable")) {
            errorMessage = "ML service is not running. Please start the Flask ML service on port 8000.";
          } else if (serverError.includes("database")) {
            errorMessage = "Database error. Please check the server logs.";
          } else {
            errorMessage = serverError + (serverDetails ? `: ${JSON.stringify(serverDetails)}` : "");
          }
        } else {
          errorMessage = `Server error: ${err.response.status} ${err.response.statusText}`;
        }
      } else if (err.message) {
        if (err.message.includes("Failed to fetch") || err.message.includes("Network")) {
          errorMessage = "Cannot connect to backend server. Please ensure both the Express server (port 5000) and ML service (port 8000) are running.";
        } else {
          errorMessage = err.message;
        }
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#0B1220] text-white overflow-x-hidden">
      <ECGBackground />

      <motion.div
        className="fixed top-8 right-8 z-50 text-right"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <p className="text-sm text-gray-400">Made by</p>
        <p className="text-lg font-semibold text-[#FF3B3B]">
          Anshika Sahu
        </p>
      </motion.div>

      <Hero />
      <HeartStrokeInfo />
      <CausesSection />
      <PreventionSection />

      {!userData && <UserIdentityForm onSubmit={handleUserSubmit} />}

      {userData && !predictionResult && (
        <div ref={medicalFormRef}>
          <MedicalForm
            onSubmit={handleMedicalSubmit}
            userName={userData.name}
          />
          {loading && (
            <p className="text-center mt-4 text-blue-400">
              Analyzing your health data...
            </p>
          )}
          {error && (
            <p className="text-center mt-4 text-red-500">{error}</p>
          )}
        </div>
      )}

      {predictionResult && userData && (
        <div ref={resultRef}>
          <ResultSection
            result={predictionResult}
            userName={userData.name}
            onNewAnalysis={() => {
              setPredictionResult(null);
              setUserData(null);
              setError(null);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          />
        </div>
      )}

      <footer className="relative z-10 py-8 text-center border-t border-white/10">
        <p className="text-gray-500 text-sm">
          © 2026 CardioSense AI. For educational purposes only.
        </p>
      </footer>
    </div>
  );
}