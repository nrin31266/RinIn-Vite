import React, { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from './../../../../store/store';
import { fetchConversations } from '../../../../store/messagingSlide';
import ConversationItem from '../ConversationItem/ConversationItem';

const ListConversations = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { conversations, status } = useAppSelector((state) => state.messaging);
  

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchConversations());
    }
  }, [dispatch, user?.id]);


  return (
    <div className='overflow-auto h-[calc(100vh-10rem)] p-4 space-y-4'>
      {status.fetchConversations === "loading" ? (
        <div className='flex items-center justify-center h-full'>
          <h1 className='text-md text-gray-700'>Loading...</h1>
        </div>
      ) : (
        conversations.map((conversation) => (
          <ConversationItem
            key={conversation.conversationId}
            conversation={conversation}
          />
        ))
      )}
    </div>
  )
}

export default ListConversations