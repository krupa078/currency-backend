import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fetch from 'node-fetch';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// ✅ UPDATE THIS LINE:
const PORT = process.env.PORT || 5000;

// Root route
app.get('/', (_req, res) => {
  res.send('Currency Converter Backend is running.');
});

// POST /convert route
app.post('/convert', async (req, res) => {
  try {
    const { inr } = req.body;
    const apiUrl = process.env.EXCHANGE_RATE_API;

    const response = await fetch(apiUrl);
    const data = await response.json();

    if (!data.rates || !data.rates.USD || !data.rates.EUR) {
      throw new Error('Exchange rate data is missing or malformed');
    }

    const usd = (inr * data.rates.USD).toFixed(2);
    const eur = (inr * data.rates.EUR).toFixed(2);

    res.json({ usd, eur });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to fetch exchange rates',
      detail: error.message,
    });
  }
});

// ✅ LISTEN HERE
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
