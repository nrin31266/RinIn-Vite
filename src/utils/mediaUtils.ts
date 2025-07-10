export class MediaUtils {
  public static createVideoThumbnail = (file: File): Promise<File> => {
    return new Promise((resolve, reject) => {
      const video = document.createElement("video");
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      video.onloadedmetadata = () => {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        // Seek to 1 second or 10% of video duration for thumbnail
        video.currentTime = Math.min(1, video.duration * 0.1);
      };

      video.onseeked = () => {
        if (ctx) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          canvas.toBlob(
            (blob) => {
              if (blob) {
                const thumbnailFile = new File(
                  [blob],
                  `thumbnail_${file.name.replace(/\.[^/.]+$/, "")}.jpg`,
                  {
                    type: "image/jpeg",
                  }
                );
                resolve(thumbnailFile);
              } else {
                reject(new Error("Failed to create thumbnail"));
              }
            },
            "image/jpeg",
            0.8
          );
        }
      };

      video.onerror = reject;
      video.src = URL.createObjectURL(file);
    });
  };

  public static getImageDimensions = (file: File): Promise<{ width: number; height: number }> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const url = URL.createObjectURL(file);

      img.onload = () => {
        URL.revokeObjectURL(url);
        resolve({
          width: img.naturalWidth,
          height: img.naturalHeight,
        });
      };

      img.onerror = reject;
      img.src = url;
    });
  };

  public static getVideoDimensions = (file: File): Promise<{ width: number; height: number; duration: number }> => {
    return new Promise((resolve, reject) => {
      const video = document.createElement("video");
      const url = URL.createObjectURL(file);

      video.onloadedmetadata = () => {
        URL.revokeObjectURL(url);
        resolve({
          width: video.videoWidth,
          height: video.videoHeight,
          duration: video.duration,
        });
      };

      video.onerror = reject;
      video.preload = "metadata";
      video.src = url;
    });
  };
}
