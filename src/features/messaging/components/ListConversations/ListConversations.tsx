import React, { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from './../../../../store/store';
import { fetchConversations, setConversations, type IConversationDto } from '../../../../store/messagingSlide';
import ConversationItem from '../ConversationItem/ConversationItem';
import { useWebSocket } from '../../../ws/WebSocketProvider';

const ListConversations = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { conversations, status } = useAppSelector((state) => state.messaging);
  const ws = useWebSocket();
  
  useEffect(() => {
  if (!user?.id || !ws) return;

  const subscription = ws.subscribe(`/topic/users/${user.id}/conversations`, (res) => {
    const data: IConversationDto = JSON.parse(res.body);
    dispatch(setConversations({ conversation: data, authId: user.id }));
  });

  return () => subscription.unsubscribe?.();
}, [ws, user?.id]);


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