import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useDropzone } from 'react-dropzone';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCloudUploadAlt, 
  faSignOutAlt, 
  faDownload, 
  faTrash,
  faCheckCircle,
  faTimesCircle,
  faSpinner,
  faFileArchive
} from '@fortawesome/free-solid-svg-icons';
import { imageAPI } from '../services/api';
import { 
  formatFileSize, 
  getQualityDescription, 
  isValidImageFile, 
  isValidFileSize,
  downloadBlob 
} from '../utils/formatters';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  
  const [files, setFiles] = useState([]);
  const [quality, setQuality] = useState(85);
  const [format, setFormat] = useState('webp');
  const [processing, setProcessing] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');

  const qualityInfo = getQualityDescription(quality);

  // Dropzone configuration
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    },
    maxFiles: 20,
    onDrop: (acceptedFiles, rejectedFiles) => {
      setError('');
      
      // Validate files
      const validFiles = acceptedFiles.filter(file => {
        if (!isValidImageFile(file)) {
          setError(`${file.name} is not a valid image file`);
          return false;
        }
        if (!isValidFileSize(file)) {
          setError(`${file.name} exceeds 10MB limit`);
          return false;
        }
        return true;
      });

      if (rejectedFiles.length > 0) {
        setError('Some files were rejected. Please check file types and sizes.');
      }

      setFiles(validFiles);
      setResults(null); // Clear previous results
    }
  });

  const handleProcess = async () => {
    if (files.length === 0) {
      setError('Please select files to upload');
      return;
    }

    setProcessing(true);
    setError('');

    try {
      const formData = new FormData();
      files.forEach(file => {
        formData.append('images', file);
      });
      formData.append('quality', quality);
      formData.append('format', format);

      const response = await imageAPI.processImages(formData);
      setResults(response.data);
      setFiles([]); // Clear selected files
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to process images');
    } finally {
      setProcessing(false);
    }
  };

  const handleDownloadSingle = async (filename, originalFilename) => {
    try {
      const response = await imageAPI.downloadImage(filename);
      downloadBlob(response.data, filename);
    } catch (err) {
      setError('Failed to download file');
    }
  };

  const handleDownloadAll = async () => {
    try {
      const filenames = results.results
        .filter(r => r.success)
        .map(r => r.optimizedFilename);

      const response = await imageAPI.downloadAllAsZip(filenames);
      downloadBlob(response.data, `optimized-images-${Date.now()}.zip`);
      
      // Clear results after download
      setResults(null);
    } catch (err) {
      setError('Failed to download ZIP');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Header */}
      <div className="navbar bg-base-100 shadow-lg">
        <div className="flex-1">
          <h1 className="text-2xl font-bold ml-4">Image Optimizer</h1>
        </div>
        <div className="flex-none gap-2">
          <div className="text-sm text-gray-600 mr-4">
            {user?.email}
          </div>
          <button onClick={handleLogout} className="btn btn-ghost btn-sm">
            <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
            Logout
          </button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Error Alert */}
        {error && (
          <div className="alert alert-error mb-6">
            <FontAwesomeIcon icon={faTimesCircle} />
            <span>{error}</span>
          </div>
        )}

        {/* Settings Panel */}
        <div className="card bg-base-100 shadow-xl mb-6">
          <div className="card-body">
            <h2 className="card-title text-2xl mb-4">Processing Settings</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Quality Slider */}
              <div>
                <label className="label">
                  <span className="label-text font-semibold">Quality: {quality}</span>
                </label>
                <input
                  type="range"
                  min="1"
                  max="100"
                  value={quality}
                  onChange={(e) => setQuality(parseInt(e.target.value))}
                  className="range range-primary"
                />
                <div className="w-full flex justify-between text-xs px-2 mt-2">
                  <span>1</span>
                  <span>50</span>
                  <span>100</span>
                </div>

                {/* Quality Info */}
                <div className={`mt-4 p-4 rounded-lg ${qualityInfo.bgColor}`}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">{qualityInfo.icon}</span>
                    <span className={`font-bold ${qualityInfo.color}`}>
                      {qualityInfo.level}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700">{qualityInfo.description}</p>
                </div>
              </div>

              {/* Format Selection */}
              <div>
                <label className="label">
                  <span className="label-text font-semibold">Output Format</span>
                </label>
                <select
                  className="select select-bordered w-full"
                  value={format}
                  onChange={(e) => setFormat(e.target.value)}
                >
                  <option value="webp">WebP (Recommended)</option>
                  <option value="jpeg">JPEG</option>
                  <option value="png">PNG</option>
                </select>

                {/* Additional Info */}
                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2">Auto-resize enabled</h4>
                  <p className="text-sm text-gray-700">
                    Images wider than 1920px will be automatically resized while maintaining aspect ratio.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Upload Area */}
        {!results && (
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title text-2xl mb-4">Upload Images</h2>
              
              {/* Dropzone */}
              <div
                {...getRootProps()}
                className={`group border-4 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all ${
                  isDragActive
                    ? 'border-primary bg-primary/10'
                    : 'border-gray-300 hover:border-primary hover:bg-gray-50'
                }`}
              >
                <input {...getInputProps()} />
                <FontAwesomeIcon
                  icon={faCloudUploadAlt}
                  className="text-6xl text-gray-400 group-hover:text-primary transition-colors mb-4"
                />
                {isDragActive ? (
                  <p className="text-xl font-semibold text-primary">Drop files here...</p>
                ) : (
                  <>
                    <p className="text-xl font-semibold text-gray-200 group-hover:text-gray-900 transition-colors mb-2">
                      Drag & drop images here
                    </p>
                    <p className="text-gray-400 group-hover:text-gray-800 transition-colors">or click to select files</p>
                    <p className="text-sm text-gray-400 group-hover:text-gray-600 transition-colors mt-4">
                      Max 10MB per file • Up to 20 files • JPEG, PNG, GIF, WebP
                    </p>
                  </>
                )}
              </div>

              {/* Selected Files */}
              {files.length > 0 && (
                <div className="mt-6">
                  <h3 className="font-semibold text-lg mb-3">
                    Selected Files ({files.length})
                  </h3>
                  <div className="space-y-2">
                    {files.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <p className="font-medium">{file.name}</p>
                          <p className="text-sm text-gray-500">{formatFileSize(file.size)}</p>
                        </div>
                        <button
                          onClick={() => setFiles(files.filter((_, i) => i !== index))}
                          className="btn btn-ghost btn-sm text-error"
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Process Button */}
                  <button
                    onClick={handleProcess}
                    disabled={processing}
                    className={`btn btn-primary btn-lg w-full mt-6 ${processing ? 'loading' : ''}`}
                  >
                    {processing ? (
                      <>
                        <FontAwesomeIcon icon={faSpinner} className="animate-spin mr-2" />
                        Processing...
                      </>
                    ) : (
                      'Process Images'
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Results */}
        {results && (
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <div className="flex items-center justify-between mb-6">
                <h2 className="card-title text-2xl">Processing Complete!</h2>
                <button
                  onClick={() => setResults(null)}
                  className="btn btn-ghost btn-sm"
                >
                  Process More Images
                </button>
              </div>

              {/* Summary Stats */}
              <div className="stats stats-vertical lg:stats-horizontal shadow mb-6">
                <div className="stat">
                  <div className="stat-title">Total Files</div>
                  <div className="stat-value text-primary">{results.summary.totalFiles}</div>
                </div>
                <div className="stat">
                  <div className="stat-title">Space Saved</div>
                  <div className="stat-value text-success">{results.summary.totalSavedPercentage}%</div>
                  <div className="stat-desc">{results.summary.totalSavedFormatted} saved</div>
                </div>
                <div className="stat">
                  <div className="stat-title">Total Size</div>
                  <div className="stat-value text-sm">{results.summary.totalOptimizedSizeFormatted}</div>
                  <div className="stat-desc">From {results.summary.totalOriginalSizeFormatted}</div>
                </div>
              </div>

              {/* Download All Button */}
              <button
                onClick={handleDownloadAll}
                className="btn btn-primary btn-lg w-full mb-6"
              >
                <FontAwesomeIcon icon={faFileArchive} className="mr-2" />
                Download All as ZIP
              </button>

              {/* Individual Files */}
              <div className="space-y-3">
                {results.results.map((result, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg ${
                      result.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
                    }`}
                  >
                    {result.success ? (
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <FontAwesomeIcon icon={faCheckCircle} className="text-green-600" />
                            <p className="font-semibold">{result.originalFilename}</p>
                          </div>
                          <div className="text-sm text-gray-600 space-y-1">
                            <p>
                              {formatFileSize(result.originalSize)} → {formatFileSize(result.optimizedSize)}
                              <span className="ml-2 font-semibold text-green-600">
                                ({result.savedPercentage}% saved)
                              </span>
                            </p>
                            <p>
                              {result.dimensions.original.width}x{result.dimensions.original.height} → 
                              {result.dimensions.optimized.width}x{result.dimensions.optimized.height}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleDownloadSingle(result.optimizedFilename, result.originalFilename)}
                          className="btn btn-success btn-sm"
                        >
                          <FontAwesomeIcon icon={faDownload} className="mr-2" />
                          Download
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <FontAwesomeIcon icon={faTimesCircle} className="text-red-600" />
                        <div>
                          <p className="font-semibold">{result.originalFilename}</p>
                          <p className="text-sm text-red-600">{result.error}</p>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

