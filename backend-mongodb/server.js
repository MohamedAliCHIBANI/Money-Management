// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

// Connection à la base (import du fichier)
require('./config/connect');

// Routes
const ExpenceApi = require('./routes/Expence');
const userApi = require('./routes/user');
const incomeApi = require('./routes/income');

app.use(express.json());
app.use(cors());

app.use('/Expence', ExpenceApi);
app.use('/user', userApi);
app.use('/income', incomeApi);

app.get('/', (req, res) => {
  res.send('✅ Money Management API is running');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
