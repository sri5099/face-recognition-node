"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "FaceRecognitionService", {
  enumerable: true,
  get: function get() {
    return _FaceRecognitionService["default"];
  }
});
Object.defineProperty(exports, "useFaceRecognition", {
  enumerable: true,
  get: function get() {
    return _useFaceRecognition.useFaceRecognition;
  }
});
var _FaceRecognitionService = _interopRequireDefault(require("./services/FaceRecognitionService"));
var _useFaceRecognition = require("./hooks/useFaceRecognition");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }