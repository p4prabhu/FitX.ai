import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';

const PhotoUpload = () => {
  const [preview, setPreview] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png']
    },
    maxFiles: 1
  });

  return (
    <div className="w-full">
      <div
        {...getRootProps()}
        className={`bg-background border-2 border-dashed rounded-2xl shadow-lg p-8 flex flex-col items-center justify-center transition-colors duration-200 cursor-pointer min-h-[300px] max-w-md mx-auto
          ${isDragActive ? 'border-primary bg-[#f0f0f0]' : 'border-secondary hover:border-primary hover:bg-[#fafafa]'}`}
      >
        <input {...getInputProps()} />
        {preview ? (
          <div className="space-y-4 w-full flex flex-col items-center">
            <img
              src={preview}
              alt="Preview"
              className="max-h-60 rounded-xl shadow-md border border-secondary"
            />
            <button className="mt-2 px-4 py-2 bg-primary text-background rounded-lg font-semibold hover:bg-secondary hover:text-primary transition-colors">
              Change Photo
            </button>
          </div>
        ) : (
          <div className="space-y-4 flex flex-col items-center">
            <svg
              className="mx-auto h-16 w-16 text-secondary"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48"
              aria-hidden="true"
            >
              <path
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <p className="text-lg font-semibold text-primary">Upload your photo</p>
            <p className="text-sm text-secondary">Click or drag and drop (PNG, JPG, JPEG up to 10MB)</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PhotoUpload; 