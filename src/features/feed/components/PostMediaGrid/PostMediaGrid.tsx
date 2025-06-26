import React from "react";
import RowsPhotoAlbum from "react-photo-album";
import type { IPostMedia } from "../../../../store/feedSlide";
import "react-photo-album/rows.css";
const PostMediaGrid = ({ postMedias }: { postMedias: IPostMedia[] }) => {
  const maxShow = 6;
  const extra = postMedias.length - maxShow;
  const shownMedias = postMedias.slice(0, maxShow);

  const photos = shownMedias.map((media, idx) => ({
    src: media.mediaUrl,
    width: media.width || 1,
    height: media.height || 1,
    alt: media.content || "Post Media",
    key: media.id.toString(),
    index: idx, // để mapping lại mediaType
  }));


  return (
    <RowsPhotoAlbum
      layout="rows"
      photos={photos}
      spacing={8}

      skeleton={<div style={{ width: "100%", minHeight: 800 }} />}
      render={{
        // extras: (_, { photo, index }) => (
        //   <div className="absolute top-0">Favorite Icon</div>
        // ),
        image: (props, { photo, index }) => {
          const media = postMedias[index];
          if (media.mediaType === "VIDEO") {
            return (
              <video src={media.mediaUrl} controls>
                <source src={media.mediaUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            );
          }
          return (
            <div>
              <img {...props}/>
              {index === maxShow - 1 && extra > 0 && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-2xl font-bold text-white">
                  +{extra}
                </div>
              )}
            </div>
          );
        },
      }}
    />
  );
};

export default PostMediaGrid;
