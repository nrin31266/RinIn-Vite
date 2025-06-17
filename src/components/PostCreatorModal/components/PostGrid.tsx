import React from "react";

export const PostGrid = ({ files }: { files: File[] }) => {
  const urls = files.map((file) => URL.createObjectURL(file));

  if (urls.length === 1) {
    return (
      <div className="flex justify-center">
        <img
          src={urls[0]}
          alt="Post content"
          className="w-full h-full object-cover rounded-md"
        />
      </div>
    );
  }

  if (urls.length === 2) {
    return (
      <div className="grid grid-cols-2 gap-2">
        {urls.map((url, i) => (
          <div key={i} className="flex justify-center">
            <img
              src={url}
              alt={`Post content ${i}`}
              className="max-w-full max-h-[300px] object-cover rounded-md"
            />
          </div>
        ))}
      </div>
    );
  }

  if (urls.length === 3) {
    return (
      <div className="grid grid-cols-2 gap-2">
        {urls.slice(0, 2).map((url, i) => (
          <div key={i} className="flex justify-center">
            <img
              src={url}
              alt={`Post content ${i}`}
              className="max-w-full max-h-[300px] object-cover rounded-md"
            />
          </div>
        ))}
        <div className="flex justify-center">
          <img
            src={urls[2]}
            alt="Post content 3"
            className="max-w-full max-h-[300px] object-cover rounded-md"
          />
        </div>
      </div>
    );
  }

  if (urls.length === 4) {
   
  }

  if (urls.length >= 5) {
   
  }

  return null;
};


export default PostGrid;
