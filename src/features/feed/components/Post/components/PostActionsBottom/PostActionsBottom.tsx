import React, { useState } from "react";
import type { IPostDto } from "../../../../../../store/feedSlide";
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import IosShareIcon from '@mui/icons-material/IosShare';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
const PostActionsBottom = ({ post }: { post: IPostDto }) => {
  const [showReactions, setShowReactions] = useState(false);
  
  return (
    <div className="mt-4 w-full grid grid-cols-3 gap-4 text-gray-500 text-sm">
      {/* Like button with hover to show reactions - wrap both button and popup in container */}
      <div 
        className="relative"
        onMouseEnter={() => setShowReactions(true)}
        onMouseLeave={() => setShowReactions(false)}
      >
        {/* Reactions popup - only show when hovering */}
        {showReactions && (
          <div className="absolute flex -top-12 left-5 bg-white py-3 px-3 shadow-lg border border-gray-200 rounded-md w-max z-10">
            {/* 6 emojis: like love haha wow sad angry */}
            <div className="flex items-center gap-2">
              <button className="text-gray-500 hover:text-blue-500 text-2xl cursor-pointer hover:scale-125 transition-transform">
                👍
              </button>
              <button className="text-gray-500 hover:text-red-500 text-2xl cursor-pointer hover:scale-125 transition-transform">
                ❤️
              </button>
              <button className="text-gray-500 hover:text-yellow-500 text-2xl cursor-pointer hover:scale-125 transition-transform">
                😂
              </button>
              <button className="text-gray-500 hover:text-purple-500 text-2xl cursor-pointer hover:scale-125 transition-transform">
                😮
              </button>
              <button className="text-gray-500 hover:text-blue-600 text-2xl cursor-pointer hover:scale-125 transition-transform">
                😢
              </button>
              <button className="text-gray-500 hover:text-orange-500 text-2xl cursor-pointer hover:scale-125 transition-transform">
                😡
              </button>
            </div>
          </div>
        )}
        
        <button className="flex gap-2 items-center justify-center hover:bg-gray-100 rounded-md p-2 cursor-pointer w-full">
          <FavoriteBorderIcon /> <span>Love</span>
        </button>
      </div>

      <button className="flex gap-2 items-center justify-center hover:bg-gray-100 rounded-md p-2 cursor-pointer">
        <ChatBubbleOutlineIcon /> <span>Comment</span>
      </button>
      <button className="flex gap-2 items-center justify-center hover:bg-gray-100 rounded-md p-2 cursor-pointer">
        <IosShareIcon /> <span>Share</span>
      </button>
    </div>
  );
};

export default PostActionsBottom;
