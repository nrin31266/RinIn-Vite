import React from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../../store/store";
import IconButton from "@mui/material/IconButton";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
const ConversationHeader = () => {
  const { conversationId } = useParams();
  const [searchParams] = useSearchParams();
  const recipientId = searchParams.get("recipientId") || null;
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { recipient } = useAppSelector((state) => state.messaging);

  return (
    <div className="grid grid-cols-[auto_1fr_auto] gap-4 items-center px-4 border-gray-200 h-full">
      <img
        src={recipient?.profilePicture || "/avatar.jpg"}
        alt=""
        className="h-12 w-12 object-cover rounded-full"
      />
     <div>
         <h1 className="text-md font-bold text-gray-800">
        {recipient?.firstName + " " + recipient?.lastName}
      </h1>
      <p className="text-sm text-gray-600">{recipient?.position + " at " + recipient?.company}</p>
     </div>
      <IconButton>
        <MoreHorizIcon />
      </IconButton>
    </div>
  );
};

export default ConversationHeader;
