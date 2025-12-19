require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { spawn } = require('child_process');
const Product = require('./models/Product');

const app = express();
app.use(express.json());
app.use(cors()); // Allow Frontend access

// Connect to MongoDB (fashfolio_db)
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ Connected to FashFolio DB'))
    .catch(err => console.log(err));

// --- ROUTES ---

// 1. GET ALL Products
app.get('/api/products', async (req, res) => {
    try {
        const products = await Product.find().sort({ createdAt: -1 });
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 2. ADD Product
app.post('/api/products', async (req, res) => {
    try {
        const newProduct = new Product(req.body);
        await newProduct.save();
        res.json(newProduct);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 3. AI TREND ANALYSIS
app.get('/api/analyze-trends', async (req, res) => {
    try {
        const products = await Product.find();
        // Use 'python3' for Linux compatibility, falling back to 'python' if needed or configured via env
        const pythonCommand = process.env.PYTHON_COMMAND || 'python';
        const pythonProcess = spawn(pythonCommand, ['./ai_trend.py']);

        let dataString = '';
        let errorString = '';

        pythonProcess.stdin.write(JSON.stringify(products));
        pythonProcess.stdin.end();

        pythonProcess.stdout.on('data', (data) => {
            dataString += data.toString();
        });

        pythonProcess.stderr.on('data', (data) => {
            errorString += data.toString();
            // Log plain errors but don't crash response yet, wait for close
            console.error("Python Error:", data.toString());
        });

        pythonProcess.on('close', (code) => {
            if (code !== 0) {
                return res.status(500).json({ error: "AI Processing Failed", details: errorString });
            }
            try {
                const results = JSON.parse(dataString);
                res.json(results);
            } catch (e) {
                res.status(500).json({ error: "AI Parsing Failed", details: e.message });
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`FashFolio Server running on port ${PORT}`));
