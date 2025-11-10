// config/connect.js
const mongoose = require('mongoose');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error('❌ Erreur : la variable MONGO_URI n\'est pas définie.');
  process.exit(1);
}

mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('✅ Connexion à MongoDB réussie');
  })
  .catch((error) => {
    console.error('❌ Erreur de connexion MongoDB :', error.message);
    process.exit(1);
  });

module.exports = mongoose;
