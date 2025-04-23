# Face Recognition API

A Node.js API for comparing faces using face-api.js and TensorFlow.js. This API provides face similarity comparison between two images.

## Features

- Face detection and recognition using face-api.js
- Face similarity comparison with confidence score
- Support for image upload and comparison
- Built with Express.js and TensorFlow.js

## Prerequisites

- Node.js >= 16.0.0
- Face recognition models (to be placed in `models/` directory)

## Required Model Files

The following model files must be placed in the `models/` directory:
- face_recognition_model-weights_manifest.json
- face_recognition_model-shard1
- face_recognition_model-shard2
- face_landmark_68_model-weights_manifest.json
- face_landmark_68_model-shard1
- ssd_mobilenetv1_model-weights_manifest.json
- ssd_mobilenetv1_model-shard1

## Installation

1. Clone the repository:
```bash
git clone https://github.com/sri5099/face-recognition-node.git
cd face-recognition-node
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Create required directories:
```bash
mkdir -p uploads models
```

4. Download and place the model files in the `models/` directory

## Usage

1. Start the server:
```bash
npm start
# or
yarn start
```

For development with auto-reload:
```bash
npm run dev
# or
yarn dev
```

2. The server will start on port 3000 (or the port specified in the PORT environment variable)

## API Endpoints

### Compare Faces
- **URL**: `/compare`
- **Method**: `POST`
- **Content-Type**: `multipart/form-data`
- **Request Body**:
  - `image1`: First image file
  - `image2`: Second image file
- **Response**:
```json
{
  "match": boolean,
  "similarity": number,
  "similarityPercentage": string
}
```

## Example Usage

Using cURL:
```bash
curl -X POST \
  http://localhost:3000/compare \
  -F "image1=@/path/to/first/image.jpg" \
  -F "image2=@/path/to/second/image.jpg"
```

## Technical Details

- Face detection and recognition powered by face-api.js
- Uses TensorFlow.js Node backend for optimal performance
- Image processing using node-canvas
- File uploads handled by multer
- Temporary files are automatically cleaned up after processing

## Error Handling

The API returns appropriate error messages for:
- Missing or invalid images
- No faces detected in images
- Server processing errors

## Limitations

- Maximum file size: 10MB per image
- Supports common image formats (JPEG, PNG)
- Designed for comparing two faces at a time
- Requires clear, front-facing facial images for best results

## License

ISC

## Dependencies

- express: ^4.18.2
- face-api.js: ^0.22.2
- @tensorflow/tfjs-node: ^4.22.0
- canvas: ^3.1.0
- multer: ^1.4.5-lts.2