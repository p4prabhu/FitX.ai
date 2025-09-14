import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

const TryOnPage: React.FC = () => {
  const [clothingFile, setClothingFile] = useState<File | null>(null);
  const [userPhotoFile, setUserPhotoFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [clothingKey, setClothingKey] = useState<string | null>(null);
  const [userPhotoKey, setUserPhotoKey] = useState<string | null>(null);

  // Function to upload file to S3
  const uploadToS3 = async (file: File, uploadType: 'clothing' | 'user-photo') => {
    try {
      const contentType = file.type || 'application/octet-stream';
      // Get presigned URL from backend
      const response = await fetch('http://localhost:4000/get-presigned-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileName: file.name,
          fileType: contentType,
          uploadType: uploadType
        })
      });
      
      if (!response.ok) {
        const errText = await response.text().catch(() => '');
        throw new Error(`Failed to get presigned URL (${response.status} ${response.statusText}) ${errText}`);
      }
      
      const { url, key } = await response.json();
      
      // Upload file to S3
      const uploadResponse = await fetch(url, {
        method: 'PUT',
        body: file,
        headers: { 'Content-Type': contentType }
      });
      
      if (!uploadResponse.ok) {
        const errText = await uploadResponse.text().catch(() => '');
        throw new Error(`S3 upload failed (${uploadResponse.status} ${uploadResponse.statusText}) ${errText}`);
      }
      
      return key;
    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    }
  };

  const onClothingDrop = useCallback(async (accepted: File[]) => {
    if (accepted.length > 0) {
      const file = accepted[0];
      setClothingFile(file);
      
      try {
        const key = await uploadToS3(file, 'clothing');
        setClothingKey(key);
        console.log('Clothing uploaded to S3:', key);
      } catch (error: unknown) {
        console.error('Failed to upload clothing:', error);
        const message = error instanceof Error ? error.message : JSON.stringify(error);
        alert('Failed to upload clothing file: ' + message);
      }
    }
  }, []);
  
  const onPhotoDrop = useCallback(async (accepted: File[]) => {
    if (accepted.length > 0) {
      const file = accepted[0];
      setUserPhotoFile(file);
      
      try {
        const key = await uploadToS3(file, 'user-photo');
        setUserPhotoKey(key);
        console.log('Photo uploaded to S3:', key);
      } catch (error: unknown) {
        console.error('Failed to upload photo:', error);
        const message = error instanceof Error ? error.message : JSON.stringify(error);
        alert('Failed to upload photo file: ' + message);
      }
    }
  }, []);

  const { getRootProps: getClothingRootProps, getInputProps: getClothingInputProps, isDragActive: isClothingDragActive } =
    useDropzone({ onDrop: onClothingDrop, accept: { 'image/*': ['.jpeg', '.jpg', '.png', '.gif'] } });

  const { getRootProps: getPhotoRootProps, getInputProps: getPhotoInputProps, isDragActive: isPhotoDragActive } =
    useDropzone({ onDrop: onPhotoDrop, accept: { 'image/*': ['.jpeg', '.jpg', '.png', '.gif'] } });

  const handleProcess = async () => {
    if (!clothingKey || !userPhotoKey) {
      alert('Please upload both clothing and photo files first');
      return;
    }
    
    setIsProcessing(true);
    try {
      // First detect clothing type
      const clothingTypeResponse = await fetch('http://localhost:4000/detect-clothing-type', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageKey: clothingKey })
      });
      
      if (!clothingTypeResponse.ok) {
        throw new Error('Failed to detect clothing type');
      }
      
      const clothingType = await clothingTypeResponse.json();
      console.log('Detected clothing type:', clothingType);
      
      // Process the image
      const processResponse = await fetch('http://localhost:4000/process-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userPhotoKey: userPhotoKey,
          clothingKey: clothingKey,
          clothingType: clothingType.type
        })
      });
      
      if (!processResponse.ok) {
        throw new Error('Failed to process image');
      }
      
      const processResult = await processResponse.json();
      console.log('Processing result:', processResult);
      
      setResult(`Processing complete! Clothing type: ${clothingType.type} (Confidence: ${clothingType.confidence}%)`);
    } catch (error: unknown) {
      console.error('Processing error:', error);
      const message = error instanceof Error ? error.message : JSON.stringify(error);
      alert('Processing failed: ' + message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fx-root">
      <div className="fx-backdrop">
        <span className="fx-blob fx-b1" />
        <span className="fx-blob fx-b2" />
        <span className="fx-blob fx-b3" />
        <span className="fx-grain" />
      </div>

      <div className="fx-stack">
        <div className="fx-container fx-fade" style={{ maxWidth: 960 }}>
          <div className="fx-hero" style={{ marginBottom: 16 }}>
            <span className="fx-chip">Step 1: Upload — Step 2: Generate</span>
            <h1 className="fx-title"><span className="fx-title-grad">Virtual Try-On</span></h1>
            <p className="fx-sub">Upload your clothing and photo to see how it looks on you</p>
          </div>

          <div className="fx-grid">
            <div className="fx-card fx-shine">
              <h2 className="fx-card-title">Upload Clothing Item</h2>
              <div
                {...getClothingRootProps()}
                className={`fx-drop ${isClothingDragActive ? 'active' : ''}`}
              >
                <input {...getClothingInputProps()} />
                {clothingFile ? (
                  <p className="fx-ok">✓ {clothingFile.name}</p>
                ) : (
                  <p className="fx-muted">
                    {isClothingDragActive ? 'Drop the clothing image here...' : 'Drag & drop a clothing image here, or click to select'}
                  </p>
                )}
              </div>
            </div>

            <div className="fx-card fx-shine">
              <h2 className="fx-card-title">Upload Your Photo</h2>
              <div
                {...getPhotoRootProps()}
                className={`fx-drop ${isPhotoDragActive ? 'active' : ''}`}
              >
                <input {...getPhotoInputProps()} />
                {userPhotoFile ? (
                  <p className="fx-ok">✓ {userPhotoFile.name}</p>
                ) : (
                  <p className="fx-muted">
                    {isPhotoDragActive ? 'Drop your photo here...' : 'Drag & drop your photo here, or click to select'}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* ⬇️ EXACT SAME BUTTON you already had */}
          <div className="fx-cta" style={{ marginBottom: 22 }}>
            <button
              onClick={handleProcess}
              disabled={!clothingKey || !userPhotoKey || isProcessing}
              className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isProcessing ? 'Processing...' : 'Generate Try-On'}
            </button>
          </div>

          {result && (
            <div className="fx-card fx-shine" style={{ textAlign:'center' }}>
              <h3 className="fx-card-title">Result</h3>
              <p className="fx-ok">{result}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TryOnPage;
