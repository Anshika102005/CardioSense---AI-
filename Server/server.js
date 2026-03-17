const express = require("express");
const axios = require("axios");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

// Get the directory where server.js is located for database path
const serverDir = __dirname;
const dbPath = path.join(serverDir, "database.db");

console.log(`[INFO] Database path: ${dbPath}`);

// Initialize database connection
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error("[ERROR] Failed to connect to database:", err.message);
        process.exit(1);
    }
    console.log("[INFO] Connected to SQLite database successfully");
});

// Create predictions table with proper error handling
db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS predictions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            email TEXT,
            age INTEGER,
            prediction INTEGER,
            probability REAL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `, (err) => {
        if (err) {
            console.error("[ERROR] Failed to create table:", err.message);
        } else {
            console.log("[INFO] Predictions table ready");
        }
    });
});
const ML_API_URL = "https://cardiosense-ml.onrender.com/predict";
const ML_API_TIMEOUT = 30000; // 30 seconds timeout

// Health check for ML API
async function checkMLApiHealth() {
    try {
        const response = await axios.get(
            "http://127.0.0.1:8000/health",
            { timeout: ML_API_TIMEOUT }
        );

        console.log("[INFO] ML API health check:", response.data);
        return response.data.status === "healthy";

    } catch (error) {
        console.error("[ERROR] ML API health check failed:", error.message);
        return false;
    }
}



// Validate incoming request body
function validateRequestBody(body) {
    const requiredFields = ['name', 'email', 'age'];
    const missingFields = requiredFields.filter(field => !body[field]);
    
    if (missingFields.length > 0) {
        return { valid: false, error: `Missing required fields: ${missingFields.join(', ')}` };
    }
    
    // Validate age is a number
    if (isNaN(Number(body.age))) {
        return { valid: false, error: 'Age must be a number' };
    }
    
    return { valid: true };
}

// POST /analyze endpoint
app.post("/analyze", async (req, res) => {
    console.log("\n[INFO] ===== New Analysis Request =====");
    console.log("[DEBUG] Request body:", JSON.stringify(req.body, null, 2));
    
    try {
        // Step 1: Validate request body
        const validation = validateRequestBody(req.body);
        if (!validation.valid) {
            console.warn("[WARN] Validation failed:", validation.error);
            return res.status(400).json({ error: validation.error });
        }
        
        const userData = req.body;
        console.log("[INFO] Validated user data - name:", userData.name, ", email:", userData.email, ", age:", userData.age);
        
        // Step 2: Check ML API health
        console.log("[INFO] Checking ML API availability...");
        const mlApiHealthy = await checkMLApiHealth();
        
        if (!mlApiHealthy) {
            console.error("[ERROR] ML API is not available");
            return res.status(503).json({ error: "ML service is currently unavailable. Please try again later." });
        }
        console.log("[INFO] ML API is healthy");
        
        // Step 3: Send data to ML API
        console.log("[INFO] Sending data to ML API:", ML_API_URL);
        const mlResponse = await axios.post(ML_API_URL, userData, {
            timeout: ML_API_TIMEOUT
        });
        
        console.log("[DEBUG] ML API response:", JSON.stringify(mlResponse.data, null, 2));
        
        // Extract prediction and probability from ML response
        const prediction = mlResponse.data.prediction;
        const probability = mlResponse.data.probability;
        
        console.log("[INFO] Prediction received:", prediction, "| Probability:", probability);
        
        // Step 4: Store prediction in database
        console.log("[INFO] Storing prediction in database...");
        
        // Use Promise wrapper for database operations
        const insertPrediction = () => {
            return new Promise((resolve, reject) => {
                db.run(
                    `INSERT INTO predictions (name, email, age, prediction, probability) 
                     VALUES (?, ?, ?, ?, ?)`,
                    [userData.name, userData.email, userData.age, prediction, probability],
                    function(err) {
                        if (err) {
                            console.error("[ERROR] Database insert error:", err.message);
                            reject(err);
                        } else {
                            console.log("[INFO] Data saved to database with ID:", this.lastID);
                            resolve(this.lastID);
                        }
                    }
                );
            });
        };
        
        await insertPrediction();
        
        // Step 5: Send success response
        console.log("[INFO] Analysis completed successfully");
        console.log("[INFO] ===== Request Complete =====\n");
        
        res.json({ 
            success: true, 
            prediction: prediction,
            probability: probability 
        });
        
    } catch (error) {
        console.error("\n[ERROR] ===== Request Failed =====");
        
        if (error.code === 'ECONNABORTED') {
            console.error("[ERROR] ML API request timed out");
            return res.status(504).json({ error: "ML service request timed out. Please try again." });
        }
        
        if (error.response) {
            // ML API returned an error response
            console.error("[ERROR] ML API error:", error.response.status, error.response.data);
            return res.status(error.response.status).json({ 
                error: "ML service error", 
                details: error.response.data 
            });
        }
        
        if (error.request) {
            // No response received from ML API
            console.error("[ERROR] No response from ML API:", error.message);
            return res.status(503).json({ error: "Failed to connect to ML service" });
        }
        
        // Other errors
        console.error("[ERROR] Server error:", error.message);
        console.error("[ERROR] Stack:", error.stack);
        return res.status(500).json({ error: "Internal server error" });
    }
});

// POST /predict endpoint - Direct prediction from Client
app.post("/predict", async (req, res) => {
    console.log("\n[INFO] ===== New Prediction Request =====");
    console.log("[DEBUG] Request body:", JSON.stringify(req.body, null, 2));
    
    try {
        // Step 1: Validate request body has required medical data
        const requiredFields = ['age', 'gender', 'chestPainType', 'restingBP', 'cholesterol', 'fastingBS', 'restingECG', 'maxHeartRate', 'exerciseAngina', 'oldpeak', 'stSlope'];
        const missingFields = requiredFields.filter(field => !req.body[field]);
        
        if (missingFields.length > 0) {
            console.warn("[WARN] Missing required fields:", missingFields.join(', '));
            return res.status(400).json({ error: `Missing required fields: ${missingFields.join(', ')}` });
        }
        
        const medicalData = req.body;
        
        // Step 2: Check ML API health
        console.log("[INFO] Checking ML API availability...");
        const mlApiHealthy = await checkMLApiHealth();
        
        if (!mlApiHealthy) {
            console.error("[ERROR] ML API is not available");
            return res.status(503).json({ error: "ML service is currently unavailable. Please try again later." });
        }
        console.log("[INFO] ML API is healthy");
        
        // Step 3: Send data to ML API
        console.log("[INFO] Sending data to ML API:", ML_API_URL);
        const mlResponse = await axios.post(ML_API_URL, medicalData, {
            timeout: ML_API_TIMEOUT
        });
        
        console.log("[DEBUG] ML API response:", JSON.stringify(mlResponse.data, null, 2));
        
        // Extract prediction and probability from ML response
        const prediction = mlResponse.data.prediction;
        const probability = mlResponse.data.probability;
        
        console.log("[INFO] Prediction received:", prediction, "| Probability:", probability);
        
        // Step 4: Send success response
        console.log("[INFO] Prediction completed successfully");
        console.log("[INFO] ===== Request Complete =====\n");
        
        res.json({ 
            success: true, 
            prediction: prediction,
            probability: probability 
        });
        
    } catch (error) {
        console.error("\n[ERROR] ===== Prediction Request Failed =====");
        
        if (error.code === 'ECONNABORTED') {
            console.error("[ERROR] ML API request timed out");
            return res.status(504).json({ error: "ML service request timed out. Please try again." });
        }
        
        if (error.response) {
            // ML API returned an error response
            console.error("[ERROR] ML API error:", error.response.status, error.response.data);
            return res.status(error.response.status).json({ 
                error: "ML service error", 
                details: error.response.data 
            });
        }
        
        if (error.request) {
            // No response received from ML API
            console.error("[ERROR] No response from ML API:", error.message);
            return res.status(503).json({ error: "Failed to connect to ML service" });
        }
        
        // Other errors
        console.error("[ERROR] Server error:", error.message);
        console.error("[ERROR] Stack:", error.stack);
        return res.status(500).json({ error: "Internal server error" });
    }
});

// Health check endpoint for the server itself
app.get("/health", (req, res) => {
    // Check database connection
    db.get("SELECT 1 as test", [], (err) => {
        if (err) {
            return res.status(500).json({ 
                status: "unhealthy", 
                database: "disconnected",
                error: err.message 
            });
        }
        
        res.json({ 
            status: "healthy", 
            database: "connected",
            timestamp: new Date().toISOString()
        });
    });
});

// Get all predictions (useful for debugging/admin)
app.get("/predictions", (req, res) => {
    console.log("[INFO] Fetching all predictions");
    
    db.all("SELECT * FROM predictions ORDER BY created_at DESC", [], (err, rows) => {
        if (err) {
            console.error("[ERROR] Failed to fetch predictions:", err.message);
            return res.status(500).json({ error: "Failed to fetch predictions" });
        }
        
        console.log("[INFO] Found", rows.length, "predictions");
        res.json({ predictions: rows });
    });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`\n[INFO] ════════════════════════════════`);
    console.log(`[INFO] Server running on port ${PORT}`);
    console.log(`[INFO] ML API: ${ML_API_URL}`);
    console.log(`[INFO] Database: ${dbPath}`);
    console.log(`[INFO] ════════════════════════════════\n`);
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log("\n[INFO] Shutting down gracefully...");
    db.close((err) => {
        if (err) {
            console.error("[ERROR] Error closing database:", err.message);
        } else {
            console.log("[INFO] Database connection closed");
        }
        process.exit(0);
    });
});

module.exports = app;
