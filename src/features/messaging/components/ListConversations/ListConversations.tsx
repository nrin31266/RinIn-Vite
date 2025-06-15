import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "./../../../../store/store";
import {
  fetchConversations,
  setConversations,
  updateConversationsAsRead,
  type IConversationDto,
  type IParticipantDto,
} from "../../../../store/messagingSlide";
import ConversationItem from "../ConversationItem/ConversationItem";
import { useWebSocket } from "../../../ws/WebSocketProvider";
import {
  fetchOnlineUsersByIds,
  setOnlineStatus,
  updateOnlineStatus,
  type OnlineUserDto,
} from "../../../../store/onlineUserStatusSlide";

const ListConversations = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { conversations, status } = useAppSelector((state) => state.messaging);
  const ws = useWebSocket();
  const online = useAppSelector((state) => state.onlineStatus);

  useEffect(() => {
    if (!user?.id || !ws) return;

    const subscription = ws.subscribe(
      `/topic/users/${user.id}/conversations`,
      (res) => {
        const data: IConversationDto = JSON.parse(res.body);
        dispatch(setConversations({ conversation: data, authId: user.id }));
      }
    );

    return () => subscription.unsubscribe?.();
  }, [ws, user?.id]);

  useEffect(() => {
    if (!user?.id || !ws) return;
    const subscription = ws.subscribe(
      `/topic/users/${user.id}/conversations/read`,
      (res) => {
        const data: IParticipantDto = JSON.parse(res.body);
        console.log("hihihihihihi");
        dispatch(
          updateConversationsAsRead({ participantDto: data, authId: user.id })
        );
      }
    );
    return () => subscription.unsubscribe();
  }, [ws, user?.id]);

  useEffect(() => {
    if (!user?.id || !ws) return;
    const subscription = ws.subscribe(
      `/topic/online-status`,
      (res) => {
        const data: OnlineUserDto = JSON.parse(res.body);
        dispatch(
          updateOnlineStatus(data)
        );
      }
    );
    return () => subscription.unsubscribe();
  }, [ws, user?.id]);

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchConversations())
        .unwrap()
        .then((data) => {
          const ids = data
            .filter((conv) => {
              if (conv.isGroup) return false;
              return true;
            })
            .map((conv) => conv.otherUserId);
          console.log("Fetched conversations:", ids);
          dispatch(fetchOnlineUsersByIds(ids))
            .unwrap()
            .then((onlineUsers) => {
              dispatch(setOnlineStatus(onlineUsers));
            });
        });
    }
  }, [dispatch, user?.id]);

  return (
    <div className="overflow-auto h-[calc(100vh-10rem)] p-4 space-y-4">
      {status.fetchConversations === "loading" || status.fetchConversations === "idle" ? (
        <div className="flex items-center justify-center h-full">
          <h1 className="text-md text-gray-700">Loading...</h1>
        </div>
      ) : (
        conversations.map((conversation) => {
          const lastOnline = online[conversation.otherUserId]?.lastOnline || null;
          return <ConversationItem
            key={conversation.conversationId}
            conversation={conversation}
            online={online[conversation.otherUserId]?.isOnline || false}
            lastOnline={lastOnline}
          />;
        })
      )}
    </div>
  );
};

export default ListConversations;
