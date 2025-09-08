import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

const TryOnPage: React.FC = () => {
  const [clothingFile, setClothingFile] = useState<File | null>(null);
  const [userPhotoFile, setUserPhotoFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const onClothingDrop = useCallback((accepted: File[]) => {
    if (accepted.length > 0) setClothingFile(accepted[0]);
  }, []);
  const onPhotoDrop = useCallback((accepted: File[]) => {
    if (accepted.length > 0) setUserPhotoFile(accepted[0]);
  }, []);

  const { getRootProps: getClothingRootProps, getInputProps: getClothingInputProps, isDragActive: isClothingDragActive } =
    useDropzone({ onDrop: onClothingDrop, accept: { 'image/*': ['.jpeg', '.jpg', '.png', '.gif'] } });

  const { getRootProps: getPhotoRootProps, getInputProps: getPhotoInputProps, isDragActive: isPhotoDragActive } =
    useDropzone({ onDrop: onPhotoDrop, accept: { 'image/*': ['.jpeg', '.jpg', '.png', '.gif'] } });

  const handleProcess = async () => {
    if (!clothingFile || !userPhotoFile) {
      alert('Please upload both clothing and photo files');
      return;
    }
    setIsProcessing(true);
    try {
      await new Promise((r) => setTimeout(r, 3000)); // simulate
      setResult('Processing complete! (This is a demo)');
    } catch (e) {
      console.error('Processing error:', e);
      alert('Processing failed');
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
              disabled={!clothingFile || !userPhotoFile || isProcessing}
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
