import React, { useRef } from "react";
import { useAppDispatch, useAppSelector } from "../../../../store/store";
import IconButton from "@mui/material/IconButton";
import { createComment } from "../../../../store/feedSlide";


const PostCommentAction = () => {
  const user = useAppSelector((state) => state.auth.user);
  const commentInputRef = useRef<HTMLTextAreaElement>(null);
  const [comment, setComment] = React.useState("");
  const maxHeightCommentInput = 24; //rem
  const { currentPostComments, status, selectedPost } = useAppSelector((state) => state.feed);
 const dispatch = useAppDispatch();
    const handleCommentSubmit =async () => {
    if (!comment.trim()) return; // Không gửi nếu comment rỗng
    if (!selectedPost) return; // Không gửi nếu không có post được chọn

    // await dispatch();
    await dispatch(createComment({
      content: comment,
      targetId: selectedPost.id,
      targetAction: "POST"
    }));

    // After sending the comment, you can reset the input
    if (commentInputRef.current) {
      commentInputRef.current.style.height = "30px"; // Reset height to default
      commentInputRef.current.style.overflowY = "hidden"; // Hide scroll
      setComment(""); // Clear the comment input
    }
}

  return (
    <div className="grid grid-cols-[auto_1fr] gap-2 max-h-[25rem]">
      <img
        src={user?.profilePicture || "/avatar.jpg"}
        className="h-8 w-8 rounded-full object-cover"
        alt="comment"
      />
      <div className="w-full relative bg-gray-200 border-gray-200 rounded-md">
        <textarea
        ref={commentInputRef}
        className="leading-5 w-full focus:outline-none max-h-[22rem]  
        resize-none min-h-[30px] px-2 pt-2  rounded-md"
        id=""
        rows={1}
        placeholder={`Comment as ${(user?.firstName + " " + user?.lastName) || "User"}...`}
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        onInput={e=>{
            const target = e.target as HTMLTextAreaElement;
            // Reset height to auto to calculate scrollHeight correctly
            target.style.height = "auto";
            const scrollHeight = target.scrollHeight < 30 ? 30 : target.scrollHeight;
            if (scrollHeight > maxHeightCommentInput * 16) {
              target.style.height = `${maxHeightCommentInput * 16}px`;
              target.style.overflowY = "auto"; // Show scroll
            }else{
              target.style.height = `${scrollHeight}px`;
              target.style.overflowY = "hidden"; // Hide scroll
            }
        }}
      ></textarea>
      <div className="grid grid-cols-[auto_auto] pl-2 pr-1 pb-1 -mt-2 h-[2rem] items-center gap-2">
        <div className="text-blue-600 text-sm">Feature will update soon...</div>
        <div className="flex items-center justify-end">
            <IconButton
            onClick={handleCommentSubmit}
            disabled={!comment.trim()}
            className={`text-gray-500 p-2 rounded-full ${!comment.trim() ? "" : "!text-[var(--primary-color)] hover:!text-[var(--primary-color-dark)]"}`}
            loading={status.createComment === "loading"}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
              fill="currentColor"
              height={14}
              width={14}
            >
              <path d="M16.1 260.2c-22.6 12.9-20.5 47.3 3.6 57.3L160 376l0 103.3c0 18.1 14.6 32.7 32.7 32.7c9.7 0 18.9-4.3 25.1-11.8l62-74.3 123.9 51.6c18.9 7.9 40.8-4.5 43.9-24.7l64-416c1.9-12.1-3.4-24.3-13.5-31.2s-23.3-7.5-34-1.4l-448 256zm52.1 25.5L409.7 90.6 190.1 336l1.2 1L68.2 285.7zM403.3 425.4L236.7 355.9 450.8 116.6 403.3 425.4z" />
            </svg>
          </IconButton>
        </div>
      </div>
      </div>
    </div>
  );
};

export default PostCommentAction;
