require('dotenv').config();
const express = require('express');
const AWS = require('aws-sdk');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

const s3 = new AWS.S3({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  signatureVersion: 'v4',
});

const bedrock = new AWS.BedrockRuntime({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const rekognition = new AWS.Rekognition({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const BUCKET = process.env.S3_BUCKET_NAME;

// Helper function to generate a unique filename
function generateUniqueFilename(originalFilename, prefix) {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 8);
  const extension = path.extname(originalFilename);
  return `${prefix}/${timestamp}-${randomString}${extension}`;
}

// Helper function to detect clothing type
async function detectClothingType(imageKey) {
  const params = {
    Image: {
      S3Object: {
        Bucket: BUCKET,
        Name: imageKey
      }
    },
    MaxLabels: 10,
    MinConfidence: 70
  };

  try {
    const result = await rekognition.detectLabels(params).promise();
    
    // Define clothing categories and their related labels
    const clothingCategories = {
      top: ['shirt', 't-shirt', 'blouse', 'sweater', 'jacket', 'top', 'dress shirt', 'polo shirt'],
      bottom: ['pants', 'jeans', 'trousers', 'shorts', 'skirt', 'leggings', 'bottom'],
      dress: ['dress', 'gown', 'frock']
    };

    // Check each detected label against our categories
    for (const label of result.Labels) {
      const labelName = label.Name.toLowerCase();
      
      // Check if label matches any category
      for (const [category, keywords] of Object.entries(clothingCategories)) {
        if (keywords.some(keyword => labelName.includes(keyword))) {
          return {
            type: category,
            confidence: label.Confidence,
            allLabels: result.Labels.map(l => ({ name: l.Name, confidence: l.Confidence }))
          };
        }
      }
    }

    return {
      type: 'unknown',
      confidence: 0,
      allLabels: result.Labels.map(l => ({ name: l.Name, confidence: l.Confidence }))
    };
  } catch (error) {
    console.error('Error detecting clothing type:', error);
    throw error;
  }
}

app.post('/get-presigned-url', async (req, res) => {
  const { fileName, fileType, uploadType } = req.body;
  if (!fileName || !fileType || !uploadType) {
    return res.status(400).json({ error: 'Missing required parameters' });
  }

  // Determine the appropriate folder based on upload type
  let prefix;
  switch (uploadType) {
    case 'clothing':
      prefix = 'clothing-items';
      break;
    case 'user-photo':
      prefix = 'user-photos';
      break;
    case 'generated':
      prefix = 'generated-images';
      break;
    default:
      return res.status(400).json({ error: 'Invalid upload type' });
  }

  const key = generateUniqueFilename(fileName, prefix);

  const params = {
    Bucket: BUCKET,
    Key: key,
    Expires: 60,
    ContentType: fileType,
  };

  try {
    const url = await s3.getSignedUrlPromise('putObject', params);
    res.json({ 
      url,
      key // Return the key so the frontend knows where the file was stored
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// New endpoint to detect clothing type
app.post('/detect-clothing-type', async (req, res) => {
  const { imageKey } = req.body;
  
  if (!imageKey) {
    return res.status(400).json({ error: 'Missing imageKey' });
  }

  try {
    const result = await detectClothingType(imageKey);
    res.json(result);
  } catch (err) {
    console.error('Error in detect-clothing-type:', err);
    res.status(500).json({ error: err.message });
  }
});

// Updated process-image endpoint
app.post('/process-image', async (req, res) => {
  const { userPhotoKey, clothingKey, clothingType } = req.body;
  
  if (!userPhotoKey || !clothingKey || !clothingType) {
    return res.status(400).json({ error: 'Missing required parameters' });
  }

  try {
    // TODO: Implement virtual try-on using appropriate model based on clothingType
    // For now, we'll return a mock response
    const result = {
      success: true,
      processedImageKey: `generated-images/${Date.now()}-tryon.jpg`,
      message: `Processing ${clothingType} try-on...`
    };

    res.json(result);
  } catch (err) {
    console.error('Error processing image:', err);
    res.status(500).json({ error: 'Failed to process image: ' + err.message });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});