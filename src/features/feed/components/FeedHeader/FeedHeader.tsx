import Divider from "@mui/material/Divider";
import { useAppDispatch, useAppSelector } from "../../../../store/store";
import { openPostCreatorModel } from "../../../../store/postCreatorSlide";

export const FeedHeader = () => {
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

    const handleCreatePost = () => {
        // Logic to open post creation modal
        dispatch(openPostCreatorModel({ from: ""}));
    }

  return (
    <div className="bg-white border-b border-gray-200 py-4 px-6 rounded-sm flex flex-col gap-3 shadow-sm">
      <div className="grid grid-cols-[auto_1fr] items-center gap-4">
        <img
          src={user?.profilePicture || "/avatar.jpg"}
          alt={user?.id.toString()}
          className="w-10 h-10 rounded-full"
        />
        <button onClick={handleCreatePost} className="ml-2 text-xs sm:text-sm text-gray-500 hover:text-gray-700 duration-300 hover:bg-gray-300 px-2 py-1.5 rounded-full bg-gray-100">
          Hey {user?.lastName || "User"}. What are you thinking?
        </button>
      </div>
      <Divider />
      <div className="grid grid-cols-[repeat(2,_1fr)] gap-4">
        <button className="text-gray-500 hover:text-gray-700 duration-300 text-sm hover:bg-gray-100 px-4 py-2 rounded-full flex items-center justify-center gap-2">
          <img src="/icons/img_video.png" alt="" /> Photo/Video 
        </button>
        <button className="text-gray-500 hover:text-gray-700 duration-300 text-sm hover:bg-gray-100 px-4 py-2 rounded-full flex items-center justify-center gap-2">
          <img src="/icons/reaction_activity.png" alt="" />Reaction/Activity
        </button>
      </div>
    </div>
  );
};
