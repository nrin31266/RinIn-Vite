import React from 'react'
import type { IConversation, IConversationDto } from '../../../../store/messagingSlide'
import { useAppDispatch, useAppSelector } from '../../../../store/store';
import { useNavigate, useParams } from 'react-router-dom';
import { DateUtils } from '../../../../utils/dateUtils';

const ConversationItem = ({conversation, online, lastOnline} : {conversation : IConversationDto, online: boolean, lastOnline: string | null}) => {
   const dispatch = useAppDispatch();
    const { user } = useAppSelector((state) => state.auth);
  const { conversationId } = useParams();
  const navigate = useNavigate();
  return (
    <div onClick={() => {
      navigate(`/messaging/conversations/${conversation.conversationId}`);
    }} className={`grid grid-cols-[auto_1fr] items-center gap-2 p-2 hover:bg-gray-100 rounded-md cursor-pointer relative ${conversationId === conversation.conversationId.toString() ? "bg-gray-100" : ""}`}>
      <div className='relative'>
        <img src={conversation.otherUserProfilePictureUrl || "/avatar.jpg"} alt={conversation.otherUserId.toString()} className='rounded-full w-14 h-14 object-cover border border-gray-200' />
        {online && <div className='absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border border-white'></div>}
        {!online && lastOnline && (
          <div className='absolute -bottom-1 right-0 w-max py-0.5 px-1 h-4 bg-green-100 rounded-full border-2 border-white flex items-center justify-center'>
            <p className='text-[0.7rem] text-green-800'>{DateUtils.timeAgo(new Date(lastOnline), false)}</p>
          </div>
        )}
      </div>
      <div className='line-clamp-2 break-words w-full overflow-ellipsis'>
        <h1 className='text-sm font-bold text-gray-800'>{conversation.otherUserName}</h1>
        <p className={`text-xs ${conversation.unreadCount > 0 ? "font-bold" : "text-gray-600"}`}>{conversation.lastMessageContent || "No messages yet"}</p>
      </div>
      {conversation.unreadCount > 0 && (
        <div className='absolute top-1/2 -translate-y-1/2 right-2 bg-[var(--primary-color)] text-white text-xs font-bold w-3 h-3 p-3 rounded-full flex items-center justify-center'>
          {conversation.unreadCount > 99 ? "99+" : conversation.unreadCount}
        </div>
      )}
    </div>
  )
}

export default ConversationItem