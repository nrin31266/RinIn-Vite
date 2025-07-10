import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "./firebaseConfig";
import { MediaUtils } from "../../utils/mediaUtils";

export const uploadVideo = async (
  file: File,
  folder: 'others' | 'posts' | 'avatars',
  authId?: string
): Promise<{ videoUrl: string; thumbnailUrl: string }> => {
  // Create thumbnail first
  const thumbnailFile = await MediaUtils.createVideoThumbnail(file);
  
  // Create paths
  const savePath = authId
    ? `rinin/users/${authId}/${folder}`
    : `rinin/${folder}`;
  
  const ext = file.name.split(".").pop();
  const timestamp = Date.now();
  
  // Upload video and thumbnail in parallel
  const [videoUrl, thumbnailUrl] = await Promise.all([
    uploadSingleFile(file, `${savePath}/video_${timestamp}.${ext}`),
    uploadSingleFile(thumbnailFile, `${savePath}/thumb_${timestamp}.webp`)
  ]);
  
  return { videoUrl, thumbnailUrl };
};

const uploadSingleFile = async (file: File, path: string): Promise<string> => {
  const fileRef = ref(storage, path);
  
  return new Promise((resolve, reject) => {
    const uploadTask = uploadBytesResumable(fileRef, file);
    
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const percent = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log(`Upload progress: ${percent.toFixed(2)}%`);
      },
      (error) => reject(error),
      async () => {
        try {
          const url = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(url);
        } catch (err) {
          reject(err);
        }
      }
    );
  });
};

export const uploadVideos = async (
  files: File[],
  folder: 'others' | 'posts' | 'avatars',
  authId?: string
): Promise<{ videoUrl: string; thumbnailUrl: string }[]> => {
  const uploadPromises = files.map(file => uploadVideo(file, folder, authId));
  return Promise.all(uploadPromises);
};
