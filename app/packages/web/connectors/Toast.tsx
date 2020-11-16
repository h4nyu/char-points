import React from "react";
import Toast from "../components/Toast";
import { Observer } from "mobx-react-lite";
import store from "../store";

export default function Toast_() {
  const { toast } = store;
  return <Observer>{() => <Toast {...toast.state.message} />}</Observer>;
}
