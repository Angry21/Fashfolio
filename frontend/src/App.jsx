import { useState, useEffect } from 'react';
import axios from 'axios';

// Automatically use environment variable in production, or localhost in development
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function App() {
    const [products, setProducts] = useState([]);
    const [form, setForm] = useState({ title: '', designer: '', price: '', category: 'Streetwear' });

    // Fetch Data
    const fetchProducts = async () => {
        const res = await axios.get(`${API_URL}/api/products`);
        setProducts(res.data);
    };

    useEffect(() => { fetchProducts(); }, []);

    // Handle Add
    const handleSubmit = async (e) => {
        e.preventDefault();
        await axios.post(`${API_URL}/api/products`, form);
        fetchProducts();
        setForm({ title: '', designer: '', price: '', category: 'Streetwear' });
    };

    // Handle AI Analysis
    const runAI = async () => {
        alert("Running Trend Analysis...");
        const res = await axios.get(`${API_URL}/api/analyze-trends`);
        setProducts(res.data); // Update list with scores
    };

    return (
        <div className="p-10 max-w-4xl mx-auto font-sans">
            <h1 className="text-4xl font-bold mb-8 text-pink-600">FashFolio Dashboard</h1>

            {/* Upload Form */}
            <div className="bg-gray-100 p-6 rounded-lg mb-8">
                <h2 className="text-xl font-bold mb-4">Upload New Design</h2>
                <form onSubmit={handleSubmit} className="flex gap-4">
                    <input className="p-2 border rounded" placeholder="Design Name" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
                    <input className="p-2 border rounded" placeholder="Designer" value={form.designer} onChange={e => setForm({ ...form, designer: e.target.value })} />
                    <input className="p-2 border rounded" type="number" placeholder="Price" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} />
                    <select className="p-2 border rounded" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                        <option>Streetwear</option>
                        <option>Vintage</option>
                        <option>Haute Couture</option>
                    </select>
                    <button className="bg-black text-white px-6 py-2 rounded">Upload</button>
                </form>
            </div>

            {/* AI Button */}
            <button onClick={runAI} className="w-full bg-purple-600 text-white py-3 rounded-lg mb-8 font-bold text-lg hover:bg-purple-700 transition">
                ✨ Analyze Trends with AI
            </button>

            {/* Product Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {products.map((p) => (
                    <div key={p._id} className="border p-4 rounded shadow hover:shadow-lg transition bg-white">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="text-xl font-bold">{p.title}</h3>
                                <p className="text-gray-500">by {p.designer}</p>
                                <p className="font-mono mt-2">${p.price}</p>
                            </div>
                            {p.trendScore > 0 && (
                                <div className="bg-purple-100 text-purple-800 text-xs font-bold px-2 py-1 rounded">
                                    Trend Score: {p.trendScore}
                                </div>
                            )}
                        </div>
                        <span className="inline-block mt-3 bg-gray-200 text-xs px-2 py-1 rounded">{p.category}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default App;
