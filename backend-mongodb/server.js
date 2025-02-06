const express = require('express');
const ExpenceApi = require('./routes/Expence');
const userApi = require('./routes/user');
const incomeApi = require('./routes/income');
require('./config/connect');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// Use the Expence router
app.use('/Expence', ExpenceApi);
app.use('/user', userApi);
app.use('/income', incomeApi);

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});