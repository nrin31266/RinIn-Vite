import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import React, { useRef, useState } from "react";

const ConversationBottom = () => {
  const [message, setMessage] = useState("");
  const messageInputRef = useRef<HTMLTextAreaElement>(null);
  const defaultHeight = 44;

  const handleSendMessage = async () => {
    if (!message.trim()) return;
    setMessage("");
    console.log("Message sent:", message);
    
    if (messageInputRef.current) {
      messageInputRef.current.style.height = defaultHeight + "px"; // reset height after sending
      messageInputRef.current.style.overflowY = "hidden"; // reset hide scroll
      messageInputRef.current.focus();
    }
  };

  return (
    <div className="p-2 border-t-1 border-gray-300">
      <div className="relative flex items-center justify-center">
        <textarea
          ref={messageInputRef}
          className={`
          w-full
          min-h-[${defaultHeight}px]
          max-h-[200px]
          resize-none
          rounded-sm
          border-2
          border-gray-300
          focus:border-[var(--primary-color)]
          focus:outline-none
          pl-3
          py-2.5
          pr-[3rem]
          text-base
          text-gray-900
          placeholder:text-gray-400
          box-border
          leading-5
        `}
          style={{
            fontSize: "1rem",
            height: defaultHeight + "px",
            overflowY: "hidden", // ẩn scroll mặc định
          }}
          placeholder="Type your message..."
          rows={1}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSendMessage();
            }
          }}
          onInput={(e) => {
            const target = e.target as HTMLTextAreaElement;

            // Reset chiều cao để tính scrollHeight chính xác
            target.style.height = "auto";

            const scrollHeight =
              target.scrollHeight < defaultHeight
                ? defaultHeight
                : target.scrollHeight;
            const maxHeight = 200;

            if (scrollHeight > maxHeight) {
              target.style.height = `${maxHeight}px`;
              target.style.overflowY = "auto"; // hiện scroll
            } else {
              target.style.height = `${scrollHeight}px`;
              target.style.overflowY = "hidden"; // ẩn scroll
            }
          }}
        />
        <div className="absolute top-1/2 right-3 pb-1 transform -translate-y-[50%] flex flex-col-reverse h-full">
          <button
            onClick={handleSendMessage}
            className={`text-gray-500 p-2 rounded-full ${
              message.trim()
                ? "cursor-pointer text-white bg-[var(--primary-color)] hover:bg-[var(--primary-color-dark)]"
                : "cursor-not-allowed bg-gray-200"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
              fill="currentColor"
              height={20}
              width={20}
            >
              <path d="M16.1 260.2c-22.6 12.9-20.5 47.3 3.6 57.3L160 376l0 103.3c0 18.1 14.6 32.7 32.7 32.7c9.7 0 18.9-4.3 25.1-11.8l62-74.3 123.9 51.6c18.9 7.9 40.8-4.5 43.9-24.7l64-416c1.9-12.1-3.4-24.3-13.5-31.2s-23.3-7.5-34-1.4l-448 256zm52.1 25.5L409.7 90.6 190.1 336l1.2 1L68.2 285.7zM403.3 425.4L236.7 355.9 450.8 116.6 403.3 425.4z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConversationBottom;
