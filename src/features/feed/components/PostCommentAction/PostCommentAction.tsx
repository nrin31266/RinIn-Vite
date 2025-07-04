import React, { useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "../../../../store/store";
import IconButton from "@mui/material/IconButton";
import { createComment } from "../../../../store/postsSlice";
import SendRoundedIcon from '@mui/icons-material/SendRounded';
interface IPostCommentActionProps {
  onAction?:  (comment: string) => void;
  loading?: boolean;
  placeholder?: string;
  initialValue?: string;
}

const PostCommentAction = ({ onAction, loading, placeholder, initialValue }: IPostCommentActionProps) => {
  const user = useAppSelector((state) => state.auth.user);
  const commentInputRef = useRef<HTMLTextAreaElement>(null);
  const [comment, setComment] = React.useState("");
  const maxHeightCommentInput = 24; //rem
  const { currentPostComments, status, selectedPost } = useAppSelector(
    (state) => state.posts
  );
  const dispatch = useAppDispatch();
  // Nếu có nội dung được truyền vào, đặt comment là nội dung đó
  useEffect(() => {
    if (initialValue) {
      setComment(initialValue);
    }
  }, [initialValue]);
  const handleCommentSubmit = async () => {
    if (!comment.trim()) return; // Không gửi nếu comment rỗng
    if (onAction) {
      onAction(comment); // Gọi hàm onAction nếu có
    } else {
      if (!selectedPost) return; // Không gửi nếu không có post được chọn

      // await dispatch();
      await dispatch(
        createComment({
          content: comment,
          targetId: selectedPost.id,
          targetAction: "POST",
        })
      );
    }

    // After sending the comment, you can reset the input
    if (commentInputRef.current) {
      commentInputRef.current.style.height = "30px"; // Reset height to default
      commentInputRef.current.style.overflowY = "hidden"; // Hide scroll
      setComment(""); // Clear the comment input
    }
  };

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
          placeholder={placeholder || `Comment as ${
            user?.firstName + " " + user?.lastName || "User"
          }...`}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          onInput={(e) => {
            const target = e.target as HTMLTextAreaElement;
            // Reset height to auto to calculate scrollHeight correctly
            target.style.height = "auto";
            const scrollHeight =
              target.scrollHeight < 30 ? 30 : target.scrollHeight;
            if (scrollHeight > maxHeightCommentInput * 16) {
              target.style.height = `${maxHeightCommentInput * 16}px`;
              target.style.overflowY = "auto"; // Show scroll
            } else {
              target.style.height = `${scrollHeight}px`;
              target.style.overflowY = "hidden"; // Hide scroll
            }
          }}
        ></textarea>
        <div className="px-2 pb-1 relative">
          <div className="text-blue-600 text-sm">
            Feature will update soon...
          </div>
          <div className="absolute right-2 top-0 -translate-y-1/2">
            <IconButton
              onClick={handleCommentSubmit}
              disabled={initialValue? !comment.trim() || comment.trim() === initialValue : !comment.trim()}
              loading={loading !== undefined ? loading : status.createComment === "loading"}
              className="!p-0 !h-8 !w-8 !rounded-full hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
              title="Send Comment"
            >
              <SendRoundedIcon color="primary" />
            </IconButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostCommentAction;
