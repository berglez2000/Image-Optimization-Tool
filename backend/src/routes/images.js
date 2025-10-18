const express = require('express');
const router = express.Router();
const imageController = require('../controllers/imageController');
const authMiddleware = require('../middleware/auth');
const upload = require('../middleware/upload');

// @route   POST /api/images/process
// @desc    Upload and process images
// @access  Private
router.post(
  '/process',
  authMiddleware,
  upload.array('images', parseInt(process.env.MAX_FILES) || 20),
  imageController.processImages
);

// @route   GET /api/images/download/:filename
// @desc    Download single optimized image
// @access  Private
router.get(
  '/download/:filename',
  authMiddleware,
  imageController.downloadImage
);

// @route   POST /api/images/download-zip
// @desc    Download all images as ZIP
// @access  Private
router.post(
  '/download-zip',
  authMiddleware,
  imageController.downloadAllAsZip
);

// @route   DELETE /api/images/delete
// @desc    Delete files
// @access  Private
router.delete(
  '/delete',
  authMiddleware,
  imageController.deleteFiles
);

module.exports = router;

