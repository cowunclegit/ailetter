const fs = require('fs-extra');
const path = require('path');
const { saveThumbnail } = require('../../src/utils/image-storage');

jest.mock('fs-extra');

describe('Image Storage Utility', () => {
  const mockStoragePath = './public/thumbnails';
  
  beforeAll(() => {
    process.env.THUMBNAIL_STORAGE_PATH = mockStoragePath;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should save base64 data as a file', async () => {
    const base64Data = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==';
    const filename = 'test-image.png';
    
    fs.writeFile.mockResolvedValue(undefined);
    fs.ensureDir.mockResolvedValue(undefined);

    const resultPath = await saveThumbnail(base64Data, filename);

    expect(fs.ensureDir).toHaveBeenCalledWith(mockStoragePath);
    expect(fs.writeFile).toHaveBeenCalled();
    expect(resultPath).toContain(filename);
  });

  test('should handle invalid base64 data', async () => {
    await expect(saveThumbnail('invalid-data', 'test.jpg')).rejects.toThrow();
  });
});
