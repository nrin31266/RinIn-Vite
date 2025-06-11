import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import React, { useEffect, useState } from "react";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import IconButton from "@mui/material/IconButton";
import DoNotDisturbOnOutlinedIcon from "@mui/icons-material/DoNotDisturbOnOutlined";
import ListConversations from "../ListConversations/ListConversations";
import SearchConversations from "../SearchConversations/SearchConversations";
import { useAppDispatch, useAppSelector } from "../../../../store/store";
import type { IUser } from "../../../../store/authSlice";
import { fetchConnections } from "../../../../store/networkingSlide";
const MessagingLeftBar = () => {
  const [search, setSearch] = useState(false);
  const dispatch = useAppDispatch();
  const [contacts, setContacts] = useState<IUser[]>([]);

  const { user } = useAppSelector((state) => state.auth);
  const { status } = useAppSelector((state) => state.networking);
  useEffect(() => {
    dispatch(fetchConnections())
      .unwrap()
      .then((data) => {
        setContacts(
          data.map((connection) =>
            connection.author.id === user?.id
              ? connection.recipient
              : connection.author
          )
        );
      });
  }, [dispatch, user?.id]);

  return (
    <div>
      <div className="p-2 flex justify-between items-center h-[4rem]">
        <h1 className="text-md font-bold text-gray-800">Messaging</h1>
        <IconButton onClick={() => setSearch(!search)} className="" size="small">
          {!search ? (
            <AddCircleOutlineIcon

              className="text-gray-600 hover:text-gray-800"
            />
          ) : (
            <DoNotDisturbOnOutlinedIcon
              className="text-gray-600 hover:text-gray-800"
            />
          )}
        </IconButton>
      </div>
      <Divider />
      <div style={{ display: search ? "none" : "block" }}>
        <ListConversations />
      </div>
      <div style={{ display: search ? "block" : "none" }}>
        <SearchConversations
          autoFocus={search}
          contacts={contacts}
          loading={status.fetchConnections === "loading"}
        />
      </div>
    </div>
  );
};

export default MessagingLeftBar;
