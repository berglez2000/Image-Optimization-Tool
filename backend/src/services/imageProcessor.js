const sharp = require('sharp');
const path = require('path');
const fs = require('fs').promises;

class ImageProcessor {
  /**
   * Process a single image
   * @param {String} inputPath - Path to input image
   * @param {Object} options - Processing options
   * @param {Number} options.quality - Quality (1-100)
   * @param {String} options.format - Output format (webp, jpeg, png)
   * @param {Number} options.maxWidth - Maximum width (default: 1920)
   * @returns {Object} - Processing result with file info
   */
  async processImage(inputPath, options = {}) {
    try {
      const {
        quality = 85,
        format = 'webp',
        maxWidth = 1920
      } = options;

      // Get original file stats
      const originalStats = await fs.stat(inputPath);
      const originalSize = originalStats.size;

      // Get image metadata
      const metadata = await sharp(inputPath).metadata();

      // Determine output filename
      const parsedPath = path.parse(inputPath);
      const outputFilename = `${parsedPath.name}-optimized.${format}`;
      const outputPath = path.join(parsedPath.dir, outputFilename);

      // Start processing pipeline
      let pipeline = sharp(inputPath);

      // Auto-resize if width > maxWidth
      if (metadata.width > maxWidth) {
        pipeline = pipeline.resize(maxWidth, null, {
          fit: 'inside',
          withoutEnlargement: true
        });
      }

      // Strip metadata for smaller file size
      pipeline = pipeline.withMetadata({
        orientation: metadata.orientation // Keep orientation only
      });

      // Convert to specified format with quality
      switch (format.toLowerCase()) {
        case 'webp':
          pipeline = pipeline.webp({ 
            quality: parseInt(quality),
            effort: 4 // Compression effort (0-6, higher = smaller but slower)
          });
          break;
        case 'jpeg':
        case 'jpg':
          pipeline = pipeline.jpeg({ 
            quality: parseInt(quality),
            mozjpeg: true // Use mozjpeg for better compression
          });
          break;
        case 'png':
          pipeline = pipeline.png({ 
            quality: parseInt(quality),
            compressionLevel: 9
          });
          break;
        default:
          pipeline = pipeline.webp({ quality: parseInt(quality) });
      }

      // Save optimized image
      await pipeline.toFile(outputPath);

      // Get optimized file stats
      const optimizedStats = await fs.stat(outputPath);
      const optimizedSize = optimizedStats.size;

      // Calculate savings
      const savedBytes = originalSize - optimizedSize;
      const savedPercentage = ((savedBytes / originalSize) * 100).toFixed(2);

      return {
        success: true,
        originalPath: inputPath,
        optimizedPath: outputPath,
        originalFilename: path.basename(inputPath),
        optimizedFilename: outputFilename,
        originalSize,
        optimizedSize,
        savedBytes,
        savedPercentage: parseFloat(savedPercentage),
        format,
        quality,
        dimensions: {
          original: {
            width: metadata.width,
            height: metadata.height
          },
          optimized: {
            width: metadata.width > maxWidth ? maxWidth : metadata.width,
            height: metadata.width > maxWidth 
              ? Math.round((maxWidth / metadata.width) * metadata.height)
              : metadata.height
          }
        }
      };
    } catch (error) {
      console.error('Image processing error:', error);
      throw new Error(`Failed to process image: ${error.message}`);
    }
  }

  /**
   * Process multiple images
   * @param {Array} files - Array of file objects from multer
   * @param {Object} options - Processing options
   * @returns {Array} - Array of processing results
   */
  async processMultipleImages(files, options = {}) {
    const results = [];
    
    for (const file of files) {
      try {
        const result = await this.processImage(file.path, options);
        results.push(result);
      } catch (error) {
        results.push({
          success: false,
          originalFilename: file.originalname,
          error: error.message
        });
      }
    }

    return results;
  }

  /**
   * Delete files
   * @param {Array} filePaths - Array of file paths to delete
   */
  async deleteFiles(filePaths) {
    for (const filePath of filePaths) {
      try {
        await fs.unlink(filePath);
      } catch (error) {
        console.error(`Failed to delete file ${filePath}:`, error);
      }
    }
  }

  /**
   * Format file size for display
   * @param {Number} bytes - File size in bytes
   * @returns {String} - Formatted file size
   */
  formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  }
}

module.exports = new ImageProcessor();

