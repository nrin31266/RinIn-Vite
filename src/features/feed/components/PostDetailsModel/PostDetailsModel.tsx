import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import IconButton from "@mui/material/IconButton";
import Modal from "@mui/material/Modal";
import React, { useEffect } from "react";
import {
  fetchPostComments,
  togglePostDetailsModel,
  type ICommentDtoRq
} from "../../../../store/postsSlice";
import { useAppDispatch, useAppSelector } from "../../../../store/store";
import PostActionsBottom from "../Post/components/PostActionsBottom/PostActionsBottom";
import PostContent from "../Post/components/PostContent/PostContent";
import PostHeader from "../Post/components/PostHeader/PostHeader";
import PostStatistical from "../Post/components/PostStatistical/PostStatistical";
import PostCommentAction from "../PostCommentAction/PostCommentAction";
import PostComments from "../PostComments/PostComments";

const PostDetailsModel: React.FC = () => {
  const { openPostDetailsModel, selectedPost } = useAppSelector(
    (state) => state.posts
  );
  const dispatch = useAppDispatch();
  const {user} = useAppSelector((state) => state.auth);
  useEffect(() => {
    if (selectedPost) {
      dispatch(fetchPostComments({ targetId: selectedPost.id, targetAction: "POST" }));
    }
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
      <div
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 
      -translate-y-1/2 w-[min(600px,100%)] bg-white shadow-lg md:rounded-lg 
      md:border border-gray-200 md:h-[90vh] h-[100vh] grid grid-rows-[auto_1fr_auto]"
      >
        <div className="p-4 relative w-full border-b border-gray-200">
          <h1 className="text-center font-bold text-xl">
            The post of {selectedPost?.author.lastName}
          </h1>
          <div className="absolute top-2 right-2 ">
            <IconButton onClick={() => dispatch(togglePostDetailsModel())}>
              <HighlightOffIcon />
            </IconButton>
          </div>
        </div>

        <div className="overflow-y-auto">
          <div className="p-4 border-b border-gray-200">
            <PostHeader post={selectedPost} onMoreClick={() => {}} />
            <PostContent post={selectedPost} />
            <PostStatistical post={selectedPost} />
            <PostActionsBottom post={selectedPost} />
          </div>
          <PostComments />
        </div>
        <div className="p-4 border-t-2 border-gray-200">
          <PostCommentAction/>
        </div>
      </div>
    </Modal>
  );
};

export default PostDetailsModel;
