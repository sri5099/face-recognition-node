const express = require('express');
const router = express.Router();
const fs = require('fs');
const upload = require('../middleware/upload');
const faceRecognitionService = require('../services/faceRecognition');

router.post('/compare', 
  upload.fields([
    { name: 'image1', maxCount: 1 },
    { name: 'image2', maxCount: 1 }
  ]),
  async (req, res) => {
    try {
      if (!req.files['image1'] || !req.files['image2']) {
        return res.status(400).json({ error: 'Please provide both images' });
      }

      const image1Buffer = fs.readFileSync(req.files['image1'][0].path);
      const image2Buffer = fs.readFileSync(req.files['image2'][0].path);

      const result = await faceRecognitionService.compareFaces(image1Buffer, image2Buffer);

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
  }
);

module.exports = router;