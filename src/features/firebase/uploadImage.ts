import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "./firebaseConfig";
import Resizer from "react-image-file-resizer";

const resizeImage = (file: File): Promise<File> => {
  return new Promise<File>((resolve) => {
    Resizer.imageFileResizer(
      file,
      1080,
      720,
      "WEBP",
      80,
      0,
      (resizedFile) => resolve(resizedFile as File),
      "file"
    );
  });
};

export const uploadImage = async (
  file: File,
  folder: 'others' | 'posts' | 'avatars',
  authId?: string
): Promise<string> => {
  // Resize image before upload
  const resizedFile = await resizeImage(file);
  
  // Create file path
  const savePath = authId
    ? `rinin/users/${authId}/${folder}`
    : `rinin/${folder}`;
  
  const ext = resizedFile.name.split(".").pop();
  const fileName = `${Date.now()}_image.${ext}`;
  const fileRef = ref(storage, `${savePath}/${fileName}`);
  
  // Upload and return URL
  return new Promise((resolve, reject) => {
    const uploadTask = uploadBytesResumable(fileRef, resizedFile);
    
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const percent = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log(`Image upload: ${percent.toFixed(2)}%`);
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

export const uploadImages = async (
  files: File[],
  folder: 'others' | 'posts' | 'avatars',
  authId?: string
): Promise<string[]> => {
  const uploadPromises = files.map(file => uploadImage(file, folder, authId));
  return Promise.all(uploadPromises);
};
