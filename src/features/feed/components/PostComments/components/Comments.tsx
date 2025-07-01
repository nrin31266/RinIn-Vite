import React from "react";
import {
  createComment,
  fetchPostComments,
  type ICommentDto,
} from "../../../../../store/feedSlide";
import { useAppDispatch } from "../../../../../store/store";
import PostCommentAction from "../../PostCommentAction/PostCommentAction";

interface Props {
  comments: ICommentDto[];
  level: number; // Cấp độ comment: 0=tầng 1, 1=tầng 2, 2=tầng 3
  
  // Props từ parent component để share state giữa các nested Comments
  // Điều này giúp form reply ở level 3 có thể mở ở level 2
  parentOpenReply?: Set<number>; // Set chứa các uniqueReplyKey đang mở form
  parentSetOpenReply?: React.Dispatch<React.SetStateAction<Set<number>>>;
  parentReplyToInfo?: Map<number, {firstName: string | undefined, lastName: string | undefined, id: number}>; // Map lưu thông tin người được reply
  parentSetReplyToInfo?: React.Dispatch<React.SetStateAction<Map<number, {firstName: string | undefined, lastName: string | undefined, id: number}>>>;
}

const Comments = ({ 
  comments, 
  level, 
  parentOpenReply, 
  parentSetOpenReply, 
  parentReplyToInfo, 
  parentSetReplyToInfo 
}: Props) => {
  const dispatch = useAppDispatch();
  
  // Local state cho component Comments ở tầng gốc (level 0)
  // openReply: Set chứa các ID của comment đang mở form reply
  // replyToInfo: Map lưu thông tin {tên, ID} của người được reply
  const [openReply, setOpenReply] = React.useState<Set<number>>(new Set());
  const [replyToInfo, setReplyToInfo] = React.useState<Map<number, {firstName: string | undefined, lastName: string | undefined, id: number}>>(new Map());

  // Logic quan trọng: Sử dụng parent state nếu có (nested comments), 
  // nếu không thì dùng local state (comment gốc)
  // Điều này giúp tất cả nested comments dùng chung 1 state từ gốc
  const currentOpenReply = parentOpenReply || openReply;
  const currentSetOpenReply = parentSetOpenReply || setOpenReply;
  const currentReplyToInfo = parentReplyToInfo || replyToInfo;
  const currentSetReplyToInfo = parentSetReplyToInfo || setReplyToInfo;

  // Helper functions để quản lý form reply - thay thế custom hook phức tạp
  const openReplyForm = (uniqueReplyKey: number, authorInfo: {firstName: string | undefined, lastName: string | undefined, id: number}) => {
    if (currentOpenReply.has(uniqueReplyKey)) {
      // TH1: Form đã mở rồi -> chỉ cập nhật thông tin người được reply
      // (VD: user click reply A rồi click reply B, form vẫn mở nhưng target thành B)
      currentSetReplyToInfo(prev => {
        const newMap = new Map(prev);
        newMap.set(uniqueReplyKey, authorInfo);
        return newMap;
      });
      
      // Focus lại textarea khi switch reply target
      setTimeout(() => {
        const replyFormElement = document.querySelector(`[data-reply-key="${uniqueReplyKey}"]`);
        if (replyFormElement) {
          const textarea = replyFormElement.querySelector('textarea');
          if (textarea) {
            textarea.focus();
          }
        }
      }, 50);
    } else {
      // TH2: Form chưa mở -> mở form và set thông tin người được reply
      currentSetOpenReply((prev) => new Set(prev).add(uniqueReplyKey));
      currentSetReplyToInfo(prev => {
        const newMap = new Map(prev);
        newMap.set(uniqueReplyKey, authorInfo);
        return newMap;
      });
      
      // Auto scroll to reply form sau khi state update
      setTimeout(() => {
        const replyFormElement = document.querySelector(`[data-reply-key="${uniqueReplyKey}"]`);
        if (replyFormElement) {
          replyFormElement.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center' 
          });
          
          // Auto focus vào textarea sau khi scroll
          setTimeout(() => {
            const textarea = replyFormElement.querySelector('textarea');
            if (textarea) {
              textarea.focus();
            }
          }, 200);
        }
      }, 100);
    }
  };

  const closeReplyForm = (uniqueReplyKey: number) => {
    // Xóa form khỏi Set đang mở
    currentSetOpenReply(prev => {
      const newSet = new Set(prev);
      newSet.delete(uniqueReplyKey);
      return newSet;
    });
    
    // Xóa thông tin reply khỏi Map
    currentSetReplyToInfo(prev => {
      const newMap = new Map(prev);
      newMap.delete(uniqueReplyKey);
      return newMap;
    });
  };

  // Helper function: Lấy tên người được reply từ Map, fallback về tên gốc
  const getReplyToName = (uniqueReplyKey: number, fallbackName: string) => {
    const replyInfo = currentReplyToInfo.get(uniqueReplyKey);
    return replyInfo
      ? `${replyInfo.firstName || ''} ${replyInfo.lastName || ''}`
      : fallbackName;
  };

  // Helper function: Lấy ID người được reply từ Map, fallback về ID gốc
  const getReplyToId = (uniqueReplyKey: number, fallbackId: number) => {
    const replyInfo = currentReplyToInfo.get(uniqueReplyKey);
    return replyInfo ? replyInfo.id : fallbackId;
  };
  const handleReply = (
    comment: string,
    parentId: number,
    repliedToId: number
  ) => {
    dispatch(
      createComment({
        content: comment,
        targetAction: "COMMENT",
        targetId: parentId,
        repliedToId: repliedToId,
      })
    );
  };
  const fetchComment = (parentId: number) => {
    dispatch(
      fetchPostComments({ targetAction: "COMMENT", targetId: parentId })
    );
  };
  return (
    <div className="space-y-2">
      {comments.map((comment) => {
        // KEY LOGIC: uniqueReplyKey quyết định form reply mở ở đâu
        // - Level 0,1 (tầng 1,2): uniqueReplyKey = comment.id -> form mở tại chỗ
        // - Level 2+ (tầng 3+): uniqueReplyKey = parentCommentId -> form mở ở tầng 2
        // Điều này đảm bảo form reply ở tầng 3 luôn hiển thị ở tầng 2, không tạo tầng 4
        const uniqueReplyKey = level >= 2 && comment.parentCommentId 
          ? comment.parentCommentId 
          : comment.id;

        return <div key={comment.id}>
          {/* Hiển thị comment đơn giản */}
          <div className="grid grid-cols-[auto_1fr] gap-2">
            <div>
              <img
                src={comment.author.profilePicture || "avatar.jpg"}
                className="h-8 w-8 object-cover rounded-full"
                alt="avt cm"
              />
            </div>
            <div>
              <div className="bg-gray-100 p-2 rounded-lg space-y-1">
                <h1 className="font-semibold text-xs">
                  {comment.author.firstName} {comment.author.lastName}{" "}
                  {comment.repliedTo &&
                    comment.repliedTo.id !== comment.author.id && (
                      <span className="text-gray-700">
                        {`replied to ${comment.repliedTo.firstName} ${comment.repliedTo.lastName}`}
                      </span>
                    )}
                </h1>
                <p className="text-sm">{comment.content}</p>
              </div>
              <div className="px-2 flex items-center gap-2">
                <h2 className="text-xs text-gray-500">
                  {new Date(comment.creationDate).toLocaleString()}
                </h2>
                <button
                  onClick={() => {
                    console.log("Debug:", {level, commentId: comment.id, parentCommentId: comment.parentCommentId, uniqueReplyKey});
                    
                    // Mở form reply với uniqueReplyKey và thông tin author
                    openReplyForm(uniqueReplyKey, {
                      firstName: comment.author.firstName,
                      lastName: comment.author.lastName,
                      id: comment.author.id
                    });
                  }}
                  className="text-sm text-gray-600 hover:text-gray-800"
                >
                  Reply
                </button>
              </div>
              {comment.repliedCount !== null &&
                comment.repliedCount > 0 &&
                comment.replies &&
                comment.repliedCount - comment.replies.length > 0 && (
                  <button
                    onClick={() => fetchComment(comment.id)}
                    className="hover:underline text-gray-700 text-sm cursor-pointer px-2"
                  >
                    {"See all " + comment.repliedCount + " replied"}
                  </button>
                )}
            </div>
          </div>
          
          {/* QUAN TRỌNG: Form reply chỉ render ở level < 2 (tầng 1,2) 
              Level 2+ (tầng 3+) không render form -> form sẽ hiển thị ở tầng 2 */}
          {level < 2 && currentOpenReply.has(uniqueReplyKey) && (
            <div className="mt-2 ml-10" data-reply-key={uniqueReplyKey}>
              <div className="relative mb-4">
                <p className="text-sm text-gray-600 mb-2">
                  Replying to <span className="text-[var(--primary-color)]">{getReplyToName(uniqueReplyKey, `${comment.author.firstName} ${comment.author.lastName}`)}</span>
                </p>
                <PostCommentAction
                  onAction={(reply: string) => {
                    // Lấy thông tin người được reply từ Map state
                    const repliedToId = getReplyToId(uniqueReplyKey, comment.author.id);
                    
                    // Xác định target comment để gửi reply vào
                    // Level 2+: gửi vào parentCommentId để không tạo tầng 4
                    const targetCommentId = level >= 2 && comment.parentCommentId 
                      ? comment.parentCommentId 
                      : comment.id;
                    
                    handleReply(reply, targetCommentId, repliedToId);
                    closeReplyForm(uniqueReplyKey);
                  }}
                />
                <div className="flex gap-2 top-0 absolute right-2">
                  <button
                    onClick={() => closeReplyForm(uniqueReplyKey)}
                    className="px-1 text-[0.8rem] bg-red-200 text-black rounded hover:bg-red-300 cursor-pointer"
                  >
                   X
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {/* Render nested comments (recursive) */}
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
      })}
    </div>
  );
};

export default Comments;
