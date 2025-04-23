const multer = require('multer');
const config = require('../config/config');

const upload = multer({
  dest: config.upload.directory,
  limits: config.upload.limits
});

module.exports = upload;