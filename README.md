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

## Usage

```javascript
import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import { useFaceRecognition } from 'face-recognition-rn';

const FaceComparisonExample = () => {
  const { initialize, compareFaces, isInitialized, isProcessing, error } = useFaceRecognition();

  useEffect(() => {
    initialize();
  }, []);

  const handleComparison = async (image1Uri, image2Uri) => {
    try {
      const result = await compareFaces(image1Uri, image2Uri);
      console.log('Match:', result.isMatch);
      console.log('Similarity:', result.similarity);
    } catch (err) {
      console.error('Comparison failed:', err);
    }
  };

  return (
    <View>
      <Text>Status: {isInitialized ? 'Ready' : 'Initializing...'}</Text>
      {error && <Text>Error: {error}</Text>}
      {/* Your UI components */}
    </View>
  );
};
```

## Required Model Files

Place these files in your app's assets folder:
- face_recognition_model-weights_manifest.json
- face_recognition_model-shard1
- face_recognition_model-shard2
- face_landmark_68_model-weights_manifest.json
- face_landmark_68_model-shard1
- ssd_mobilenetv1_model-weights_manifest.json
- ssd_mobilenetv1_model-shard1

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
