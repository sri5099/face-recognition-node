import { useState, useCallback } from 'react';
import FaceRecognitionService from '../services/FaceRecognitionService';

export const useFaceRecognition = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);

  const initialize = useCallback(async () => {
    try {
      setError(null);
      await FaceRecognitionService.loadModels();
      setIsInitialized(true);
    } catch (err) {
      setError(err.message);
      setIsInitialized(false);
    }
  }, []);

  const compareFaces = useCallback(async (image1Uri, image2Uri) => {
    if (!isInitialized) {
      throw new Error('Face recognition not initialized. Call initialize() first.');
    }

    setIsProcessing(true);
    setError(null);

    try {
      const tensor1 = await FaceRecognitionService.processImage(image1Uri);
      const tensor2 = await FaceRecognitionService.processImage(image2Uri);

      const result = await FaceRecognitionService.compareFaces(tensor1, tensor2);

      // Cleanup tensors
      tensor1.dispose();
      tensor2.dispose();

      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsProcessing(false);
    }
  }, [isInitialized]);

  return {
    initialize,
    compareFaces,
    isInitialized,
    isProcessing,
    error
  };
};