import React from "react";
import { Level } from "../store";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const Toast = (props: {
  id: string;
  message: string;
  level?: Level;
}) => {
  const { message, level, id } = props;
  if (!message || !id) {
    return null;
  }
  let color = "";
  if (level === Level.Info) {
    color = "is-info";
  } else if (level === Level.Success) {
    color = "is-success";
  } else if (level === Level.Warning) {
    color = "is-warning";
  } else if (level === Level.Error) {
    color = "is-danger";
  }
  toast(message, {
    className: `message ${color} p-0`,
    bodyClassName: `message-body`,
    toastId: id,
  });

  return <ToastContainer position="bottom-right" />;
};
export default Toast;
