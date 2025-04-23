const express = require('express');
const faceRecognitionService = require('./src/services/faceRecognition');
const faceRoutes = require('./src/routes/faceRoutes');
const config = require('./src/config/config');

const app = express();

// Initialize face recognition models
faceRecognitionService.loadModels()
  .then(() => {
    console.log('Models loaded successfully');
  })
  .catch(err => {
    console.error('Error loading models:', err);
    process.exit(1);
  });

// Routes
app.use('/api', faceRoutes);

// Start server
app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
});
