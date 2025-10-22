const imageProcessor = require('../services/imageProcessor');
const archiver = require('archiver');
const path = require('path');
const fs = require('fs');
const db = require('../config/database');

// Process uploaded images
exports.processImages = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No files uploaded'
      });
    }

    const { quality = 85, format = 'webp' } = req.body;

    // Validate quality
    const qualityNum = parseInt(quality);
    if (isNaN(qualityNum) || qualityNum < 1 || qualityNum > 100) {
      return res.status(400).json({
        success: false,
        message: 'Quality must be between 1 and 100'
      });
    }

    // Validate format
    const allowedFormats = ['webp', 'jpeg', 'jpg', 'png', 'avif'];
    if (!allowedFormats.includes(format.toLowerCase())) {
      return res.status(400).json({
        success: false,
        message: 'Invalid format. Allowed: webp, jpeg, png, avif'
      });
    }

    // Process images
    const results = await imageProcessor.processMultipleImages(req.files, {
      quality: qualityNum,
      format: format.toLowerCase(),
      maxWidth: 1920
    });

    // Calculate total savings
    const totalOriginalSize = results.reduce((sum, r) => sum + (r.originalSize || 0), 0);
    const totalOptimizedSize = results.reduce((sum, r) => sum + (r.optimizedSize || 0), 0);
    const totalSavedBytes = totalOriginalSize - totalOptimizedSize;
    const totalSavedPercentage = totalOriginalSize > 0 
      ? ((totalSavedBytes / totalOriginalSize) * 100).toFixed(2)
      : 0;

    // Log processing to database (optional)
    for (const result of results) {
      if (result.success) {
        try {
          await db.query(
            'INSERT INTO processing_logs (user_id, original_filename, original_size, optimized_size, format, quality) VALUES (?, ?, ?, ?, ?, ?)',
            [req.user.id, result.originalFilename, result.originalSize, result.optimizedSize, format, qualityNum]
          );
        } catch (dbError) {
          console.error('Failed to log processing:', dbError);
          // Continue even if logging fails
        }
      }
    }

    res.json({
      success: true,
      message: 'Images processed successfully',
      results,
      summary: {
        totalFiles: results.length,
        successCount: results.filter(r => r.success).length,
        failureCount: results.filter(r => !r.success).length,
        totalOriginalSize,
        totalOptimizedSize,
        totalSavedBytes,
        totalSavedPercentage: parseFloat(totalSavedPercentage),
        totalOriginalSizeFormatted: imageProcessor.formatFileSize(totalOriginalSize),
        totalOptimizedSizeFormatted: imageProcessor.formatFileSize(totalOptimizedSize),
        totalSavedFormatted: imageProcessor.formatFileSize(totalSavedBytes)
      }
    });
  } catch (error) {
    console.error('Process images error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process images',
      error: error.message
    });
  }
};

// Download single optimized image
exports.downloadImage = async (req, res) => {
  try {
    const { filename } = req.params;
    const uploadPath = process.env.UPLOAD_PATH || './uploads';
    const filePath = path.join(uploadPath, filename);
    
    console.log(`📥 Single file download requested: ${filename}`);

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: 'File not found'
      });
    }

    // Send file
    res.download(filePath, filename, async (err) => {
      if (err) {
        console.error('❌ Download error:', err);
        if (!res.headersSent) {
          res.status(500).json({
            success: false,
            message: 'Failed to download file'
          });
        }
      } else {
        console.log('✅ Download completed, starting cleanup...');
        // Delete file after successful download (optimized + original)
        try {
          const filesToDelete = [filePath];
          
          // Find and delete the original file too
          const match = filename.match(/^(.+)-optimized\.\w+$/);
          if (match) {
            const baseName = match[1];
            const allFiles = fs.readdirSync(uploadPath);
            const originalFile = allFiles.find(file => 
              file.startsWith(baseName) && !file.includes('-optimized')
            );
            
            if (originalFile) {
              const originalPath = path.join(uploadPath, originalFile);
              if (fs.existsSync(originalPath)) {
                filesToDelete.push(originalPath);
                console.log(`➕ Found matching original: ${originalFile}`);
              }
            }
          }
          
          await imageProcessor.deleteFiles(filesToDelete);
          console.log(`✅ Cleaned up ${filesToDelete.length} files after download`);
        } catch (deleteError) {
          console.error('❌ Failed to delete file after download:', deleteError);
        }
      }
    });
  } catch (error) {
    console.error('❌ Download image error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to download image'
    });
  }
};

