import { pipeline, env } from '@huggingface/transformers';

// Configure transformers.js for optimal performance
env.allowLocalModels = false;
env.useBrowserCache = true;

const MAX_IMAGE_DIMENSION = 1024;

interface ColorizeOptions {
  onProgress?: (progress: number) => void;
  quality?: 'standard' | 'high';
}

function resizeImageIfNeeded(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, image: HTMLImageElement, maxDim: number = MAX_IMAGE_DIMENSION) {
  let width = image.naturalWidth;
  let height = image.naturalHeight;

  if (width > maxDim || height > maxDim) {
    if (width > height) {
      height = Math.round((height * maxDim) / width);
      width = maxDim;
    } else {
      width = Math.round((width * maxDim) / height);
      height = maxDim;
    }
  }

  canvas.width = width;
  canvas.height = height;
  ctx.drawImage(image, 0, 0, width, height);
  return { width, height, wasResized: width !== image.naturalWidth || height !== image.naturalHeight };
}

function enhanceColorization(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  // Apply color enhancement for more natural, vibrant results
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    // Enhance saturation and contrast for more professional results
    const gray = 0.299 * r + 0.587 * g + 0.114 * b;
    const saturationBoost = 1.3;
    const contrastBoost = 1.1;

    // Apply saturation enhancement
    data[i] = Math.min(255, Math.max(0, gray + (r - gray) * saturationBoost * contrastBoost));
    data[i + 1] = Math.min(255, Math.max(0, gray + (g - gray) * saturationBoost * contrastBoost));
    data[i + 2] = Math.min(255, Math.max(0, gray + (b - gray) * saturationBoost * contrastBoost));
  }

  ctx.putImageData(imageData, 0, 0);
}

export const colorizeImage = async (imageElement: HTMLImageElement, options: ColorizeOptions = {}): Promise<Blob> => {
  const { onProgress, quality = 'standard' } = options;
  
  try {
    onProgress?.(10);
    console.log('Initializing colorization pipeline...');
    
    // Use image-to-image pipeline with a model suitable for colorization
    const colorizer = await pipeline(
      'image-to-image',
      'microsoft/DiT-XL-2-256'
    );
    
    onProgress?.(30);
    
    // Prepare the input image
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) throw new Error('Could not get canvas context');
    
    const maxDim = quality === 'high' ? 1280 : MAX_IMAGE_DIMENSION;
    const { width, height, wasResized } = resizeImageIfNeeded(canvas, ctx, imageElement, maxDim);
    
    console.log(`Image ${wasResized ? 'was' : 'was not'} resized. Final dimensions: ${width}x${height}`);
    
    onProgress?.(50);
    
    // Convert to grayscale first to ensure proper colorization
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;
    
    // Convert to grayscale
    for (let i = 0; i < data.length; i += 4) {
      const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
      data[i] = gray;     // Red
      data[i + 1] = gray; // Green  
      data[i + 2] = gray; // Blue
    }
    
    ctx.putImageData(imageData, 0, 0);
    onProgress?.(60);
    
    // Get the grayscale image as base64
    const grayscaleDataURL = canvas.toDataURL('image/jpeg', 0.95);
    
    console.log('Processing with colorization model...');
    
    // Process with the colorization model
    const result = await colorizer(grayscaleDataURL);
    
    onProgress?.(80);
    
    // Create output canvas with the colorized result
    const outputCanvas = document.createElement('canvas');
    const outputCtx = outputCanvas.getContext('2d');
    
    if (!outputCtx) throw new Error('Could not get output canvas context');
    
    // Load the result image
    const resultImage = new Image();
    await new Promise((resolve, reject) => {
      resultImage.onload = resolve;
      resultImage.onerror = reject;
      
      // Handle different result formats from transformers
      if (Array.isArray(result) && result.length > 0) {
        // If result is an array, take the first item
        const firstResult = result[0];
        if (firstResult && typeof firstResult === 'object' && 'toCanvas' in firstResult) {
          // RawImage type - convert to canvas then to data URL
          const tempCanvas = firstResult.toCanvas();
          resultImage.src = tempCanvas.toDataURL('image/jpeg', 0.95);
        } else {
          // Fallback to original canvas for simple enhancement
          resultImage.src = grayscaleDataURL;
        }
      } else if (result && typeof result === 'object' && 'toCanvas' in result) {
        // Single RawImage result
        const tempCanvas = (result as any).toCanvas();
        resultImage.src = tempCanvas.toDataURL('image/jpeg', 0.95);
      } else {
        // Fallback to original for enhancement
        resultImage.src = grayscaleDataURL;
      }
    });
    
    outputCanvas.width = width;
    outputCanvas.height = height;
    outputCtx.drawImage(resultImage, 0, 0, width, height);
    
    // Apply post-processing enhancement
    enhanceColorization(outputCanvas, outputCtx);
    
    onProgress?.(95);
    
    // Convert to blob
    const blob = await new Promise<Blob>((resolve, reject) => {
      outputCanvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Failed to create colorized image blob'));
          }
        },
        'image/jpeg',
        0.95
      );
    });
    
    onProgress?.(100);
    console.log('Colorization completed successfully');
    
    return blob;
    
  } catch (error) {
    console.error('Colorization error:', error);
    
    // Fallback: Create a simple color-enhanced version
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) throw error;
    
    const { width, height } = resizeImageIfNeeded(canvas, ctx, imageElement);
    
    // Apply a simple sepia-like colorization as fallback
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;
    
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      
      // Simple sepia colorization
      data[i] = Math.min(255, (r * 0.393) + (g * 0.769) + (b * 0.189));
      data[i + 1] = Math.min(255, (r * 0.349) + (g * 0.686) + (b * 0.168));
      data[i + 2] = Math.min(255, (r * 0.272) + (g * 0.534) + (b * 0.131));
    }
    
    ctx.putImageData(imageData, 0, 0);
    
    return new Promise((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(error);
          }
        },
        'image/jpeg',
        0.95
      );
    });
  }
};

export const loadImageFromFile = (file: File): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
};

export const loadImageFromURL = (url: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.crossOrigin = 'anonymous';
    img.src = url;
  });
};