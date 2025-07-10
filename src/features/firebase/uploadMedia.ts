import { uploadImages } from "./uploadImage";
import { uploadVideos } from "./uploadVideo";
import { MediaUtils } from "../../utils/mediaUtils";

export interface MediaFile {
  file: File;
  type: 'IMAGE' | 'VIDEO';
  width?: number;
  height?: number;
  duration?: number;
}

export interface UploadedMedia {
  mediaUrl: string;
  thumbnailUrl?: string;
  mediaType: 'IMAGE' | 'VIDEO';
  width: number;
  height: number;
  duration?: number;
}

export const uploadMixedMedia = async (
  mediaFiles: MediaFile[],
  folder: 'others' | 'posts' | 'avatars',
  authId?: string
): Promise<UploadedMedia[]> => {
  // Separate images and videos
  const imageFiles = mediaFiles.filter(mf => mf.type === 'IMAGE');
  const videoFiles = mediaFiles.filter(mf => mf.type === 'VIDEO');
  
  // Upload images and videos separately
  const [imageResults, videoResults] = await Promise.all([
    imageFiles.length > 0 ? uploadImages(imageFiles.map(mf => mf.file), folder, authId) : [],
    videoFiles.length > 0 ? uploadVideos(videoFiles.map(mf => mf.file), folder, authId) : []
  ]);
  
  // Map results back to original order
  const results: UploadedMedia[] = [];
  let imageIndex = 0;
  let videoIndex = 0;
  
  for (const mediaFile of mediaFiles) {
    if (mediaFile.type === 'IMAGE') {
      results.push({
        mediaUrl: imageResults[imageIndex],
        mediaType: 'IMAGE',
        width: mediaFile.width || 0,
        height: mediaFile.height || 0
      });
      imageIndex++;
    } else {
      const videoResult = videoResults[videoIndex];
      results.push({
        mediaUrl: videoResult.videoUrl,
        thumbnailUrl: videoResult.thumbnailUrl,
        mediaType: 'VIDEO',
        width: mediaFile.width || 0,
        height: mediaFile.height || 0,
        duration: mediaFile.duration
      });
      videoIndex++;
    }
  }
  
  return results;
};

// Helper function to get media metadata
export const getMediaMetadata = async (file: File): Promise<MediaFile> => {
  const isImage = file.type.startsWith('image/');
  const isVideo = file.type.startsWith('video/');
  
  if (isImage) {
    const { width, height } = await MediaUtils.getImageDimensions(file);
    return {
      file,
      type: 'IMAGE',
      width,
      height
    };
  } else if (isVideo) {
    const { width, height, duration } = await MediaUtils.getVideoDimensions(file);
    return {
      file,
      type: 'VIDEO',
      width,
      height,
      duration
    };
  } else {
    throw new Error('Unsupported file type');
  }
};
