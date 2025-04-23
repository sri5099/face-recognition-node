# Face Recognition for React Native

A face comparison library using face-api.js and TensorFlow.js for React Native applications.

## Installation

```bash
npm install face-recognition-rn
# or
yarn add face-recognition-rn
```

Also install peer dependencies:

```bash
npm install @tensorflow/tfjs @tensorflow/tfjs-react-native face-api.js
# or
yarn add @tensorflow/tfjs @tensorflow/tfjs-react-native face-api.js
```

## Setup

1. Download the required model files and place them in your app's assets folder:
   - face_recognition_model-weights_manifest.json
   - face_recognition_model-shard1
   - face_recognition_model-shard2
   - face_landmark_68_model-weights_manifest.json
   - face_landmark_68_model-shard1
   - ssd_mobilenetv1_model-weights_manifest.json
   - ssd_mobilenetv1_model-shard1

2. Initialize TensorFlow.js in your app:

```javascript
import * as tf from '@tensorflow/tfjs';
import { bundleResourceIO } from '@tensorflow/tfjs-react-native';

// Initialize TF.js
await tf.ready();
```

## Usage

```javascript
import { faceRecognitionService } from 'face-recognition-rn';
import { Image } from 'react-native';

// Example usage in a React Native component
const MyComponent = () => {
  const compareImages = async (image1Uri, image2Uri) => {
    try {
      // Initialize models with your model URIs
      await faceRecognitionService.loadModels({
        faceRecognitionNet: 'path/to/face_recognition_model',
        faceLandmark68Net: 'path/to/face_landmark_68_model',
        ssdMobilenetv1: 'path/to/ssd_mobilenetv1_model'
      });

      // Convert images to tensors
      const image1Tensor = await faceRecognitionService.imageToTensor(image1Element);
      const image2Tensor = await faceRecognitionService.imageToTensor(image2Element);

      // Compare faces
      const result = await faceRecognitionService.compareFaces(
        image1Tensor,
        image2Tensor
      );

      console.log('Match:', result.isMatch);
      console.log('Similarity:', result.similarity);

      // Clean up tensors
      image1Tensor.dispose();
      image2Tensor.dispose();
    } catch (error) {
      console.error('Error comparing faces:', error);
    }
  };

  return (
    // Your component JSX
  );
};
```

## API

### faceRecognitionService.loadModels(modelConfig)
Loads the required face-api.js models.

### faceRecognitionService.compareFaces(image1Tensor, image2Tensor)
Compares two face images and returns similarity score.

### faceRecognitionService.imageToTensor(imageElement)
Converts a React Native image element to a tensor.

## Limitations

- Images should contain clear, front-facing facial images
- Only one face per image is supported
- Performance may vary based on device capabilities
- Requires proper model files to be available in the app assets

## License

ISC
