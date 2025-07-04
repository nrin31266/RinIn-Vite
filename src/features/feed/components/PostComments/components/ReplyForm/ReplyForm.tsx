import PostCommentAction from "../../../PostCommentAction/PostCommentAction";

interface ReplyFormProps {
  isVisible: boolean;
  replyToName: string;
  uniqueReplyKey: number;
  onSubmitReply: (reply: string) => void;
  onClose: () => void;
  parentIsLast?: boolean; // Thêm prop để biết comment cha có phải là comment cuối cùng không
  level: number; // Thêm prop để biết comment này ở level nào
  parentHasReplies?: boolean; // Thêm prop để biết comment cha có replies hay không
}

/**
 * Component hiển thị form reply với PostCommentAction và nút close
 */
const ReplyForm = ({ isVisible, replyToName, uniqueReplyKey, onSubmitReply, onClose
, parentIsLast = false,
  level = 0 // Mặc định là level 0 nếu không truyền vào
, parentHasReplies = false
 }: ReplyFormProps) => {
  if (!isVisible) return null;

  return (
    <div className="relative" data-reply-key={uniqueReplyKey}>
      {isVisible && <>
      {!parentIsLast && level !==0 &&  <div className={`absolute w-1 bg-gray-300 h-[130%] z-1 -ml-7`}></div>}
      <div className="absolute w-[1.5rem] ml-[0.8rem] h-1 top-1/2 bg-blue-500"></div>
                  <div className={`absolute w-1 ${parentHasReplies ? 'h-[150%] -mt-4': 'h-[90%] -mt-8'} bg-blue-500 ml-3`}></div></>}
      <div className="relative ml-10 my-4">
        <p className="text-sm text-gray-600 mb-2">
          Replying to <span className="text-[var(--primary-color)]">{replyToName}</span>
        </p>
        
        <PostCommentAction onAction={onSubmitReply} />
        
        <div className="flex gap-2 top-0 absolute right-2">
          <button
            onClick={onClose}
            className="px-1 text-[0.8rem] bg-red-200 text-black rounded hover:bg-red-300 cursor-pointer"
          >
            X
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReplyForm;
