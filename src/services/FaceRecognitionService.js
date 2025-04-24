import * as tf from '@tensorflow/tfjs';
import * as faceapi from 'face-api.js';
import '@tensorflow/tfjs-react-native';
import config from '../config/config';

class FaceRecognitionService {
  constructor() {
    this.isModelLoaded = false;
  }

  async loadModels() {
    if (this.isModelLoaded) return;

    try {
      await tf.ready();
      
      // Load models using the paths from config
      const modelPath = ''; // Set your model base path here
      await Promise.all([
        faceapi.nets.faceRecognitionNet.loadFromUri(modelPath),
        faceapi.nets.faceLandmark68Net.loadFromUri(modelPath),
        faceapi.nets.ssdMobilenetv1.loadFromUri(modelPath)
      ]);
      
      this.isModelLoaded = true;
      console.log('Face recognition models loaded successfully');
    } catch (error) {
      console.error('Error loading face recognition models:', error);
      throw error;
    }
  }

  async detectFace(tensor) {
    if (!this.isModelLoaded) {
      throw new Error('Models not loaded. Call loadModels() first.');
    }

    const detection = await faceapi
      .detectSingleFace(tensor)
      .withFaceLandmarks()
      .withFaceDescriptor();

    if (!detection) {
      throw new Error('No face detected in the image');
    }

    return detection;
  }

  async compareFaces(tensor1, tensor2) {
    try {
      const detection1 = await this.detectFace(tensor1);
      const detection2 = await this.detectFace(tensor2);

      const distance = faceapi.euclideanDistance(
        detection1.descriptor,
        detection2.descriptor
      );

      const similarity = 1 - distance;
      const isMatch = similarity > config.similarity.threshold;

      return {
        similarity,
        isMatch,
        landmarks1: detection1.landmarks,
        landmarks2: detection2.landmarks,
        detection1: detection1.detection,
        detection2: detection2.detection
      };
    } catch (error) {
      throw error;
    }
  }

  async imageToTensor(imageElement) {
    try {
      return await tf.browser.fromPixels(imageElement);
    } catch (error) {
      throw new Error(`Failed to convert image to tensor: ${error.message}`);
    }
  }

  async processImage(uri) {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      const imageBitmap = await createImageBitmap(blob);
      return await this.imageToTensor(imageBitmap);
    } catch (error) {
      throw new Error(`Failed to process image: ${error.message}`);
    }
  }
}

export default new FaceRecognitionService();