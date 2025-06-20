import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../store/store";
import Skeleton from "@mui/material/Skeleton";
import {
  fetchPostBackgrounds,
  setSelectPostBgId,
} from "../../../store/postCreatorSlide";
// background-image: linear-gradient(135deg, rgba(234, 234, 234,0.06) 0%, rgba(234, 234, 234,0.06) 50%,rgba(169, 169, 169,0.06) 50%, rgba(169, 169, 169,0.06) 100%),linear-gradient(90deg, rgb(20,20,20),rgb(20,20,20)); background-size: 72px 72px;
const PostBgs = () => {
  const dispatch = useAppDispatch();
  const { postBgs, status, error, postRq } = useAppSelector(
    (state) => state.postCreator
  );
  useEffect(() => {
  if (status.fetchPostBackgrounds === "idle") {
    dispatch(fetchPostBackgrounds());
  }
}, [dispatch, status.fetchPostBackgrounds]);

  return (
    <div>
      {status.fetchPostBackgrounds === "loading" ||
      status.fetchPostBackgrounds === "idle" ? (
        <Skeleton variant="text" sx={{ fontSize: "4rem" }} />
      ) : error.fetchPostBackgrounds ? (
        <div className="flex items-center justify-center h-20">
          {error.fetchPostBackgrounds}
        </div>
      ) : (
        <div className="flex flex-none-wrap gap-4 overflow-auto">
          <div
            className={`w-[3rem] h-[3rem] relative ${
              undefined === postRq.postBgId
                ? "border-b-10 border-[var(--primary-color-dark)] pb-1"
                : ""
            }`}
            onClick={() => {
              dispatch(setSelectPostBgId({ selectPostBgId: undefined }));
            }}
          >
            <div className="w-[3rem] flex items-center justify-center h-full cursor-pointer rounded-md border-2 border-dashed border-gray-300">
              <span>Aa</span>
            </div>
          </div>
          {postBgs.map((bg) => (
            <div key={bg.id}>
              <div
                className={`w-[3rem] h-[3rem] relative ${
                  bg.id === postRq.postBgId
                    ? "border-b-10 border-[var(--primary-color-dark)] pb-1"
                    : ""
                }`}
                onClick={() => {
                  dispatch(setSelectPostBgId({ selectPostBgId: bg.id }));
                }}
              >
                {bg.type === "COLOR" ? (
                  <div
                    className="w-full h-full  rounded-md"
                    style={{ backgroundColor: bg.bgColor }}
                  ></div>
                ) : bg.type === "IMAGE_URL" ? (
                  <img
                    className="w-full h-full object-cover rounded-md"
                    src={bg.bgImgUrl}
                    alt=""
                  />
                ) : null}
                <span
                  className="absolute inset-0 flex items-center justify-center  cursor-pointer"
                  style={{ color: bg.textColor }}
                >
                  Aa
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PostBgs;
