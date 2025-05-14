// server.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fetch from 'node-fetch';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// Root route
app.get('/', (req, res) => {
  res.send('Currency Converter Backend is running.');
});

// Currency conversion route
app.post('/convert', async (req, res) => {
  try {
    const { inr } = req.body;
    console.log('INR received:', inr);

    const apiUrl = process.env.EXCHANGE_RATE_API;
    console.log('Using API URL:', apiUrl); // This line confirms your API URL

    const response = await fetch(apiUrl);
    const data = await response.json();

    console.log('Exchange Rate API Response:', data); // See full API response

    if (!data.rates || !data.rates.USD || !data.rates.EUR) {
      throw new Error('Exchange rate data is missing or malformed');
    }

    const usdRate = data.rates.USD;
    const eurRate = data.rates.EUR;

    const usd = (inr * usdRate).toFixed(2);
    const eur = (inr * eurRate).toFixed(2);

    res.json({ usd, eur });
  } catch (error) {
    console.error('Error fetching exchange rates:', error.message);
    res.status(500).json({
      error: 'Failed to fetch exchange rates',
      detail: error.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});