import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import IconButton from "@mui/material/IconButton";
import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../store/store";
import { updateMedias, type IPostMediaRq } from "../../../store/postCreatorSlide";



const PostTools = ({setFileSelected} : {setFileSelected: React.Dispatch<React.SetStateAction<File[]>>}) => {
  const dispatch = useAppDispatch();
  const { postRq } = useAppSelector(
    (state) => state.postCreator
  );
    const fileInputRef = React.useRef<HTMLInputElement>(null);
   const handleOpenFileDialog = () => {
    fileInputRef.current?.click(); // 👈 Trigger click input
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    console.log(files);
    if (files) {
        fileInputRef.current!.value = ""; // Reset the input value to allow re-uploading the same file
         setFileSelected((prevFiles) => [...prevFiles, ...files]);
         const newMediasReq: IPostMediaRq[] = files.map((file) => {
            return {
              content: '',
              mediaUrl: '',
              mediaType: file.type.startsWith("image") ? "IMAGE" : "VIDEO",
              height: 0, // Placeholder, you might want to calculate this
              width: 0, // Placeholder, you might want to calculate this
              duration: file.type.startsWith("video") ? 0 : undefined, // Placeholder for video duration
              // You might want to add more properties here
            };
         })
         dispatch(updateMedias({ postMedias: [...postRq.postMedias, ...newMediasReq] }));
    }
  };
  return (
    <div className="rounded-md border-1 border-gray-200 px-2 py-1 grid grid-cols-[auto_1fr]">
      <div>
        <h2 className="text-md text-gray-700 h-full flex items-center">
          Add more
        </h2>
      </div>
      <div className="flex items-center justify-end gap-2">
        <IconButton className="!text-emerald-400 disabled:!text-gray-300" onClick={handleOpenFileDialog} disabled={postRq.postBgId !== undefined}>
                <AddPhotoAlternateIcon/>
            </IconButton>
      </div>
      <input
        type="file"
        id="fileInput"
        className="hidden"
        accept="image/*,video/*"
        multiple
        ref={fileInputRef}
        onChange={handleFileChange}
      />
    </div>
  );
};

export default PostTools;
