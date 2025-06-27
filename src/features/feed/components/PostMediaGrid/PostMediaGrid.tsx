import React from "react";
import RowsPhotoAlbum from "react-photo-album";
import type { IPostMedia } from "../../../../store/feedSlide";
import "react-photo-album/rows.css";
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
const PostMediaGrid = ({ postMedias }: { postMedias: IPostMedia[] }) => {
  const maxShow = 6;
  const extra = postMedias.length - maxShow;
  const shownMedias = postMedias.slice(0, maxShow);



  if(postMedias.length === 1 && postMedias[0].mediaType === "VIDEO") {
    // Nếu chỉ có 1 video, thì show video luôn
    return (
      <div className="w-full h-full relative">
        <video 
          src={postMedias[0].mediaUrl} 
          className="w-full h-full object-cover"
          controls
        />
      </div>
    );
  }


  const photos = shownMedias.map((media, idx) => ({
    src: media.mediaType === "VIDEO" ? media.thumbnailUrl || "" : media.mediaUrl,
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
        image: (props, { photo, index }) => {
          const currentMedia = postMedias[photo.index];
          return (
            <div>
              <img {...props}/>
              {currentMedia.mediaType === "VIDEO" && index !== maxShow - 1  && (
                // Nút play ảo
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-2xl font-bold text-white">
                  <PlayCircleOutlineIcon color="secondary"/>
                </div>
              )}
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
