import React, { useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../store/store";
import {
  closePostCreatorModel,
  createPost,
  setPostContent,
  updateMedias,
  type IPostMediaRq,
} from "../../store/postCreatorSlide";
import HighlightOffSharpIcon from "@mui/icons-material/HighlightOffSharp";
import IconButton from "@mui/material/IconButton";
import PostBgs from "./components/PostBgs";
import PostTools from "./components/PostTools";
import FileSection from "./components/FileSection";
import { useFormik } from "formik";
import Button from "@mui/material/Button";
import { uploadFiles } from "../../features/firebase/uploadFile";
import { MediaUtils } from "../../utils/mediaUtils";

export interface IFormPostCreator {
  postMedias: {
    content: string;
    mediaUrl: string;
    mediaType: "IMAGE" | "VIDEO";
    height: number;
    width: number;
    duration?: number;
    thumbnailUrl?: string; // Thêm thumbnailUrl cho video
  }[];
}

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const PostCreatorModal = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const contentRef = useRef<HTMLTextAreaElement>(null);
  const [isPostCreating, setIsPostCreating] = useState(false);
  const { postBgs, postRq, isOpen, status } = useAppSelector(
    (state) => state.postCreator
  );
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const selectedBg = postBgs.find((bg) => bg.id === postRq.postBgId);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Nếu click đúng vào backdrop (not content)
    if (e.target === e.currentTarget) {
      // dispatch(close());
    }
  };
  // Giả sử bạn có state files và hàm handleRemoveFile
  const handleRemoveFile = (idx: number) => {
    setSelectedFiles((files) => files.filter((_, i) => i !== idx));
    // Cập nhật formik nếu cần
    dispatch(
      updateMedias({
        postMedias: postRq.postMedias?.filter((_, i) => i !== idx),
      })
    );
  };
  
  /**
   * Lấy metadata của một image file
   */
  const getImageMetadata = (file: File, pm: IPostMediaRq): Promise<IPostMediaRq> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const url = URL.createObjectURL(file);
      
      img.onload = () => {
        URL.revokeObjectURL(url); // Clean up
        resolve({
          ...pm,
          height: img.naturalHeight,
          width: img.naturalWidth,
        });
      };
      img.onerror = reject;
      img.src = url;
    });
  };

  /**
   * Lấy metadata của một video file
   */
  const getVideoMetadata = (file: File, pm: IPostMediaRq): Promise<IPostMediaRq> => {
    return new Promise((resolve, reject) => {
      const video = document.createElement("video");
      const url = URL.createObjectURL(file);
      
      video.onloadedmetadata = () => {
        URL.revokeObjectURL(url); // Clean up
        resolve({
          ...pm,
          height: video.videoHeight,
          width: video.videoWidth,
          duration: video.duration,
        });
      };
      video.onerror = reject;
      video.preload = "metadata";
      video.src = url;
    });
  };

  /**
   * Lấy metadata của tất cả files (dimensions, duration)
   */
  const getAllMediaMetadata = async (selectedFiles: File[], postMedias: IPostMediaRq[]): Promise<IPostMediaRq[]> => {
    console.log("📏 Getting media metadata...");
    
    const mediaPromises = postMedias.map((pm, i) => {
      const file = selectedFiles[i];
      
      if (pm.mediaType === "IMAGE") {
        return getImageMetadata(file, pm);
      } else if (pm.mediaType === "VIDEO") {
        return getVideoMetadata(file, pm);
      } else {
        return Promise.reject(new Error("Unsupported media type"));
      }
    });

    return Promise.all(mediaPromises);
  };

  /**
   * Tạo thumbnails cho tất cả video files
   */
  const createVideoThumbnails = async (selectedFiles: File[], postMedias: IPostMediaRq[]) => {
    console.log("🖼️ Creating video thumbnails...");
    
    const thumbnailFiles: { [index: number]: File } = {};
    const thumbnailPromises: Promise<void>[] = [];
    
    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i];
      const pm = postMedias[i];
      
      if (pm.mediaType === "VIDEO") {
        const thumbnailPromise = MediaUtils.createVideoThumbnail(file).then(thumbnailFile => {
          thumbnailFiles[i] = thumbnailFile;
        });
        thumbnailPromises.push(thumbnailPromise);
      }
    }
    
    await Promise.all(thumbnailPromises);
    return thumbnailFiles;
  };

  /**
   * Upload một file và thumbnail (nếu có)
   */
  const uploadSingleMedia = async (
    file: File,
    pm: IPostMediaRq,
    thumbnailFile: File | undefined,
    index: number
  ): Promise<{ mediaUrl: string; thumbnailUrl?: string; index: number }> => {
    if (!user) throw new Error("User is required for upload");
    
    console.log(`📤 Starting upload ${index + 1}: ${file.name}`);
    
    // Upload media file
    const [mediaUrl] = await uploadFiles([file], "posts", user.id.toString());
    
    let thumbnailUrl: string | undefined;
    
    // Upload thumbnail nếu là video
    if (pm.mediaType === "VIDEO" && thumbnailFile) {
      console.log(`🖼️ Uploading thumbnail ${index + 1}: thumbnail_${file.name}`);
      const [thumbUrl] = await uploadFiles([thumbnailFile], "posts", user.id.toString());
      thumbnailUrl = thumbUrl;
    }
    
    console.log(`✅ Completed upload ${index + 1}: ${file.name}`);
    return { mediaUrl, thumbnailUrl, index };
  };

  /**
   * Upload tất cả files song song
   */
  const uploadAllMediaFiles = async (
    selectedFiles: File[], 
    postMedias: IPostMediaRq[], 
    thumbnailFiles: { [index: number]: File }
  ) => {
    console.log("☁️ Starting parallel uploads...");
    
    // Tạo array các promises upload
    const uploadPromises = selectedFiles.map((file, i) => 
      uploadSingleMedia(file, postMedias[i], thumbnailFiles[i], i)
    );
    
    // Đợi tất cả uploads hoàn thành song song
    const uploadResults = await Promise.all(uploadPromises);
    
    // Sắp xếp lại theo index để đảm bảo thứ tự đúng
    const mediaUrls: string[] = [];
    const thumbnailUrls: string[] = [];
    
    uploadResults
      .sort((a, b) => a.index - b.index)
      .forEach(result => {
        mediaUrls[result.index] = result.mediaUrl;
        if (result.thumbnailUrl) {
          thumbnailUrls[result.index] = result.thumbnailUrl;
        }
      });
    
    console.log("🎉 All uploads completed!");
    return { mediaUrls, thumbnailUrls };
  };

  /**
   * Map URLs vào postMedias
   */
  const mapUrlsToPostMedias = (
    postMedias: IPostMediaRq[], 
    mediaUrls: string[], 
    thumbnailUrls: string[]
  ): IPostMediaRq[] => {
    console.log("🔗 Mapping URLs to post data...");
    
    return postMedias.map((pm, i) => ({
      ...pm,
      mediaUrl: mediaUrls[i],
      thumbnailUrl: pm.mediaType === "VIDEO" ? thumbnailUrls[i] : undefined,
    }));
  };

  /**
   * Xử lý upload media cho post NORMAL
   */
  const handleNormalPostMedia = async (postMedias: IPostMediaRq[]): Promise<IPostMediaRq[]> => {
    // Bước 1: Lấy metadata
    const mediasWithMetadata = await getAllMediaMetadata(selectedFiles, postMedias);
    
    // Bước 2: Tạo thumbnails cho video
    const thumbnailFiles = await createVideoThumbnails(selectedFiles, mediasWithMetadata);
    
    // Bước 3: Upload tất cả files
    const { mediaUrls, thumbnailUrls } = await uploadAllMediaFiles(
      selectedFiles, 
      mediasWithMetadata, 
      thumbnailFiles
    );
    
    // Bước 4: Map URLs vào postMedias
    return mapUrlsToPostMedias(mediasWithMetadata, mediaUrls, thumbnailUrls);
  };
  
  const handlePost = async () => {
    if (!user || isPostCreating) return;
    setIsPostCreating(true);
    
    try {
      const rq = { ...postRq };

      if (rq.postType === "NORMAL") {
        // Xử lý upload media cho post NORMAL
        rq.postMedias = await handleNormalPostMedia(rq.postMedias);
      } else {
        // Post type BACKGROUND không có media
        rq.postMedias = [];
      }

      // Tạo post
      console.log("📤 Creating post...", rq);
      await dispatch(createPost(rq));
      setSelectedFiles([]);
      
    } catch (error) {
      console.error("❌ Error while posting:", error);
    } finally {
      setIsPostCreating(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs"
      onClick={handleBackdropClick}
    >
      <div className="bg-[var(--background-color)] rounded-lg shadow-lg p-4 w-[min(100%,600px)] relative">
        <div className="absolute top-2 right-2">
          <IconButton onClick={() => dispatch(closePostCreatorModel())}>
            <HighlightOffSharpIcon />
          </IconButton>
        </div>
        <div>
          <h1 className="text-lg font-semibold mb-4 text-center">
            Create a Post
          </h1>
        </div>
        <div>
          <div className="flex items-center gap-3 mb-4">
            <img
              src={user?.profilePicture || "/avatar.jpg"}
              alt={user?.id.toString()}
              className="w-10 h-10 rounded-full"
            />
            <span className="text-md text-gray-700">
              {user?.firstName} {user?.lastName}
            </span>
          </div>
        </div>
        <div className="min-h-[10rem] max-h-[30rem] overflow-auto">
          {selectedBg && postRq.content.length <= 130 ? (
            <div
              className="w-full min-h-[20rem]  rounded-md overflow-hidden flex items-center justify-center text-center p-4"
              style={{
                backgroundColor:
                  selectedBg.type === "COLOR" ? selectedBg.bgColor : undefined,
                backgroundImage:
                  selectedBg.type === "IMAGE_URL"
                    ? `url(${selectedBg.bgImgUrl})`
                    : undefined,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <textarea
                className={`overflow-hidden w-full min-h-[70px] h-[70px]  border-none resize-none bg-transparent focus:outline-none text-center font-medium py-3 px-6 
                  ${
                    selectedBg.textColor === "#ffffff"
                      ? "placeholder:text-gray-200"
                      : "placeholder:text-gray-400"
                  }`}
                style={{
                  color: selectedBg.textColor,
                  fontSize: "1.75rem",
                  whiteSpace: "pre-wrap",
                }}
                placeholder="What's on your mind?"
                value={postRq.content}
                onChange={(e) => {
                  let newContent = e.target.value;
                  if (e.target.value.length > 130) {
                    newContent = e.target.value.slice(0, 130);
                  }
                  dispatch(setPostContent({ content: newContent }));
                }}
                rows={1}
                onInput={(e) => {
                  const target = e.target as HTMLTextAreaElement;
                  target.style.height = "auto";
                  target.style.height = `${Math.max(
                    target.scrollHeight,
                    70
                  )}px`;
                }}
              />
            </div>
          ) : (
            <textarea
              ref={contentRef}
              className="w-full min-h-[50px] h-auto resize-none rounded-sm border-none focus:outline-none p-2 text-base text-gray-900 placeholder:text-gray-400 box-border leading-5 overflow-hidden"
              placeholder="What's on your mind?"
              rows={1}
              value={postRq.content}
              onChange={(e) =>
                dispatch(setPostContent({ content: e.target.value }))
              }
              onInput={(e) => {
                const target = e.target as HTMLTextAreaElement;
                target.style.height = "auto";
                target.style.height = `${Math.max(target.scrollHeight, 50)}px`;
              }}
            />
          )}
          {isOpen && selectedFiles.length > 0 ? (
            <>
              <FileSection files={selectedFiles} onRemove={handleRemoveFile} />
            </>
          ) : null}
        </div>
        <div className="mt-4 flex flex-col gap-4">
          {postRq.content.length <= 130 &&
            isOpen &&
            selectedFiles.length <= 0 && <PostBgs />}
          <PostTools setFileSelected={setSelectedFiles} />
          <Button
            variant="contained"
            size="large"
            disabled={postRq.content.length <= 0 || isPostCreating}
            loading={isPostCreating}
            onClick={() => {
              handlePost();
            }}
          >
            Post
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PostCreatorModal;
