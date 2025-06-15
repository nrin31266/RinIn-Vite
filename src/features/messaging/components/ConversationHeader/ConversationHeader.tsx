import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import IconButton from "@mui/material/IconButton";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../../../store/store";
import { DateUtils } from '../../../../utils/dateUtils';
const ConversationHeader = () => {
  const navigate = useNavigate();
  const { recipient } = useAppSelector((state) => state.messaging);
  const onlineStatus = useAppSelector((state) => state.onlineStatus);

  if (!recipient) {
    return null; // or a loading state
  }
  const isOnline = onlineStatus[recipient.id]?.isOnline || false;
  const lastOnline = onlineStatus[recipient.id]?.lastOnline || recipient.lastLogin || null;

  return (
    <div className="grid lg:grid-cols-[auto_1fr_auto] grid-cols-[auto_auto_1fr_auto] gap-4 items-center px-4 border-gray-200 h-full">
      <div className="lg:hidden block">
        <IconButton onClick={() => navigate("/messaging")}>
        <ChevronLeftIcon />
      </IconButton>
      </div>
      <div className='relative'>
        <img
        src={recipient?.profilePicture || "/avatar.jpg"}
        alt=""
        className="h-12 w-12 object-cover rounded-full"
      />
      {isOnline && <div className='absolute -bottom-0.5 right-0 w-4 h-4 bg-green-500 rounded-full border border-white'></div>}
      
      </div>
     <div>
         <h1 className="text-md font-bold text-gray-800">
        {recipient?.firstName + " " + recipient?.lastName}
      </h1>
      <h2 className="text-sm text-gray-600">{recipient?.position + " at " + recipient?.company}</h2>
      {!isOnline && lastOnline && <p className="text-xs text-gray-400">Active {DateUtils.timeAgo(new Date(lastOnline))}</p>}
     </div>
      <IconButton>
        <MoreHorizIcon />
      </IconButton>
    </div>
  );
};

export default ConversationHeader;
