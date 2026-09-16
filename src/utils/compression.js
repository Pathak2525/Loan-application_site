import imageCompression from 'browser-image-compression';

export async function compressIfImage(file) {
  if (!file || !file.type?.startsWith('image/')) {
    return file;
  }
  try {
    const compressed = await imageCompression(file, {
      maxSizeMB: 1,
      maxWidthOrHeight: 1600,
      useWebWorker: true,
      initialQuality: 0.8,
    });

    return new File([compressed], file.name, { type: compressed.type });
  } catch (err) {
    console.warn('Image compression failed, using original file:', err);
    return file;
  }
}

export function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function formatBytes(bytes) {
  if (!bytes) return '0 KB';
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(0)} KB`;
  return `${(kb / 1024).toFixed(2)} MB`;
}
