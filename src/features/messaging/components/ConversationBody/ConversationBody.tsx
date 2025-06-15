import React, { useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../../store/store";
import { loadMoreMessages, markConversationAsRead, resetMessages, setMessages, updateConversationParticipant, type IConversationParticipant, type IParticipantDto } from "../../../../store/messagingSlide";
import MessageItem from "../MessageItem/MessageItem";
import { useParams } from "react-router-dom";
import { useWebSocket } from "../../../ws/WebSocketProvider";

const ConversationBody = () => {
  const dispatch = useAppDispatch();
  const { conversationId } = useParams();
  const { messages, status, conversation } = useAppSelector(
    (state) => state.messaging
  );
  const containerRef = useRef<HTMLDivElement>(null);
  const isLoadingRef = useRef(false);
  const ws = useWebSocket();
  const { user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (!conversationId || !user?.id || !ws || conversationId === "new") return;
    const subscription = ws.subscribe(
      `/topic/users/${user.id}/conversations/${conversationId}/messages`,
      (res) => {
        const data = JSON.parse(res.body);
        dispatch(setMessages({ newMessage: data, authId: user.id }));
      }
    );

    return () => subscription.unsubscribe?.();
  }, [conversationId, user?.id, ws]);

  useEffect(() => {
    if (!conversationId || !user?.id || !ws || conversationId === "new" || !conversation) return;
    const subscription = ws.subscribe(
      `/topic/conversations/${conversationId}/read`,
      (res) => {
        const data: IParticipantDto = JSON.parse(res.body);
        console.log(data)
        // Cập nhật lại thông tin người tham gia
        dispatch(updateConversationParticipant({ conversationId, participantDto: data, authId: user.id }));
      }
    );

    return () => subscription.unsubscribe?.();
  }, [conversationId, user?.id, ws]);

  useEffect(() => {
  if (!conversationId || !user?.id || messages.content.length === 0 || conversationId === "new" || conversationId !== loadedRef.current) return;

  const lastMessage = messages.content[0];
    const myLastReadAt = conversation?.myLastReadAt ? new Date(conversation.myLastReadAt) : -Infinity;
  if (lastMessage?.sender.id !== user.id && myLastReadAt < new Date(lastMessage.createdAt)) {
    dispatch(markConversationAsRead(conversationId));
  }
}, [conversationId, messages, user?.id]);


  


  const loadMore = async (isLoadMore: boolean) => {
    if (!conversationId || isLoadingRef.current) return;

    isLoadingRef.current = true;
    try {
      await dispatch(
        loadMoreMessages({
          conversationId,
          limit: 20,
          beforeTime: isLoadMore
            ? messages.content[messages.content.length - 1]?.createdAt
            : null,
          isLoadMore,
        })
      ).unwrap();
    } finally {
      isLoadingRef.current = false;
    }
  };


  const loadedRef = useRef<string | null>(null);
const [hasLoaded, setHasLoaded] = useState(false);
useEffect(() => {
  if (conversationId && loadedRef.current !== conversationId && !hasLoaded) {
    dispatch(resetMessages());
    loadedRef.current = conversationId;
    setHasLoaded(true);
  } else if (conversationId && loadedRef.current === conversationId && hasLoaded && loadedRef.current !== "new") {
    // Nếu conversationId đã được tải, không cần reset
    loadMore(false);
  }

}, [conversationId, hasLoaded]);




 
  useEffect(() => {
    const el = containerRef.current;
    if (!el || !messages.hasMore) return;

    const checkIfNeedMore = () => {
      if (el.scrollHeight <= el.clientHeight && !isLoadingRef.current) {
        loadMore(true);
      }
    };

    checkIfNeedMore(); // kiểm tra lần đầu khi mount hoặc khi `messages` thay đổi

    const observer = new ResizeObserver(checkIfNeedMore);
    observer.observe(el);

    return () => observer.disconnect();
  }, [messages.hasMore, messages.content.length, loadMore]);

  // Scroll để load thêm khi gần cuối
  const handleScroll = () => {
    const el = containerRef.current;
    if (!el || !messages.hasMore || isLoadingRef.current) return;

    const distanceToBottom = el.scrollHeight + el.scrollTop - el.clientHeight;
    if (distanceToBottom < 100) {
      loadMore(true);
    }
  };

  if (
    status.fetchConversation === "loading" ||
    status.fetchConversation === "idle"
  ) {
    return (
      <div className="flex items-center justify-center h-full">
        <h1 className="text-md text-gray-700">Loading...</h1>
      </div>
    );
  }

  if (!conversation) {
    return null;
  }

// const lastSeenMap = new Map<string, typeof conversation.participants>();

// if (conversation) {
//   const participants = conversation.participants;

//   // Duyệt từng message từ cuối lên đầu
//   for (let i = messages.content.length - 1; i >= 0; i--) {
//     const msg = messages.content[i];
//     const prev = messages.content[i - 1] || null;
//     const msgTime = new Date(msg.createdAt).getTime();
//     const prevTime = prev ? new Date(prev.createdAt).getTime() : -Infinity;

//     // Lọc ra những người có lastReadAt nằm giữa msg và msg trước
//     const seenBy = participants.filter((p) => {
//       const seenTime = new Date(p.lastReadAt).getTime();
//       return seenTime >= msgTime && seenTime < prevTime;
//     });

//     if (seenBy.length > 0) {
//       lastSeenMap.set(msg.id.toString(), seenBy);
//     }
//   }
// }



  return (
    <div
      ref={containerRef}
      className="overflow-auto flex flex-col-reverse p-2 gap-4"
      onScroll={handleScroll}
    >
      {messages.content.map((message, index) => {
  const seenParticipants = conversation.participants.filter((p) => {

    const lastReadAt = new Date(p.lastReadAt).getTime();
    const messageTime = new Date(message.createdAt).getTime();
    if ( lastReadAt < messageTime) return false;
    const nextMessageTime = messages.content[index - 1] ? new Date(messages.content[index - 1].createdAt).getTime() : Infinity;


    return lastReadAt >= messageTime && lastReadAt < nextMessageTime;
  })

  return (
    <div key={message.id + message.createdAt} className="relative">
      <MessageItem message={message} />

      {seenParticipants.length > 0 && (
        <div className="flex flex-row-reverse mt-1 gap-1">
          {seenParticipants.map((p) => (
            <img
              id={p.id.toString()}
              key={p.id}
              src={p.user.profilePicture || "/avatar.jpg"}
              alt={p.user.firstName}
              title={`${p.user.firstName} đã xem`}
              className="w-5 h-5 rounded-full border border-white shadow object-cover"
            />
          ))}
        </div>
      )}
    </div>
  );
})}

    </div>
  );
};

export default ConversationBody;
