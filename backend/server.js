const express = require('express');
const axios = require('axios');
const path = require('path'); // Import the path module
const mongoose = require('mongoose');
const app = express();
const PORT = process.env.PORT || 3000;

// Set the root for serving static files
app.use(express.static(path.join(__dirname, 'public')));

mongoose.connect('mongodb+srv://22322:genshin123@cluster0.ghh2tga.mongodb.net/?retryWrites=true&w=majority', {
  useNewUrlParser: true,
});

// Define Schema
const tickerSchema = new mongoose.Schema({
  symbol: String,
  last: Number,
  buy: Number,
  sell: Number,
  volume: Number,
  base_unit: String,
});

const Ticker = mongoose.model('Ticker', tickerSchema);

app.get('/', (req, res) => {
  res.sendFile('landing.html', { root: path.join(__dirname, 'public') });
});

app.get('/top10', async (req, res) => {
    try {
      const response = await axios.get('https://api.wazirx.com/api/v2/tickers');
      const tickers = response.data;
  
      // Extract relevant information (last, buy, sell) for each ticker
      const top10 = Object.values(tickers)
        .slice(0, 10)
        .map(({ last, buy, sell, symbol }) => ({ last, buy, sell, symbol }));

        top10.forEach(async ({ last, buy, sell, volume, base_unit, symbol }) => {
            await Ticker.create({
              symbol,
              last,
              buy,
              sell,
              volume,
              base_unit,
            });
          });

      res.json(top10);
    } catch (error) {
      console.error('Error fetching data from WazirX API', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
