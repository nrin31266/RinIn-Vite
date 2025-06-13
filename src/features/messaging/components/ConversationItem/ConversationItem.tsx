import React from 'react'
import type { IConversation, IConversationDto } from '../../../../store/messagingSlide'
import { useAppDispatch, useAppSelector } from '../../../../store/store';
import { useNavigate, useParams } from 'react-router-dom';

const ConversationItem = ({conversation} : {conversation : IConversationDto}) => {
   const dispatch = useAppDispatch();
    const { user } = useAppSelector((state) => state.auth);
  const { conversationId } = useParams();
  const navigate = useNavigate();
  return (
    <div onClick={() => {
      navigate(`/messaging/conversations/${conversation.conversationId}`);
    }} className={`grid grid-cols-[auto_1fr] items-center gap-2 p-2 hover:bg-gray-100 rounded-md cursor-pointer relative ${conversationId === conversation.conversationId.toString() ? "bg-gray-100" : ""}`}>
      <div>
        <img src={conversation.otherUserProfilePictureUrl || "/avatar.jpg"} alt={conversation.otherUserId.toString()} className='rounded-full w-14 h-14 object-cover border border-gray-200' />
      </div>
      <div>
        <h1 className='text-sm font-bold text-gray-800'>{conversation.otherUserName}</h1>
        <p className={`text-xs ${conversation.unreadCount > 0 ? "font-bold" : "text-gray-600 line-clamp-1 overflow-ellipsis"}`}>{conversation.lastMessageContent || "No messages yet"}</p>
      </div>
      {conversation.unreadCount > 0 && (
        <div className='absolute top-1/2 -translate-y-1/2 right-2 bg-[var(--primary-color)] text-white text-xs font-bold w-3 h-3 p-3 rounded-full flex items-center justify-center'>
          {conversation.unreadCount> 99 ? "99+" : conversation.unreadCount}
        </div>
      )}
    </div>
  )
}

export default ConversationItem