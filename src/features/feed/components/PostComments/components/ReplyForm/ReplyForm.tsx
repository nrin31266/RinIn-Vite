import PostCommentAction from "../../../PostCommentAction/PostCommentAction";

interface ReplyFormProps {
  isVisible: boolean;
  replyToName: string;
  uniqueReplyKey: number;
  onSubmitReply: (reply: string) => void;
  onClose: () => void;
}

/**
 * Component hiển thị form reply với PostCommentAction và nút close
 */
const ReplyForm = ({ isVisible, replyToName, uniqueReplyKey, onSubmitReply, onClose }: ReplyFormProps) => {
  if (!isVisible) return null;

  return (
    <div className="mt-2 ml-10" data-reply-key={uniqueReplyKey}>
      <div className="relative mb-4">
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
