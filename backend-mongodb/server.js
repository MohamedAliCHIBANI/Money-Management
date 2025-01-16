const express = require('express');
const ExpenceApi = require('./routes/Expence');
require('./config/connect');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// Use the Expence router
app.use('/Expence', ExpenceApi);

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});