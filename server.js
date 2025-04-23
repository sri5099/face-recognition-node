const express = require('express');
const multer = require('multer');
const faceapi = require('face-api.js');
const canvas = require('canvas');
const path = require('path');
const fs = require('fs');

// Patch the Canvas, Image, ImageData onto the nodejs global scope
const { Canvas, Image, ImageData } = canvas;
faceapi.env.monkeyPatch({ Canvas, Image, ImageData });

const app = express();
const upload = multer({
  dest: 'uploads/',
  limits: { fileSize: 10000000 } // 10MB limit
});

const loadModels = async () => {
  try {
    // Check if models directory exists
    if (!fs.existsSync('models')) {
      throw new Error('Models directory not found');
    }

    // Check if required model files exist
    const requiredFiles = [
      'face_recognition_model-weights_manifest.json',
      'face_recognition_model-shard1',
      'face_recognition_model-shard2',
      'face_landmark_68_model-weights_manifest.json',
      'face_landmark_68_model-shard1',
      'ssd_mobilenetv1_model-weights_manifest.json',
      'ssd_mobilenetv1_model-shard1'
    ];

    const missingFiles = requiredFiles.filter(file => !fs.existsSync(`models/${file}`));
    
    if (missingFiles.length > 0) {
      throw new Error(`Missing model files: ${missingFiles.join(', ')}`);
    }

    // Load models
    await faceapi.nets.faceRecognitionNet.loadFromDisk('models');
    await faceapi.nets.faceLandmark68Net.loadFromDisk('models');
    await faceapi.nets.ssdMobilenetv1.loadFromDisk('models');
    
    console.log('All models loaded successfully');
  } catch (error) {
    console.error('Error loading models:', error.message);
    console.error('Please ensure all required model files are in the models directory');
    process.exit(1);
  }
};
// Load face-api models


// Initialize models
loadModels().then(() => {
  console.log('Models loaded successfully');
}).catch(err => {
  console.error('Error loading models:', err);
});

// Compare two faces
async function compareFaces(image1Buffer, image2Buffer) {
  try {
    // Load images
    const img1 = await canvas.loadImage(image1Buffer);
    const img2 = await canvas.loadImage(image2Buffer);

    // Detect faces
    const detection1 = await faceapi.detectSingleFace(img1)
      .withFaceLandmarks()
      .withFaceDescriptor();
    
    const detection2 = await faceapi.detectSingleFace(img2)
      .withFaceLandmarks()
      .withFaceDescriptor();

    if (!detection1 || !detection2) {
      throw new Error('No face detected in one or both images');
    }

    // Compare face descriptors
    const distance = faceapi.euclideanDistance(
      detection1.descriptor,
      detection2.descriptor
    );

    // Calculate similarity (0 to 1, where 1 is exact match)
    const similarity = 1 - distance;
    
    return {
      similarity: similarity,
      isMatch: similarity > 0.6 // threshold for considering it a match
    };
  } catch (error) {
    throw error;
  }
}

// API endpoint for face comparison
app.post('/compare', upload.fields([
  { name: 'image1', maxCount: 1 },
  { name: 'image2', maxCount: 1 }
]), async (req, res) => {
  try {
    if (!req.files['image1'] || !req.files['image2']) {
      return res.status(400).json({ error: 'Please provide both images' });
    }

    const image1Buffer = fs.readFileSync(req.files['image1'][0].path);
    const image2Buffer = fs.readFileSync(req.files['image2'][0].path);

    const result = await compareFaces(image1Buffer, image2Buffer);

    // Clean up uploaded files
    fs.unlinkSync(req.files['image1'][0].path);
    fs.unlinkSync(req.files['image2'][0].path);

    res.json({
      match: result.isMatch,
      similarity: result.similarity,
      similarityPercentage: `${(result.similarity * 100).toFixed(2)}%`
    });

  } catch (error) {
    res.status(500).json({
      error: error.message || 'Error processing face comparison'
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});