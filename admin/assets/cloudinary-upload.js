export const CLOUDINARY_CONFIG = Object.freeze({
  cloudName: 'kkvhyin8',
  uploadPreset: 'sv-creative'
});

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);
const ALLOWED_IMAGE_EXTENSIONS = new Set(['jpg', 'jpeg', 'png', 'webp']);

export function validateImageFile(file) {
  if (!file || typeof file.name !== 'string') {
    throw new Error('CLOUDINARY_INVALID_FILE');
  }

  const extension = file.name.split('.').pop().toLowerCase();
  if (!ALLOWED_IMAGE_TYPES.has(file.type) || !ALLOWED_IMAGE_EXTENSIONS.has(extension)) {
    throw new Error('CLOUDINARY_INVALID_FILE');
  }
  if (file.size <= 0 || file.size > MAX_IMAGE_SIZE) {
    throw new Error('CLOUDINARY_INVALID_SIZE');
  }
}

export function isCloudinaryImageUrl(value) {
  try {
    const imageUrl = new URL(value);
    return imageUrl.protocol === 'https:' &&
      imageUrl.hostname === 'res.cloudinary.com' &&
      imageUrl.pathname.includes(`/${CLOUDINARY_CONFIG.cloudName}/image/upload/`);
  } catch {
    return false;
  }
}

export function formatImageFileSize(size) {
  if (size < 1024 * 1024) return `${Math.max(1, Math.round(size / 1024))} KB`;
  return `${(size / (1024 * 1024)).toFixed(2)} MB`;
}

export function uploadImageToCloudinary(file, { onProgress = () => {} } = {}) {
  validateImageFile(file);

  const endpoint = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloudName}/image/upload`;
  const uploadData = new FormData();
  uploadData.append('file', file);
  uploadData.append('upload_preset', CLOUDINARY_CONFIG.uploadPreset);

  return new Promise((resolve, reject) => {
    const request = new XMLHttpRequest();
    request.open('POST', endpoint);
    request.timeout = 120_000;
    onProgress(0);

    request.upload.addEventListener('progress', (event) => {
      if (event.lengthComputable) {
        onProgress(Math.min(100, Math.round((event.loaded / event.total) * 100)));
      }
    });

    request.addEventListener('load', () => {
      if (request.status < 200 || request.status >= 300) {
        reject(new Error('CLOUDINARY_UPLOAD_FAILED'));
        return;
      }

      try {
        const response = JSON.parse(request.responseText);
        if (!isCloudinaryImageUrl(response.secure_url)) {
          reject(new Error('CLOUDINARY_INVALID_URL'));
          return;
        }
        onProgress(100);
        resolve(response.secure_url);
      } catch (error) {
        reject(error.message === 'CLOUDINARY_INVALID_URL' ? error : new Error('CLOUDINARY_UPLOAD_FAILED'));
      }
    });

    request.addEventListener('error', () => reject(new Error('CLOUDINARY_UPLOAD_FAILED')));
    request.addEventListener('timeout', () => reject(new Error('CLOUDINARY_UPLOAD_FAILED')));
    request.addEventListener('abort', () => reject(new Error('CLOUDINARY_UPLOAD_FAILED')));
    request.send(uploadData);
  });
}
