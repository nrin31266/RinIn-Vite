import React, { use, useEffect } from "react";
import {
  togglePostDetailsModel,
  type IPostDto,
} from "../../../../store/feedSlide";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import PostHeader from "../Post/components/PostHeader/PostHeader";
import PostContent from "../Post/components/PostContent/PostContent";
import PostStatistical from "../Post/components/PostStatistical/PostStatistical";
import PostActionsBottom from "../Post/components/PostActionsBottom/PostActionsBottom";
import { useAppDispatch, useAppSelector } from "../../../../store/store";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "min(800px, 100%)",
  bgcolor: "background.paper",
  border: "1px solid #e0e0e0",
  boxShadow: 24,
  borderRadius: "8px",
  height: "86vh",
};

const PostDetailsModel: React.FC = () => {
  const { openPostDetailsModel, selectedPost } = useAppSelector(
    (state) => state.feed
  );
  const dispatch = useAppDispatch();

  useEffect(() => {
    console.log("Selected post in PostDetailsModel:", selectedPost);
  }, [selectedPost?.id]);
  if (!selectedPost) {
    return null; // or you can return a loading state
  }

  return (
    <Modal
      open={openPostDetailsModel}
      onClose={() => dispatch(togglePostDetailsModel())}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <div className="p-4 relative w-full">
          <h1 className="text-center font-bold text-xl">
            The post of {selectedPost?.author.lastName}
          </h1>
          <div className="absolute top-2 right-2 ">
            <IconButton onClick={() => dispatch(togglePostDetailsModel())}>
              <HighlightOffIcon />
            </IconButton>
          </div>
        </div>

        <Divider />
        <div className="p-4 h-full overflow-y-auto">
          <PostHeader post={selectedPost} onMoreClick={() => {}} />
          <PostContent post={selectedPost} />
          <PostStatistical post={selectedPost} />
          <PostActionsBottom post={selectedPost} />
        </div>
      </Box>
    </Modal>
  );
};

export default PostDetailsModel;
