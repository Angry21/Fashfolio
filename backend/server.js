require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { spawn } = require('child_process');
const { OpenRouter } = require("@openrouter/sdk"); // Add OpenRouter SDK
const Product = require('./models/Product');
const path = require('path');

// Helper to get the correct Python path
// Helper to get the correct Python path
const pythonCommand = process.env.PYTHON_COMMAND || 'python';

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
        const { title, designer, price, category, image } = req.body;

        // 1. Prepare Initial Data
        let productData = {
            title,
            designer,
            price,
            category,
            image,
            aiTags: [],
            visualScore: 0
        };

        // 2. Call PIXEL Agent if image exists
        if (image) {
            console.log("👁️ Pixel Agent is analyzing visual data...");

            // Wrap Python call in a Promise
            const pixelResult = await new Promise((resolve) => {
                const pythonProcess = spawn(pythonCommand, ['./agents/pixel.py'], {
                    env: { ...process.env, PYTHONPATH: './agents' }
                });

                let dataString = '';

                // Handle input errors gracefully
                pythonProcess.stdin.on('error', (err) => {
                    console.error("Stdin Error:", err);
                    resolve({});
                });

                pythonProcess.stdin.write(JSON.stringify({ imageUrl: image }));
                pythonProcess.stdin.end();

                pythonProcess.stdout.on('data', (data) => dataString += data.toString());

                pythonProcess.on('close', (code) => {
                    try {
                        // Parse result (handle potential Python print warnings)
                        const result = JSON.parse(dataString);
                        resolve(result);
                    } catch (e) {
                        console.error("Pixel Parse Error. Raw output:", dataString);
                        resolve({});
                    }
                });
            });

            // 3. Merge Pixel's Data
            if (pixelResult.style_tags) {
                console.log("✅ Pixel Analysis Complete:", pixelResult.style_tags);
                productData.aiTags = pixelResult.style_tags;
                productData.visualScore = pixelResult.visual_rating;
                productData.dominantColor = pixelResult.color_hex;
                productData.fabricType = pixelResult.fabric;
            }
        }

        // 4. Save to DB
        const newProduct = new Product(productData);
        await newProduct.save();

        res.status(201).json(newProduct);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

// 3. AI TREND ANALYSIS (OpenRouter Implementation)
app.get('/api/analyze-trends', async (req, res) => {
    try {
        console.log("Analyzing trends with OpenRouter...");

        // Initialize OpenRouter
        const openrouter = new OpenRouter({
            apiKey: process.env.OPENROUTER_API_KEY,
        });

        const products = await Product.find();
        let updatedCount = 0;

        for (const product of products) {
            // Only analyze if missing data or low score (optimization)
            if (!product.marketingBlurb || product.trendScore === 0 || !product.trendScore) {

                const prompt = `
                Analyze this fashion item:
                Item: ${product.title}
                Designer: ${product.designer}
                Category: ${product.category}
                Price: $${product.price}

                Task:
                1. Give a 'trendScore' from 0 to 100 based on current fashion trends.
                2. Write a short, catchy 1-sentence 'marketingBlurb' for social media.
                
                Return ONLY valid JSON like this: {"trendScore": 85, "marketingBlurb": "The must-have look for summer."}
                `;

                try {
                    const completion = await openrouter.chat.send({
                        model: "mistralai/devstral-2512:free",
                        messages: [
                            { role: "user", content: prompt }
                        ]
                    });

                    const responseContent = completion.choices[0]?.message?.content;

                    if (responseContent) {
                        // Clean up markdown code blocks if present
                        const jsonString = responseContent.replace(/```json/g, '').replace(/```/g, '').trim();
                        try {
                            const aiData = JSON.parse(jsonString);

                            if (aiData.trendScore && aiData.marketingBlurb) {
                                await Product.findByIdAndUpdate(product._id, {
                                    trendScore: aiData.trendScore,
                                    marketingBlurb: aiData.marketingBlurb
                                });
                                updatedCount++;
                            }
                        } catch (e) {
                            console.error(`Failed to parse AI response for ${product.title}:`, e.message);
                        }
                    }
                } catch (apiError) {
                    console.error(`OpenRouter API Error for ${product.title}:`, apiError.message);
                    // Continue to next product even if one fails
                }
            }
        }

        console.log(`Updated ${updatedCount} products.`);

        // Return updated list
        const finalProducts = await Product.find().sort({ createdAt: -1 });
        res.json(finalProducts);

    } catch (err) {
        console.error("Global Trend Analysis Error:", err);
        res.status(500).json({ error: err.message });
    }
});

// 4. AI USER SCORING (For Social Network)
app.post('/api/score-users', async (req, res) => {
    try {
        const users = req.body;
        // Use consolidated pythonCommand
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

// 6. PIXIE AGENT CHAT (Context Aware)
app.post('/api/agent/chat', async (req, res) => {
    try {
        // 1. Extract context (default to 'CREATIVE_MODE' if missing)
        const { message, context = "CREATIVE_MODE" } = req.body;

        // Fetch a small subset of products for context
        const inventory = await Product.find().limit(10).select('title price category trendScore');

        const inputPayload = {
            query: message,
            products: inventory,
            context: context // 2. Pass context to Python
        };

        // Using ai_agent.py (Update this file next)
        const pythonProcess = spawn(pythonCommand, ['./ai_agent.py'], {
            env: { ...process.env }
        });

        let dataString = '';
        let errorString = '';

        pythonProcess.stdin.write(JSON.stringify(inputPayload));
        pythonProcess.stdin.end();

        pythonProcess.stdout.on('data', (data) => {
            dataString += data.toString();
        });

        pythonProcess.stderr.on('data', (data) => {
            errorString += data.toString();
            console.error("Pixie Agent Error:", data.toString());
        });

        pythonProcess.on('close', (code) => {
            if (code !== 0) {
                return res.status(500).json({ error: "Agent Process Failed", details: errorString });
            }
            try {
                const result = JSON.parse(dataString);
                res.json(result);
            } catch (e) {
                res.status(500).json({ error: "Agent JSON Parse Error", details: e.message, raw: dataString });
            }
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`FashFolio Server running on port ${PORT}`));
