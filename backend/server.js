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
        const pythonProcess = spawn(pythonCommand, ['./ai_trend.py'], {
            env: { ...process.env }
        });

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

        pythonProcess.on('close', async (code) => {
            if (code !== 0) {
                return res.status(500).json({ error: "AI Processing Failed", details: errorString });
            }
            try {
                const results = JSON.parse(dataString);

                // SAVE TO DATABASE
                for (const p of results) {
                    if (p.marketingBlurb || p.trendScore > 0) {
                        await Product.findByIdAndUpdate(p._id, {
                            trendScore: p.trendScore,
                            marketingBlurb: p.marketingBlurb
                        });
                    }
                }

                // Return the freshly updated list from DB
                const updatedProducts = await Product.find().sort({ createdAt: -1 });
                res.json(updatedProducts);
            } catch (e) {
                res.status(500).json({ error: "AI Parsing Failed", details: e.message });
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 4. AI USER SCORING (For Social Network)
app.post('/api/score-users', async (req, res) => {
    try {
        const users = req.body;
        // Use 'python3' for Linux compatibility
        const pythonCommand = process.env.PYTHON_COMMAND || 'python';
        const pythonProcess = spawn(pythonCommand, ['./ai_scoring.py']);

        let dataString = '';
        let errorString = '';

        pythonProcess.stdin.write(JSON.stringify(users));
        pythonProcess.stdin.end();

        pythonProcess.stdout.on('data', (data) => {
            dataString += data.toString();
        });

        pythonProcess.stderr.on('data', (data) => {
            errorString += data.toString();
            console.error("Python Error:", data.toString());
        });

        pythonProcess.on('close', (code) => {
            if (code !== 0) {
                return res.status(500).json({ error: "AI Scoring Failed", details: errorString });
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

// 5. SEYNA AGENT COMMAND CENTER
app.post('/api/seyna/command', async (req, res) => {
    const { goal } = req.body;
    // NOTE: PYTHONPATH needs to include the current directory so Python finds the 'agents' package
    // We use backend/agents/seyna.py assuming server.js is in backend/ and execution context implies finding it relative or absolute.
    // Given server.js is in backend/, agents/seyna.py is correct relative path.
    // PYTHONPATH needs to include backend/agents or just backend depending on imports.
    // Since seyna.py imports from vogue, ledger etc which are in the same folder, and we run seyna.py,
    // we should set PYTHONPATH to include the agents directory or run from within it.
    // Simpler: Set PYTHONPATH to ./agents so seyna.py can find its siblings if they are imported as top-level modules.

    // Attempting to run from current directory (backend), so './agents/seyna.py' is path.
    // Env PYTHONPATH: './agents' allows imports like 'import vogue' inside seyna.py to work if seyna.py is scripts.
    const pythonCommand = process.env.PYTHON_COMMAND || 'python';

    const pythonProcess = spawn(pythonCommand, ['./agents/seyna.py'], {
        env: { ...process.env, PYTHONPATH: './agents' }
    });

    let dataString = '';
    let errorString = '';

    pythonProcess.stdin.write(JSON.stringify({ goal }));
    pythonProcess.stdin.end();

    pythonProcess.stdout.on('data', (data) => {
        dataString += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
        errorString += data.toString();
        console.error("Seyna Python Error:", data.toString());
    });

    pythonProcess.on('close', (code) => {
        if (code !== 0) {
            return res.status(500).json({ error: "Seyna Operation Failed", details: errorString });
        }
        try {
            const result = JSON.parse(dataString);
            res.json(result);
        } catch (e) {
            res.status(500).json({ error: "Seyna Parsing Failed", details: e.message, raw: dataString });
        }
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`FashFolio Server running on port ${PORT}`));
