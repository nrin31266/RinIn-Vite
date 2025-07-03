import Button from "@mui/material/Button";
import type { ICommentDto } from "../../../../../../store/feedSlide";
import { useAppSelector } from "../../../../../../store/store";
import { useState } from "react";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import IconButton from "@mui/material/IconButton";
import EditComment from "../EditComment/Editcomment";
interface SingleCommentProps {
  comment: ICommentDto;
  onReplyClick: () => void;
  onLoadReplies: (commentId: number) => void;
}

/**
 * Component hiển thị một comment đơn lẻ với avatar, nội dung, và actions
 */
const SingleComment = ({
  comment,
  onReplyClick,
  onLoadReplies,
}: SingleCommentProps) => {
  const user = useAppSelector((state) => state.auth.user);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  
  return (
    <div className="relative">
      {user && user.id === comment.author.id && !editing && (
        <div className="absolute top-0 right-1">
          <div onMouseEnter={() => setIsMenuOpen(true)}
            onMouseLeave={() => setIsMenuOpen(false)} className="relative">
            <IconButton><MoreVertIcon className="!text-[1.5rem]"/></IconButton>
           {isMenuOpen && (
            // Thêm tí hiệu ứng xuất hiện
             <div className="absolute right-2 top-4 flex flex-col gap-2 bg-white p-2 rounded shadow-md">
               <button onClick={()=>{setEditing(true)}} className="text-xs text-gray-600 hover:text-gray-800 cursor-pointer">
                 Edit
               </button>
               <button className="text-xs text-gray-600 hover:text-gray-800 cursor-pointer">
                 Delete
               </button>
             </div>
           )}
          </div>
        </div>
      )}

      {!editing? <div className="grid grid-cols-[auto_1fr] gap-2 ">
        {/* Avatar */}
      <div className="relative h-max">
        <img
          src={comment.author.profilePicture || "avatar.jpg"}
          className="h-8 w-8 object-cover rounded-full"
          alt="avt cm"
        />
        {/* <div  className="w-6 absolute h-1 bg-gray-300 -left-6 top-[50%] "></div> */}
      </div>

      {/* Content */}
      <div>
        {/* Comment bubble */}
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

        {/* Actions: time, reply */}
        <div className="px-2 flex items-center gap-2">
          <h2 className="text-xs text-gray-500">
            {new Date(comment.creationDate).toLocaleString().replace(/,/g, "")}
          </h2>
          {user?.id !== comment.author.id && <button
            onClick={onReplyClick}
            className="text-xs text-blue-500 hover:text-gray-800 cursor-pointer px-2 hover:underline"
          >
            Reply
          </button>}
        </div>

        {/* Load more replies button */}
        {comment.repliedCount !== null &&
          comment.repliedCount > 0 &&
          comment.replies &&
          comment.repliedCount - comment.replies.length > 0 && (
            <button
              onClick={() => onLoadReplies(comment.id)}
              className="hover:underline text-gray-700 text-sm cursor-pointer px-2"
            >
              {"See all " + comment.repliedCount + " replied"}
            </button>
          )}
      </div>
      </div>: user && <EditComment comment={comment} auth={user} onClose={() => setEditing(false)} />}
    </div>
  );
};

export default SingleComment;
