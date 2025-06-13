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
  addMessageToConversation,
  checkConversation,
  createConversation,
  fetchConversation,
  setRecipient,
  type IMessageDto,
} from "../../../../store/messagingSlide";
import CircularProgress from "@mui/material/CircularProgress";
import ConversationHeader from "../../components/ConversationHeader/ConversationHeader";
import ConversationBody from "../../components/ConversationBody/ConversationBody";
import ConversationBottom from "../../components/ConversationBottom/ConversationBottom";
import type { IUser } from "../../../../store/authSlice";

const Conversation = () => {
  const { conversationId } = useParams();
  const [searchParams] = useSearchParams();
  const recipientId = searchParams.get("recipientId") || null;
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { status } = useAppSelector((state) => state.messaging);
  const { conversation } = useAppSelector((state) => state.messaging);

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
          const recipient= {
            id: data.otherUserId,
            lastName: data.otherUserLastName || "",
            firstName: data.otherUserFirstName || "",
            profilePicture: data.otherUserProfilePictureUrl || "",
            position: data.otherUserPosition || "",
            company: data.otherUserCompany || "",
          }
          dispatch(
            setRecipient(
              recipient as IUser
            )
          );
        });
    }
  }, [conversationId, recipientId]);

  return status.checkConversation === "loading" ||
    status.fetchConversation === "loading" ? (
    <div className="flex items-center justify-center h-full">
      <CircularProgress size={48} color="primary" />
    </div>
  ) : (
    <div className="grid grid-rows-[auto_1fr_auto] max-h-[calc(100vh-6rem)] h-[calc(100vh-6rem)]">
      <div className="border-b border-gray-200 h-[4.05rem]">
        <ConversationHeader />
      </div>

      <ConversationBody />

      <ConversationBottom
        onSendMessage={async (message) => {
          if (!conversation?.conversationId && !recipientId) {
            return;
          }
          const messageDto: IMessageDto = {
            receiverId: recipientId
              ? parseInt(recipientId)
              : conversation?.otherUserId!!,
            content: message,
          };

          if (conversationId === "new" && recipientId) {
            await dispatch(createConversation(messageDto))
              .unwrap()
              .then((data) => {
                navigate(`/messaging/conversations/${data.conversationId}`);
              });
          } else if (conversationId && conversationId !== "new") {
            await dispatch(
              addMessageToConversation({ conversationId, message: messageDto })
            ).unwrap();
          }
        }}
      />
    </div>
  );
};

export default Conversation;
