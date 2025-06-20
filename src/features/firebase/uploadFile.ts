import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "./firebaseConfig";

type UploadCallbacks = {
  onProgress?: (fileIndex: number, percent: number) => void;
  onError?: (fileIndex: number, error: any) => void;
};

export const uploadFiles = async (
  files: File[],
  folder: 'others' | 'posts' |  'avatars',
  authId?: string,
  callbacks?: UploadCallbacks
): Promise<string[]> => {
  const uploadPromises = files.map((file, index) => {
    return new Promise<string>((resolve, reject) => {
      const savePath = authId ? `rinin/users/${authId}/${folder}` : `rinin/${folder}`;
      const ext = file.name.split(".").pop();
      const fileRef = ref(storage, `${savePath}/${Date.now()}_${index}.${ext}`);
      const uploadTask = uploadBytesResumable(fileRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const percent = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          callbacks?.onProgress?.(index, percent);
          console.log(`File ${index}: ${percent.toFixed(2)}% uploaded`);
        },
        (error) => {
          callbacks?.onError?.(index, error);
          reject(error);
        },
        async () => {
          const url = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(url);
        }
      );
    });
  });

  return Promise.all(uploadPromises);
};
