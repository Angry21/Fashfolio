require('dotenv').config();
const mongoose = require('mongoose');
const { faker } = require('@faker-js/faker');
const Product = require('./models/Product');

// --- CONFIGURATION ---
const TOTAL_PRODUCTS = 120; // "More than 100"

const LOCAL_MOCKS = [
    "/mocks/jacket.png",
    "/mocks/dress.png",
    "/mocks/sneakers.png",
    "/mocks/bag.png"
];

const DESIGNERS = [
    "Balenciaga", "Gucci", "Prada", "Off-White", "Alexander Wang",
    "Versace", "Saint Laurent", "Rick Owens", "Y-3", "Acne Studios",
    "Jacquemus", "The Row", "Khaite", "Bottega Veneta", "Loewe",
    "Fendi", "Givenchy", "Valentino", "Burberry", "Dior"
];

const CATEGORIES = ["Streetwear", "High Fashion", "Avant-Garde", "Casual Luxury", "Accessories", "Footwear"];

// --- GENERATOR ---
const generateProduct = () => {
    // 30% chance of using a high-quality local mock
    // 70% chance of using a random LoremFlickr fashion image (Unsplash sourced)
    const useLocal = Math.random() < 0.3;
    const image = useLocal
        ? faker.helpers.arrayElement(LOCAL_MOCKS)
        : faker.image.urlLoremFlickr({ category: 'fashion', width: 640, height: 480 });

    return {
        title: `${faker.commerce.productAdjective()} ${faker.commerce.productMaterial()} ${faker.commerce.product()}`,
        designer: faker.helpers.arrayElement(DESIGNERS),
        price: parseFloat(faker.commerce.price({ min: 100, max: 5000 })),
        category: faker.helpers.arrayElement(CATEGORIES),
        image: image,
        trendScore: faker.number.int({ min: 40, max: 99 }),
        marketingBlurb: faker.lorem.sentence({ min: 5, max: 10 }),
        visualScore: faker.number.float({ min: 5.0, max: 10.0, precision: 0.1 }),
        createdAt: faker.date.recent({ days: 60 }) // Distribute over last 2 months
    };
};

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ Connected to DB for Mass Seeding...");

        // Clear existing
        await Product.deleteMany({});
        console.log("🗑️  Cleared existing products.");

        // Generate Data
        const products = [];
        for (let i = 0; i < TOTAL_PRODUCTS; i++) {
            products.push(generateProduct());
        }

        // Batch Insert
        await Product.insertMany(products);
        console.log(`🚀 Successfully seeded ${products.length} products.`);

        process.exit();
    } catch (err) {
        console.error("❌ Seeding Failed:", err);
        process.exit(1);
    }
};

seedDB();
