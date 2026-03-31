const SUPPORTED_IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);
const DEFAULT_MAX_BYTES = 1800 * 1024;
const DEFAULT_MAX_DIMENSION = 1600;

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ''));
    reader.onerror = () => reject(new Error('File could not be read.'));
    reader.readAsDataURL(file);
  });
}

function loadImage(dataUrl) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error('File could not be read.'));
    image.src = dataUrl;
  });
}

function canvasToBlob(canvas, type, quality) {
  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), type, quality);
  });
}

function blobToDataUrl(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ''));
    reader.onerror = () => reject(new Error('File could not be read.'));
    reader.readAsDataURL(blob);
  });
}

function ensureSupportedImage(file) {
  const mimeType = String(file?.type || '').toLowerCase();

  if (!SUPPORTED_IMAGE_TYPES.has(mimeType)) {
    throw new Error('Only JPG, PNG and WEBP images can be uploaded.');
  }
}

function calculateScaledSize(width, height, maxDimension, reductionFactor = 1) {
  const initialScale = Math.min(1, maxDimension / Math.max(width, height));
  const scale = Math.min(1, initialScale * reductionFactor);

  return {
    width: Math.max(1, Math.round(width * scale)),
    height: Math.max(1, Math.round(height * scale))
  };
}

async function compressImageDataUrl(dataUrl, options = {}) {
  const {
    maxBytes = DEFAULT_MAX_BYTES,
    maxDimension = DEFAULT_MAX_DIMENSION
  } = options;

  const image = await loadImage(dataUrl);
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');

  if (!context) {
    throw new Error('Image could not be prepared for upload.');
  }

  const attempts = [
    { type: 'image/webp', quality: 0.9, reductionFactor: 1 },
    { type: 'image/webp', quality: 0.82, reductionFactor: 0.92 },
    { type: 'image/webp', quality: 0.74, reductionFactor: 0.84 },
    { type: 'image/jpeg', quality: 0.72, reductionFactor: 0.8 },
    { type: 'image/jpeg', quality: 0.64, reductionFactor: 0.72 }
  ];

  for (const attempt of attempts) {
    const scaledSize = calculateScaledSize(image.width, image.height, maxDimension, attempt.reductionFactor);
    canvas.width = scaledSize.width;
    canvas.height = scaledSize.height;
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(image, 0, 0, canvas.width, canvas.height);

    const blob = await canvasToBlob(canvas, attempt.type, attempt.quality);

    if (blob && blob.size <= maxBytes) {
      return blobToDataUrl(blob);
    }
  }

  throw new Error('Image size cannot exceed 2 MB.');
}

export async function fileToOptimizedDataUrl(file, options = {}) {
  ensureSupportedImage(file);

  const maxBytes = Number(options.maxBytes) || DEFAULT_MAX_BYTES;
  const directDataUrl = await readFileAsDataUrl(file);

  if (file.size <= maxBytes) {
    return directDataUrl;
  }

  return compressImageDataUrl(directDataUrl, options);
}

export function getImageUploadLimitInMb(maxBytes = DEFAULT_MAX_BYTES) {
  return (Number(maxBytes) / (1024 * 1024)).toFixed(1);
}

