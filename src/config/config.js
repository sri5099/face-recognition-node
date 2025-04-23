const path = require('path');

module.exports = {
  port: process.env.PORT || 3000,
  upload: {
    directory: 'uploads/',
    limits: {
      fileSize: 10000000 // 10MB limit
    }
  },
  models: {
    directory: 'models/',
    requiredFiles: [
      'face_recognition_model-weights_manifest.json',
      'face_recognition_model-shard1',
      'face_recognition_model-shard2',
      'face_landmark_68_model-weights_manifest.json',
      'face_landmark_68_model-shard1',
      'ssd_mobilenetv1_model-weights_manifest.json',
      'ssd_mobilenetv1_model-shard1'
    ]
  },
  similarity: {
    threshold: 0.6
  }
};