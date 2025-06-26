import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "./firebaseConfig";

import Resizer from "react-image-file-resizer";

const resizeFile = (file: File): Promise<File> => {
  return new Promise<File>((resolve) => {
    Resizer.imageFileResizer(
      file,
      1080,
      720,
      "WEBP", // Định dạng nhẹ hơn JPEG
      80,     // Giảm chất lượng để tối ưu size
      0,
      (resizedFile) => resolve(resizedFile as File),
      "file"
    );
  });
};

type UploadCallbacks = {
  onProgress?: (fileIndex: number, percent: number) => void;
  onError?: (fileIndex: number, error: any) => void;
};

export const uploadFiles = async (
  files: File[],
  folder: 'others' | 'posts' | 'avatars',
  authId?: string,
  callbacks?: UploadCallbacks
): Promise<string[]> => {
  const uploadPromises = files.map(async (originalFile, index) => {
    // 1) Chuẩn bị file: resize nếu là ảnh, ngược lại giữ nguyên
    const prepare = originalFile.type.startsWith("image/")
      ? resizeFile(originalFile)
      : Promise.resolve(originalFile);

    // 2) Sau khi chuẩn bị xong, upload và trả về URL
    const file_1 = await prepare;
    return await new Promise<string>((resolve, reject) => {
      const savePath = authId
        ? `rinin/users/${authId}/${folder}`
        : `rinin/${folder}`;
      const ext = file_1.name.split(".").pop();
      const fileName = `${Date.now()}_${index}.${ext}`;
      const fileRef = ref(storage, `${savePath}/${fileName}`);
      const uploadTask = uploadBytesResumable(fileRef, file_1);

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
          try {
            const url = await getDownloadURL(uploadTask.snapshot.ref);
            resolve(url);
          } catch (err) {
            reject(err);
          }
        }
      );
    });
  });

  // Chờ tất cả hoàn thành và trả về mảng URL
  return Promise.all(uploadPromises);
};
