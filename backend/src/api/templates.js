const express = require('express');
const router = express.Router();
const templateService = require('../services/templateService');

router.get('/', (req, res) => {
  const templates = templateService.getAllTemplates();
  res.json(templates);
});

module.exports = router;
