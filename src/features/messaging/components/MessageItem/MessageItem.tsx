
import React, { useEffect } from 'react'
import type { IMessage } from '../../../../store/messagingSlide'
import type { IUser } from '../../../../store/authSlice'
import { useAppDispatch, useAppSelector } from '../../../../store/store'
import { DateUtils } from '../../../../utils/dateUtils'
import { useWebSocket } from '../../../ws/WebSocketProvider'

const MessageItem = ({message} : {message: IMessage}) => {
  const {user} = useAppSelector((state) => state.auth)
  const isSender = message.sender.id === user?.id;
  const {conversation} = useAppSelector((state) => state.messaging)
  const dispatch = useAppDispatch();
  const ws = useWebSocket();
  if (!message || !conversation) return null;

  

  return (
     <div className={`flex space-x-2 ${isSender ? 'justify-end' : 'justify-start'} w-full`}>
        {!isSender && <div className='h-full items-end flex'><img
          src={isSender ? user?.profilePicture || '/avatar.jpg' : message.sender.profilePicture || '/avatar.jpg'}
          className="rounded-full w-10 h-10 object-cover border border-gray-200"
        /></div>}
        <div className=' max-w-[70%]'>
          {!isSender && <h1 className="text-sm font-bold text-gray-800">
            {isSender ? user?.firstName : message.sender.firstName} {isSender ? user?.lastName : message.sender.lastName}
          </h1>}
          <div className={`text-sm text-gray-600 border py-2 px-4 ${isSender ? 'bg-[var(--primary-color)] text-white rounded-[0.5rem_0.5rem_0rem_0.5rem]' :
             'bg-gray-400 text-white rounded-[0.5rem_0.5rem_0.5rem_0rem]'}`}>
              <p>{message.content}</p>
              <div className='flex items-center justify-between mt-1'>
                <span className="text-[0.7rem] text-gray-200">{DateUtils.timeAgo(new Date(message.createdAt))}</span>
                {/* {
                  !isSender && conversation.participants[0].lastReadAt && <span>{new Date(conversation.participants[0].lastReadAt).getTime() >= 
                    new Date(message.createdAt).getTime() ? 'Đã xem' : 'Chưa xem'}</span>
                } */}
               
              </div>
             </div>
        </div>
      </div>
  )
}

export default MessageItem