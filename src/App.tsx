import './App.css';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { useCallback, useState } from 'react';

// Add environment variable type definitions
declare global {
  interface Window {
    env: {
      REACT_APP_S3_BUCKET: string;
      REACT_APP_AWS_REGION: string;
    }
  }
}

function LandingPage() {
  const navigate = useNavigate();
  const handleGetStarted = useCallback(() => {
    navigate('/tryon');
  }, [navigate]);

  return (
    <>
      {/* ── Navigation Bar ───────────────────────────────────────────── */}
      <nav className="w-full fixed top-0 inset-x-0 h-20 bg-black/90 backdrop-blur z-40">
        <div className="flex items-center h-full max-w-7xl mx-auto px-6">
          {/* Left: logo + links */}
          <div className="flex items-center gap-10">
            {/* Logo */}
            <a href="#" className="flex items-center gap-3">
              <span className="inline-block w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-400" />
              <span className="text-2xl font-extrabold tracking-tight text-white">
                FitX<span className="text-blue-400">.ai</span>
              </span>
            </a>
            {/* Nav links */}
            <a href="#" className="text-white hover:text-blue-400 font-semibold text-lg transition">Home</a>
            <a href="#about" className="text-white hover:text-blue-400 font-semibold text-lg transition">About</a>
          </div>
          {/* Right: Login (ml-auto pushes it to the far end) */}
          <button className="ml-auto bg-white text-black px-6 py-2 rounded-md font-semibold hover:bg-blue-50 transition">Login</button>
        </div>
      </nav>
      {/* ── Hero Section (unchanged) ────────────────────────────────── */}
      <main className="flex-grow flex items-center justify-center pt-20">
        <div className="container py-20 flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 text-center md:text-left space-y-7">
            <h1 className="text-5xl md:text-6xl font-extrabold leading-tight tracking-tight text-gray-900">
              Try On <span className="text-blue-600">Clothes</span> Virtually
              <br />
              With <span className="text-indigo-500">AI</span> Magic
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-xl">
              Instantly see how outfits look on you. No downloads, no hassle.
              Just upload your photo &amp; let our AI do the rest!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <button onClick={handleGetStarted} className="bg-blue-600 hover:bg-blue-700 text-white text-lg px-8 py-3 rounded-lg shadow-lg transition">
                Get Started
              </button>
            </div>
          </div>
          {/* Illustration placeholder */}
          <div className="flex-1 flex justify-center">
            <div className="w-80 h-80 bg-gradient-to-tr from-blue-100 via-indigo-100 to-white rounded-3xl shadow-xl flex items-center justify-center">
              <span className="text-6xl text-blue-400">👕</span>
            </div>
          </div>
        </div>
      </main>
      {/* ── Footer (unchanged) ─────────────────────────────────────── */}
      <footer className="bg-white border-t mt-12">
        <div className="container py-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-2">
            <span className="inline-block w-6 h-6 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-400" />
            <span className="font-bold text-lg">FitX.ai</span>
          </div>
          <div className="text-gray-500 text-sm">
            © {new Date().getFullYear()} FitX.ai. All rights&nbsp;reserved.
          </div>
          <div className="flex space-x-4">
            <a href="#" className="text-gray-400 hover:text-blue-600 transition">
              <svg width="24" height="24" fill="currentColor">
                <circle cx="12" cy="12" r="10" />
              </svg>
            </a>
            <a href="#" className="text-gray-400 hover:text-blue-600 transition">
              <svg width="24" height="24" fill="currentColor">
                <rect x="4" y="4" width="16" height="16" rx="4" />
              </svg>
            </a>
            <a href="#" className="text-gray-400 hover:text-blue-600 transition">
              <svg width="24" height="24" fill="currentColor">
                <polygon points="12,2 22,22 2,22" />
              </svg>
            </a>
          </div>
        </div>
      </footer>
    </>
  );
}

