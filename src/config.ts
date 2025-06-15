// Load environment variables
const config = {
  s3Bucket: import.meta.env.VITE_S3_BUCKET || '',
  awsRegion: import.meta.env.VITE_AWS_REGION || '',
};

// Make config available globally
window.env = {
  REACT_APP_S3_BUCKET: config.s3Bucket,
  REACT_APP_AWS_REGION: config.awsRegion,
};

export default config; 