import React, { useState } from "react";
import { useAppSelector } from "../../../../store/store";
import type { ICommentDto } from "../../../../store/postsSlice";
import PostCommentAction from "../PostCommentAction/PostCommentAction";
import { DateUtils } from "../../../../utils/dateUtils";
import Comments from "./components/Comments";

const buildCommentTree = (comments: ICommentDto[]) => {
  // Map id => comment để tiện lookup
  const commentMap = new Map<number, ICommentDto>();
  comments.forEach((comment) => {
    const newComment = { ...comment, replies: [] };
    commentMap.set(newComment.id, newComment);
  });
  const tree: ICommentDto[] = [];
  commentMap.forEach((comment) => {
    if (comment.parentCommentId === null) {
      tree.push(comment);
    } else {
      const parent = commentMap.get(comment.parentCommentId);
      if (parent) {
        parent.replies!.push(comment);
      }
    }
  });
  return tree;
};

const PostComments = () => {
  const auth = useAppSelector((state) => state.auth);
  const { currentPostComments, status, error, selectedPost } = useAppSelector(
    (state) => state.posts
  );
  const commentTree = buildCommentTree(currentPostComments);
  
 


  return status.fetchComments === "loading" ||
    status.fetchComments === "idle" ? (
    <div className="text-center text-gray-500">Loading comments...</div>
  ) : currentPostComments.length === 0 ? (
    <div className="text-center text-gray-500">No comments yet.</div>
  ) : (
    <div className="p-2 space-y-2">{<Comments comments={commentTree} level={0} />}</div>
  );
};

export default PostComments;
