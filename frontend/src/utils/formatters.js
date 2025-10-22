// Format file size from bytes to human readable format
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

// Get quality description based on value
export const getQualityDescription = (quality) => {
  if (quality >= 90) {
    return {
      level: 'Maximum Quality',
      description: 'Minimal compression, larger file sizes. Best for high-quality prints and detailed images.',
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      icon: '🟢'
    };
  } else if (quality >= 70) {
    return {
      level: 'Recommended',
      description: 'Excellent visual quality with good compression. Best for websites, social media, and most use cases.',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
      icon: '🟡'
    };
  } else {
    return {
      level: 'High Compression',
      description: 'Noticeable quality loss with smallest file sizes. Best for thumbnails and previews.',
      color: 'text-red-600',
      bgColor: 'bg-red-100',
      icon: '🔴'
    };
  }
};

// Validate file type
export const isValidImageFile = (file) => {
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/avif'];
  return validTypes.includes(file.type);
};

// Validate file size (10MB max)
export const isValidFileSize = (file, maxSize = 10485760) => {
  return file.size <= maxSize;
};

// Download blob as file
export const downloadBlob = (blob, filename) => {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

