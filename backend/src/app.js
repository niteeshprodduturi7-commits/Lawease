const express = require('express'); 
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Connect to the database
connectDB();

// Middleware
app.use(cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);


app.get('/', (req, res) => {
    res.send("LegalTek Backend is Running...");
});

// Handle 404 Errors
app.use((req, res) => {
    res.status(404).json({ message: "Route Not Found" });
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
