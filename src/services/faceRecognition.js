const faceapi = require('face-api.js');
const canvas = require('canvas');
const fs = require('fs');
const config = require('../config/config');

const { Canvas, Image, ImageData } = canvas;
faceapi.env.monkeyPatch({ Canvas, Image, ImageData });

class FaceRecognitionService {
  async loadModels() {
    try {
      if (!fs.existsSync(config.models.directory)) {
        throw new Error('Models directory not found');
      }

      const missingFiles = config.models.requiredFiles.filter(
        file => !fs.existsSync(`${config.models.directory}/${file}`)
      );
      
      if (missingFiles.length > 0) {
        throw new Error(`Missing model files: ${missingFiles.join(', ')}`);
      }

      await faceapi.nets.faceRecognitionNet.loadFromDisk(config.models.directory);
      await faceapi.nets.faceLandmark68Net.loadFromDisk(config.models.directory);
      await faceapi.nets.ssdMobilenetv1.loadFromDisk(config.models.directory);
      
      console.log('All models loaded successfully');
    } catch (error) {
      console.error('Error loading models:', error.message);
      throw error;
    }
  }

  async compareFaces(image1Buffer, image2Buffer) {
    try {
      const img1 = await canvas.loadImage(image1Buffer);
      const img2 = await canvas.loadImage(image2Buffer);

      const detection1 = await faceapi.detectSingleFace(img1)
        .withFaceLandmarks()
        .withFaceDescriptor();
      
      const detection2 = await faceapi.detectSingleFace(img2)
        .withFaceLandmarks()
        .withFaceDescriptor();

      if (!detection1 || !detection2) {
        throw new Error('No face detected in one or both images');
      }

      const distance = faceapi.euclideanDistance(
        detection1.descriptor,
        detection2.descriptor
      );

      const similarity = 1 - distance;
      
      return {
        similarity,
        isMatch: similarity > config.similarity.threshold
      };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new FaceRecognitionService();