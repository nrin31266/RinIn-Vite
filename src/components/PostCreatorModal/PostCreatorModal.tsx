import React, { useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../store/store";
import { closePostCreatorModel, createPost, setPostContent, updateMedias, type IPostMediaRq } from "../../store/postCreatorSlide";
import HighlightOffSharpIcon from "@mui/icons-material/HighlightOffSharp";
import IconButton from "@mui/material/IconButton";
import PostBgs from "./components/PostBgs";
import PostTools from "./components/PostTools";
import FileSection from './components/FileSection';
import { useFormik } from "formik";
import Button from "@mui/material/Button";
import { uploadFiles } from "../../features/firebase/uploadFile";

export interface IFormPostCreator {
  postMedias: {
        content: string;
        mediaUrl: string;
        mediaType: "IMAGE" | "VIDEO";
        height: number;
        width: number;
        duration?: number;
      }[]
}

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
    dispatch(updateMedias({postMedias: postRq.postMedias?.filter((_, i) => i !== idx)}));
  }
 const handlePost = async () => {
  if( !user || isPostCreating) return;
  setIsPostCreating(true);
  try {
    const rq = { ...postRq };

    if (rq.postType === "NORMAL") {
      const mediaPromises = rq.postMedias.map((pm, i) => {
        const file = selectedFiles[i];
        const url = URL.createObjectURL(file);

        return new Promise<IPostMediaRq>((resolve, reject) => {
          if (pm.mediaType === "IMAGE") {
            const img = new Image();
            img.onload = () => {
              resolve({ ...pm, height: img.naturalHeight, width: img.naturalWidth });
            };
            img.onerror = reject;
            img.src = url;
          } else if (pm.mediaType === "VIDEO") {
            const video = document.createElement("video");
            video.onloadedmetadata = () => {
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
          } else {
            reject(new Error("Unsupported media type"));
          }
        });
      });

      rq.postMedias = await Promise.all(mediaPromises);
      const mediaUrls = await uploadFiles(selectedFiles, "posts", user.id.toString());
      rq.postMedias = rq.postMedias.map((pm, i) => ({
        ...pm,
        mediaUrl: mediaUrls[i],
      }));
    } else {
      rq.postMedias = []; // Post type khác thì clear media
    }

    console.log("Request with full metadata:", rq);
    await dispatch(createPost(rq));
    setSelectedFiles([]);
  } catch (error) {
    console.error("Error while posting:", error);
  } finally {
    setIsPostCreating(false);
  }
};

  



  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs"
      onClick={handleBackdropClick}
    >
      <div  className="bg-[var(--background-color)] rounded-lg shadow-lg p-4 w-[min(100%,600px)] relative">
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
                  ${selectedBg.textColor === "#ffffff" ? "placeholder:text-gray-200" : "placeholder:text-gray-400"}`}
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
                target.style.height = `${Math.max(target.scrollHeight, 70)}px`;
                
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
          {
            isOpen && selectedFiles.length > 0 ? <><FileSection files={selectedFiles} onRemove={handleRemoveFile} /></> : null
          }
        </div>
        <div className="mt-4 flex flex-col gap-4">
          {postRq.content.length <= 130 && isOpen && selectedFiles.length <= 0 && <PostBgs />}
          <PostTools setFileSelected={setSelectedFiles} />
          <Button variant="contained" size="large" disabled={postRq.content.length <= 0 || isPostCreating} loading={isPostCreating} onClick={()=>{
            handlePost();
          }}>
            Post
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PostCreatorModal;