function TryOnPage() {
  const [step, setStep] = useState<'clothing' | 'photo'>('clothing');
  const [clothingPreview, setClothingPreview] = useState<string | null>(null);
  const [clothingFile, setClothingFile] = useState<File | null>(null);
  const [clothingType, setClothingType] = useState<string | null>(null);
  const [clothingUploadStatus, setClothingUploadStatus] = useState<string | null>(null);
  const [clothingKey, setClothingKey] = useState<string | null>(null);
  const [isClothingUploading, setIsClothingUploading] = useState(false);
  
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoUploadStatus, setPhotoUploadStatus] = useState<string | null>(null);
  const [photoKey, setPhotoKey] = useState<string | null>(null);
  const [isPhotoUploading, setIsPhotoUploading] = useState(false);
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedImageKey, setProcessedImageKey] = useState<string | null>(null);
  const [processingStatus, setProcessingStatus] = useState<string | null>(null);

  // Helper function to get S3 URL from key
  const getS3Url = (key: string) => {
    return `https://${window.env.REACT_APP_S3_BUCKET}.s3.${window.env.REACT_APP_AWS_REGION}.amazonaws.com/${key}`;
  };

  const handleClothingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setClothingFile(file);
      setClothingPreview(URL.createObjectURL(file));
      setClothingUploadStatus(null);
      setClothingKey(null); // Reset the key when a new file is selected
    }
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setPhotoFile(file);
      setPhotoPreview(URL.createObjectURL(file));
      setPhotoUploadStatus(null);
      setPhotoKey(null); // Reset the key when a new file is selected
    }
  };

  const uploadToS3 = async (file: File, uploadType: 'clothing' | 'user-photo' | 'generated') => {
    const res = await fetch('http://localhost:4000/get-presigned-url', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fileName: file.name,
        fileType: file.type,
        uploadType
      }),
    });
    const data = await res.json();
    if (!data.url || !data.key) throw new Error('No URL or key returned from backend');

    const uploadRes = await fetch(data.url, {
      method: 'PUT',
      headers: { 'Content-Type': file.type },
      body: file,
    });
    if (!uploadRes.ok) throw new Error('Upload to S3 failed');

    return data.key;
  };

  const handleClothingUpload = async () => {
    if (!clothingFile || isClothingUploading || clothingKey) {
      return; // Prevent upload if already uploading or already uploaded
    }

    setIsClothingUploading(true);
    setClothingUploadStatus('Uploading...');

    try {
      // Upload clothing image to S3
      const key = await uploadToS3(clothingFile, 'clothing');
      setClothingKey(key);
      setClothingUploadStatus('Upload successful!');

      // Detect clothing type
      const response = await fetch('http://localhost:4000/detect-clothing-type', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageKey: key }),
      });

      const data = await response.json();
      if (data.type === 'unknown') {
        throw new Error('Could not detect clothing type. Please try a clearer image.');
      }

      setClothingType(data.type);
      setStep('photo');
    } catch (err: unknown) {
      setClothingUploadStatus('Upload failed: ' + (err instanceof Error ? err.message : String(err)));
      setClothingKey(null); // Reset the key on failure
    } finally {
      setIsClothingUploading(false);
    }
  };

  const handlePhotoUpload = async () => {
    if (!photoFile || isPhotoUploading || photoKey) {
      return; // Prevent upload if already uploading or already uploaded
    }

    setIsPhotoUploading(true);
    setPhotoUploadStatus('Uploading...');

    try {
      const key = await uploadToS3(photoFile, 'user-photo');
      setPhotoKey(key);
      setPhotoUploadStatus('Upload successful!');
    } catch (err: unknown) {
      setPhotoUploadStatus('Upload failed: ' + (err instanceof Error ? err.message : String(err)));
      setPhotoKey(null); // Reset the key on failure
    } finally {
      setIsPhotoUploading(false);
    }
  };

  const handleProcessImage = async () => {
    if (!clothingKey || !photoKey || !clothingType) {
      alert('Please complete all steps first!');
      return;
    }

    setIsProcessing(true);
    setProcessingStatus(null);
    setProcessedImageKey(null);

    try {
      const response = await fetch('http://localhost:4000/process-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          userPhotoKey: photoKey,
          clothingKey: clothingKey,
          clothingType
        }),
      });

      const data = await response.json();
      if (!data.success) throw new Error(data.error || 'Processing failed');

      setProcessedImageKey(data.processedImageKey);
      setProcessingStatus('Processing successful!');
    } catch (err: unknown) {
      setProcessingStatus('Processing failed: ' + (err instanceof Error ? err.message : String(err)));
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center pt-24">
      <h2 className="text-3xl font-bold mb-6">Virtual Try-On</h2>
      
      {step === 'clothing' ? (
        // Step 1: Clothing Upload
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4">1. Upload Clothing Item</h3>
          <p className="text-gray-600 mb-4">Upload a clear image of the clothing item you want to try on.</p>
          <input 
            type="file" 
            accept="image/*" 
            className="mb-4" 
            onChange={handleClothingChange}
            disabled={isClothingUploading} 
          />
          {clothingPreview && (
            <div className="mb-4">
              <img src={clothingPreview} alt="Clothing Item" className="w-80 h-80 object-cover rounded-xl shadow-md border" />
            </div>
          )}
          <button
            onClick={handleClothingUpload}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg shadow-md disabled:opacity-50"
            disabled={!clothingFile || isClothingUploading || !!clothingKey}
          >
            {isClothingUploading ? 'Uploading...' : clothingKey ? 'Uploaded ✓' : 'Upload Clothing'}
          </button>
          {clothingUploadStatus && (
            <div className={`mt-4 text-lg ${clothingUploadStatus.startsWith('Upload successful') ? 'text-green-600' : 'text-red-600'}`}>
              {clothingUploadStatus}
            </div>
          )}
        </div>
      ) : (
        // Step 2: Photo Upload
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4">2. Upload Your Photo</h3>
          <p className="text-gray-600 mb-4">
            Upload a full-body photo of yourself. We'll try on the {clothingType} you selected.
          </p>
          <input 
            type="file" 
            accept="image/*" 
            className="mb-4" 
            onChange={handlePhotoChange}
            disabled={isPhotoUploading} 
          />
          {photoPreview && (
            <div className="mb-4">
              <img src={photoPreview} alt="Your Photo" className="w-80 h-80 object-cover rounded-xl shadow-md border" />
            </div>
          )}
          <div className="flex gap-4">
            <button
              onClick={() => setStep('clothing')}
              className="bg-gray-600 hover:bg-gray-700 text-white px-8 py-3 rounded-lg shadow-md"
              disabled={isPhotoUploading}
            >
              Back
            </button>
            <button
              onClick={handlePhotoUpload}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg shadow-md disabled:opacity-50"
              disabled={!photoFile || isPhotoUploading || !!photoKey}
            >
              {isPhotoUploading ? 'Uploading...' : photoKey ? 'Uploaded ✓' : 'Upload Photo'}
            </button>
          </div>
          {photoUploadStatus && (
            <div className={`mt-4 text-lg ${photoUploadStatus.startsWith('Upload successful') ? 'text-green-600' : 'text-red-600'}`}>
              {photoUploadStatus}
            </div>
          )}
          
          {/* Process Image Button */}
          {photoKey && (
            <div className="mt-8">
              <button
                onClick={handleProcessImage}
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg shadow-md disabled:opacity-50"
                disabled={isProcessing}
              >
                {isProcessing ? 'Processing...' : 'Generate Try-On'}
              </button>
            </div>
          )}
        </div>
      )}
      
      {/* Processing Status */}
      {processingStatus && (
        <div className={`mb-4 text-lg ${processingStatus.startsWith('Processing successful') ? 'text-green-600' : 'text-red-600'}`}>
          {processingStatus}
        </div>
      )}
      
      {/* Processed Image */}
      {processedImageKey && (
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-4">Your Virtual Try-On Result:</h3>
          <img 
            src={getS3Url(processedImageKey)} 
            alt="AI Generated Try-On" 
            className="w-80 h-80 object-cover rounded-xl shadow-md border"
          />
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/tryon" element={<TryOnPage />} />
    </Routes>
  );
}