// Download all images as ZIP
exports.downloadAllAsZip = async (req, res) => {
  try {
    const { filenames } = req.body;
    console.log('📦 ZIP download requested for', filenames.length, 'files');

    if (!filenames || !Array.isArray(filenames) || filenames.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No filenames provided'
      });
    }

    // Set response headers for ZIP download
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', `attachment; filename=optimized-images-${Date.now()}.zip`);

    // Create ZIP archive
    const archive = archiver('zip', {
      zlib: { level: 9 } // Maximum compression
    });

    // Handle errors
    archive.on('error', (err) => {
      console.error('Archive error:', err);
      res.status(500).json({
        success: false,
        message: 'Failed to create ZIP archive'
      });
    });

    // Pipe archive to response
    archive.pipe(res);

    // Collect file paths for cleanup (optimized + originals)
    const filePaths = [];
    const uploadPath = process.env.UPLOAD_PATH || './uploads';

    // Add files to archive
    for (const filename of filenames) {
      const filePath = path.join(uploadPath, filename);
      
      if (fs.existsSync(filePath)) {
        archive.file(filePath, { name: filename });
        filePaths.push(filePath);
      }
    }

    // Also collect original files for deletion
    // Original files don't have '-optimized' in their name
    // We need to scan the uploads directory for matching original files
    try {
      const allFiles = fs.readdirSync(uploadPath);
      console.log(`🔍 Found ${allFiles.length} files in uploads directory`);
      
      for (const optimizedFilename of filenames) {
        // Extract the base name (remove -optimized.ext)
        const match = optimizedFilename.match(/^(.+)-optimized\.\w+$/);
        if (match) {
          const baseName = match[1]; // e.g., "1760697125354-520574130"
          
          // Find any file that starts with this base name and doesn't have -optimized
          const originalFile = allFiles.find(file => 
            file.startsWith(baseName) && !file.includes('-optimized')
          );
          
          if (originalFile) {
            const originalPath = path.join(uploadPath, originalFile);
            if (fs.existsSync(originalPath) && !filePaths.includes(originalPath)) {
              filePaths.push(originalPath);
              console.log(`➕ Added original file to cleanup: ${originalFile}`);
            }
          }
        }
      }
    } catch (err) {
      console.error('Error finding original files:', err);
      // Continue even if we can't find originals
    }

    console.log(`🗑️ Total files to delete after download: ${filePaths.length}`);

    // Delete files after ZIP is sent (both optimized and originals)
    res.on('finish', async () => {
      console.log('🎯 Response finished, starting cleanup...');
      try {
        await imageProcessor.deleteFiles(filePaths);
        console.log(`✅ Cleaned up ${filePaths.length} files after ZIP download`);
      } catch (deleteError) {
        console.error('❌ Failed to delete files after ZIP download:', deleteError);
      }
    });

    // Finalize archive (this triggers the streaming)
    await archive.finalize();
  } catch (error) {
    console.error('Download ZIP error:', error);
    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        message: 'Failed to create ZIP download'
      });
    }
  }
};

// Delete uploaded/processed files manually
exports.deleteFiles = async (req, res) => {
  try {
    const { filenames } = req.body;

    if (!filenames || !Array.isArray(filenames) || filenames.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No filenames provided'
      });
    }

    const filePaths = filenames.map(filename => 
      path.join(process.env.UPLOAD_PATH || './uploads', filename)
    );

    await imageProcessor.deleteFiles(filePaths);

    res.json({
      success: true,
      message: 'Files deleted successfully'
    });
  } catch (error) {
    console.error('Delete files error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete files'
    });
  }
};

// Get format capabilities
exports.getCapabilities = async (req, res) => {
  try {
    const capabilities = imageProcessor.getFormatCapabilities();
    
    res.json({
      success: true,
      capabilities: {
        formats: capabilities,
        maxFileSize: parseInt(process.env.MAX_FILE_SIZE) || 10485760,
        maxFiles: parseInt(process.env.MAX_FILES) || 20,
        supportedInputFormats: ['jpeg', 'jpg', 'png', 'gif', 'webp', 'avif']
      }
    });
  } catch (error) {
    console.error('Get capabilities error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get capabilities'
    });
  }
};

