"use strict";

var multer = require('multer');
var config = require('../config/config');
var upload = multer({
  dest: config.upload.directory,
  limits: config.upload.limits
});
module.exports = upload;