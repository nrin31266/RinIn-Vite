import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../../store/store";
import {
  fetchInvitations,
  setConnections,
  setInvitations,
  type IConnection,
} from "../../../../store/networkingSlide";
import Divider from "@mui/material/Divider";
import ConnectionCard from "../../components/ConnectionCard/ConnectionCard";
import { useWebSocket } from "../../../ws/WebSocketProvider";

const Invitations = () => {
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const { invitations, error, status, connections } = useAppSelector(
    (state) => state.networking
  );
  const [sent, setSent] = useState(false);
  const ws = useWebSocket();
  const filteredConnections = sent
    ? invitations.filter((invitation) => invitation.author.id === user?.id)
    : invitations.filter((invitation) => invitation.recipient.id === user?.id);

  useEffect(() => {
    dispatch(fetchInvitations());
  }, [dispatch, user?.id]);

  useEffect(() => {
    const subscription = ws?.subscribe(
      `/topic/users/${user?.id}/connections/new`,
      (res) => {
        const data: IConnection = JSON.parse(res.body);
        if (data && data.recipient.id === user?.id) {
          const newInvitations = [...invitations, data];
          dispatch(setInvitations(newInvitations));
        }
      }
    );

    return () => subscription?.unsubscribe();
  }, [ws, user?.id]);

  useEffect(() => {
    const subscription = ws?.subscribe(
      `/topic/users/${user?.id}/connections/accepted`,
      (res) => {
        const data: IConnection = JSON.parse(res.body);
        if (data && data.author.id === user?.id) {
            const newInvitations = invitations.filter(
                (invitation) => invitation.id !== data.id
            );
            dispatch(setInvitations(newInvitations));
            const newConnections = [...connections, data];
            dispatch(setConnections(newConnections));
        }
      }
    );

    return () => subscription?.unsubscribe();
  }, [ws, user?.id]);

  useEffect(() => {
    const subscription = ws?.subscribe(
      `/topic/users/${user?.id}/connections/rejected`,
      (res) => {
        const data: IConnection = JSON.parse(res.body);
        const newInvitations = invitations.filter(
          (invitation) => invitation.id !== data.id
        );
        dispatch(setInvitations(newInvitations));
      }
    );

    return () => subscription?.unsubscribe();
  }, [ws, user?.id]);

  return (
    <div className="flex flex-col border-1 border-gray-200 rounded-md bg-white">
      <div className="p-4">
        <h1 className="text-md font-bold text-gray-800">
          Invitations ({invitations.length})
        </h1>
      </div>
      <Divider />
      <div className="p-4 flex gap-4">
        <button
          className={`px-2 py-1 rounded-full text-sm ${
            !sent
              ? "bg-[var(--primary-color)] text-white"
              : "bg-[var(--secondary-color)] text-white"
          }`}
          onClick={() => setSent(false)}
        >
          Received
        </button>
        <button
          className={`px-2 py-1 rounded-full text-sm ${
            sent
              ? "bg-[var(--primary-color)] text-white"
              : "bg-[var(--secondary-color)] text-white"
          }`}
          onClick={() => setSent(true)}
        >
          Sent
        </button>
      </div>
      <div className="flex flex-col gap-4 px-4">
        {filteredConnections.length > 0 ? (
          filteredConnections.map((connection) => (
            <ConnectionCard
              key={connection.id}
              connection={connection}
              type={sent ? "sent" : "received"}
            />
          ))
        ) : (
          <div className="text-gray-500 text-sm pb-4">
            No invitations {sent ? "sent" : "received"} at the moment.
          </div>
        )}
      </div>
    </div>
  );
};

export default Invitations;
