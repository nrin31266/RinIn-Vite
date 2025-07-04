import React, { useState, useRef, useEffect } from "react";
import { reactToPost, setSelectedPost, togglePostDetailsModel, unReactToPost, type IPostDto } from "../../../../../../store/postsSlice";
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import IosShareIcon from '@mui/icons-material/IosShare';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import { useAppDispatch } from "../../../../../../store/store";
import { mapReactionIcon } from "../PostStatistical/PostStatistical";

const PostActionsBottom = ({ post }: { post: IPostDto }) => {
  const [showReactions, setShowReactions] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const longPressRef = useRef<boolean>(false);
  const isTouchDevice = useRef<boolean>(false);
  const dispatch = useAppDispatch();

  // Cleanup timeout khi component unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleTouchStart = () => {
    isTouchDevice.current = true; // Đánh dấu là touch device
    longPressRef.current = false;
    // Hiện popup sau 500ms (long press)
    timeoutRef.current = setTimeout(() => {
      longPressRef.current = true;
      setShowReactions(true);
    }, 500);
  };

  const handleTouchEnd = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    // Nếu không phải long press, gửi like mặc định
    if (!longPressRef.current) {
      console.log("Quick tap!");
    
      if(post.isReacted && post.myReactType) {
        // Nếu đã có phản ứng, thì bỏ phản ứng
        handleUnReact();
      } else {
        handleReactionClick('LOVE');
      }
    }
  };

  const handleMouseDown = () => {
    if (isTouchDevice.current) return; // Bỏ qua nếu là touch device
    
    // Trên desktop không cần long press, chỉ cần click thường để like
    longPressRef.current = false;
  };

  const handleMouseUp = () => {
    if (isTouchDevice.current) return; // Bỏ qua nếu là touch device
    // Click thường trên desktop = gửi like ngay
    console.log("Desktop click!");
    if(post.isReacted && post.myReactType) {
      // Nếu đã có phản ứng, thì bỏ phản ứng
      handleUnReact();
    }else{
      handleReactionClick("LOVE");
    }
  };

  const handleMouseEnter = () => {
    if (isTouchDevice.current) return; // Bỏ qua hover trên touch device
    
    // Bắt đầu đếm thời gian hover
    longPressRef.current = false;
    timeoutRef.current = setTimeout(() => {
      longPressRef.current = true;
      setShowReactions(true);
    }, 0);
  };

  const handleMouseLeave = () => {
    if (isTouchDevice.current) return; // Bỏ qua nếu là touch device
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    // Ẩn popup khi hover ra ngoài
    setShowReactions(false);
  };

  const handleUnReact = () => {
    setShowReactions(false);
    if (post.isReacted && post.myReactType) {
      dispatch(unReactToPost({
        targetId: post.id,
        reactType: post.myReactType,
        targetAction: "POST"
      }));
    }
  };

  const handleReactionClick = (reactionType: 'LIKE' | 'LOVE' | 'WOW' | 'HAHA' | 'SAD' | 'ANGRY') => {
    console.log(`Selected reaction: ${reactionType}`);
    // TODO: Gửi reaction lên server
    setShowReactions(false);
    dispatch(reactToPost({
      targetId: post.id,
      reactType: reactionType,
      targetAction: "POST"
    }));
  };
  
  return (
    <div className="mt-4 w-full grid grid-cols-3 gap-4 text-gray-500 text-sm">
      {/* Like button with long press to show reactions */}
      <div 
        className="relative"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Reactions popup - only show when long pressing */}
        {showReactions && (
          <div className="absolute -top-16 left-0 z-10">
            {/* Main popup */}
            <div className="bg-white py-4 px-4 shadow-lg border border-gray-200 rounded-md w-max">
              {/* 6 emojis: like love haha wow sad angry */}
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => handleReactionClick('LIKE')}
                  className="text-gray-500 hover:text-blue-500 text-2xl cursor-pointer hover:scale-125 transition-transform"
                >
                  👍
                </button>
                <button 
                  onClick={() => handleReactionClick('LOVE')}
                  className="text-gray-500 hover:text-red-500 text-2xl cursor-pointer hover:scale-125 transition-transform"
                >
                  ❤️
                </button>
                <button 
                  onClick={() => handleReactionClick('HAHA')}
                  className="text-gray-500 hover:text-yellow-500 text-2xl cursor-pointer hover:scale-125 transition-transform"
                >
                  😂
                </button>
                <button 
                  onClick={() => handleReactionClick('WOW')}
                  className="text-gray-500 hover:text-purple-500 text-2xl cursor-pointer hover:scale-125 transition-transform"
                >
                  😮
                </button>
                <button 
                  onClick={() => handleReactionClick('SAD')}
                  className="text-gray-500 hover:text-blue-600 text-2xl cursor-pointer hover:scale-125 transition-transform"
                >
                  😢
                </button>
                <button 
                  onClick={() => handleReactionClick('ANGRY')}
                  className="text-gray-500 hover:text-orange-500 text-2xl cursor-pointer hover:scale-125 transition-transform"
                >
                  😡
                </button>
              </div>
            </div>
            {/* Arrow pointing down */}
           
          </div>
        )}
        
        <button 
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          className="flex gap-2 items-center justify-center hover:bg-gray-100 rounded-md h-full cursor-pointer w-full"
        >

          {post.isReacted && post.myReactType ? <><div className="text-2xl">{mapReactionIcon(post.myReactType)}</div></> : <><FavoriteBorderIcon /> <span>Like</span></>}
        </button>
      </div>

      <button onClick={()=>{
        dispatch(setSelectedPost(post));
         dispatch(togglePostDetailsModel());
      }} className="flex gap-2 items-center justify-center hover:bg-gray-100 rounded-md p-2 cursor-pointer">
        <ChatBubbleOutlineIcon /> <span>Comment</span>
      </button>
      <button className="flex gap-2 items-center justify-center hover:bg-gray-100 rounded-md p-2 cursor-pointer">
        <IosShareIcon /> <span>Share</span>
      </button>
    </div>
  );
};

export default PostActionsBottom;
