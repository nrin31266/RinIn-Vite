import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  Navigate,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../../store/store";
import {
  checkConversation,
  fetchConversation,
  setRecipient,
} from "../../../../store/messagingSlide";
import CircularProgress from "@mui/material/CircularProgress";
import { fetchConnections } from "../../../../store/networkingSlide";
import type { IUser } from "../../../../store/authSlice";
import ConversationHeader from "../../components/ConversationHeader/ConversationHeader";
import ConversationBody from "../../components/ConversationBody/ConversationBody";
import ConversationBottom from "../../components/ConversationBottom/ConversationBottom";

const Conversation = () => {
  const { conversationId } = useParams();
  const [searchParams] = useSearchParams();
  const recipientId = searchParams.get("recipientId") || null;
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { status } = useAppSelector((state) => state.messaging);

  // if (conversationId === "new" && !recipientId) {
  //   return <Navigate to="/messaging" replace />;
  // }

  useEffect(() => {
    if (conversationId === "new" && recipientId) {
      dispatch(checkConversation(recipientId))
        .unwrap()
        .then((data) => {
          if (data.isConversationExists == true) {
            navigate(`/messaging/conversations/${data.conversationId}`, {
              state: { recipientId },
            });
          } else {
            dispatch(setRecipient(data.receiver));
          }
        });
    } else if (conversationId && conversationId !== "new") {
      dispatch(fetchConversation(conversationId))
        .unwrap()
        .then((data) => {
          dispatch(setRecipient(
            data.author.id === user?.id ? data.recipient : data.author
          ));
        });
    }
  }, [conversationId, recipientId]);



  return status.checkConversation === "loading" ||
    status.fetchConversation === "loading" ? (
    <div className="flex items-center justify-center h-full">
      <CircularProgress size={48} color="primary" />
    </div>
  ) : (
    <div className="grid grid-rows-[auto_1fr_auto] max-h-[calc(100vh-6rem)] h-full">
      <div className="border-b border-gray-200 h-[4rem]"><ConversationHeader/></div>
      <div className="overflow-auto"><ConversationBody/></div>
      <ConversationBottom/>
    </div>
  );
};

export default Conversation;
