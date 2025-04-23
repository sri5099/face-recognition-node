const faceapi = require('face-api.js');
const tf = require('@tensorflow/tfjs');
require('@tensorflow/tfjs-react-native');

class FaceRecognitionService {
  async loadModels(modelConfig) {
    try {
      await tf.ready();
      
      // Load models from provided URIs
      await faceapi.nets.faceRecognitionNet.loadFromUri(modelConfig.faceRecognitionNet);
      await faceapi.nets.faceLandmark68Net.loadFromUri(modelConfig.faceLandmark68Net);
      await faceapi.nets.ssdMobilenetv1.loadFromUri(modelConfig.ssdMobilenetv1);
      
      console.log('All models loaded successfully');
    } catch (error) {
      console.error('Error loading models:', error.message);
      throw error;
    }
  }

  async compareFaces(image1Tensor, image2Tensor) {
    try {
      const detection1 = await faceapi.detectSingleFace(image1Tensor)
        .withFaceLandmarks()
        .withFaceDescriptor();
      
      const detection2 = await faceapi.detectSingleFace(image2Tensor)
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
        isMatch: similarity > 0.6
      };
    } catch (error) {
      throw error;
    }
  }

  // Helper method to convert React Native image to tensor
  async imageToTensor(imageElement) {
    try {
      return await tf.browser.fromPixels(imageElement);
    } catch (error) {
      throw new Error('Failed to convert image to tensor: ' + error.message);
    }
  }
}

module.exports = new FaceRecognitionService();
