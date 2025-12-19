const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    title: { type: String, required: true },
    designer: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, default: 'Uncategorized' },
    trendScore: { type: Number, default: 0 }, // AI will calculate this
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Product', ProductSchema);
