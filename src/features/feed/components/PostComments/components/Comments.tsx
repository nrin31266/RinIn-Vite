import React from "react";
import {
  createComment,
  fetchPostComments,
  type ICommentDto,
} from "../../../../../store/postsSlice";
import { useAppDispatch } from "../../../../../store/store";
import { useReplyManager } from "../hooks/useReplyManager";
import SingleComment from "./SingleComment/SingleComment";
import ReplyForm from "./ReplyForm/ReplyForm";

interface Props {
  comments: ICommentDto[];
  level: number;
  parentOpenReply?: Set<number>;
  parentSetOpenReply?: React.Dispatch<React.SetStateAction<Set<number>>>;
  parentReplyToInfo?: Map<number, {firstName: string | undefined, lastName: string | undefined, id: number}>;
  parentSetReplyToInfo?: React.Dispatch<React.SetStateAction<Map<number, {firstName: string | undefined, lastName: string | undefined, id: number}>>>;
}

/**
 * Component chính để render comment tree với nested replies
 * Sử dụng các component nhỏ và custom hook để tách logic
 */
const Comments = ({ 
  comments, 
  level, 
  parentOpenReply, 
  parentSetOpenReply, 
  parentReplyToInfo, 
  parentSetReplyToInfo 
}: Props) => {
  const dispatch = useAppDispatch();

  // Sử dụng custom hook để quản lý reply logic
  const {
    currentOpenReply,
    currentSetOpenReply, 
    currentReplyToInfo,
    currentSetReplyToInfo,
    openReplyForm,
    closeReplyForm,
    getReplyToName,
    getReplyToId
  } = useReplyManager(parentOpenReply, parentSetOpenReply, parentReplyToInfo, parentSetReplyToInfo);

  // Xử lý submit reply
  const handleReply = (comment: string, parentId: number, repliedToId: number) => {
    dispatch(
      createComment({
        content: comment,
        targetAction: "COMMENT",
        targetId: parentId,
        repliedToId: repliedToId,
      })
    );
  };

  // Fetch thêm replies
  const fetchComment = (parentId: number) => {
    dispatch(
      fetchPostComments({ targetAction: "COMMENT", targetId: parentId })
    );
  };

  return (
    <div className="space-y-2 relative">
      {/* <div className="absolute w-1 bg-gray-300 h-full -ml-7"></div> */}
      {comments.map((comment) => {
        // Logic xác định uniqueReplyKey để form reply mở đúng chỗ
        const uniqueReplyKey = level >= 2 && comment.parentCommentId 
          ? comment.parentCommentId 
          : comment.id;

        return (
          <div key={comment.id}>
            {/* Component hiển thị một comment */}
            <SingleComment
              comment={comment}
              onReplyClick={() => {
                console.log("Debug:", {level, commentId: comment.id, parentCommentId: comment.parentCommentId, uniqueReplyKey});
                openReplyForm(uniqueReplyKey, {
                  firstName: comment.author.firstName,
                  lastName: comment.author.lastName,
                  id: comment.author.id
                });
              }}
              onLoadReplies={fetchComment}
            />
            
            {/* Component form reply - chỉ hiển thị ở level < 2 */}
            <ReplyForm
              isVisible={level < 2 && currentOpenReply.has(uniqueReplyKey)}
              replyToName={getReplyToName(uniqueReplyKey, `${comment.author.firstName} ${comment.author.lastName}`)}
              uniqueReplyKey={uniqueReplyKey}
              onSubmitReply={(reply: string) => {
                const repliedToId = getReplyToId(uniqueReplyKey, comment.author.id);
                const targetCommentId = level >= 2 && comment.parentCommentId 
                  ? comment.parentCommentId 
                  : comment.id;
                
                handleReply(reply, targetCommentId, repliedToId);
                closeReplyForm(uniqueReplyKey);
              }}
              onClose={() => closeReplyForm(uniqueReplyKey)}
            />
            
            {/* Recursive render cho nested comments */}
            {comment.replies && comment.replies.length > 0 && (
              <div className="ml-10 mt-2">
                <Comments 
                  comments={comment.replies} 
                  level={level + 1}
                  parentOpenReply={currentOpenReply}
                  parentSetOpenReply={currentSetOpenReply}
                  parentReplyToInfo={currentReplyToInfo}
                  parentSetReplyToInfo={currentSetReplyToInfo}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default Comments;
