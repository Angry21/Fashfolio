const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    title: { type: String, required: true },
    designer: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, default: 'Streetwear' },
    image: { type: String },

    // -- AI AGENT FIELDS --
    trendScore: { type: Number, default: 0 },
    marketingBlurb: { type: String },

    // NEW: Pixel's Vision Data
    aiTags: [{ type: String }],      // e.g. ["Vintage", "Leather"]
    visualScore: { type: Number },   // e.g. 8.5
    dominantColor: { type: String }, // e.g. "#FF0000"
    fabricType: { type: String },    // e.g. "Denim"

    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Product', ProductSchema);
