const fs = require('fs-extra');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const saveThumbnail = async (base64Data, filename) => {
  if (!base64Data || !base64Data.includes('base64,')) {
    throw new Error('Invalid base64 data');
  }

  const storagePath = process.env.THUMBNAIL_STORAGE_PATH || './public/thumbnails';
  await fs.ensureDir(storagePath);

  const base64Content = base64Data.split(';base64,').pop();
  const buffer = Buffer.from(base64Content, 'base64');
  
  const finalFilename = filename || `${uuidv4()}.jpg`;
  const filePath = path.join(storagePath, finalFilename);
  
  await fs.writeFile(filePath, buffer);
  
  // Return the relative path for the DB
  return path.join('/thumbnails', finalFilename);
};

module.exports = {
  saveThumbnail
};
