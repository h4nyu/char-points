import React from "react";
import Progress from "../components/Progress";
import { Observer } from "mobx-react-lite";
import store from "../store";

export default function Loading() {
  const { loading } = store;
  return (
    <Observer>{() => <Progress isActive={loading.state.isActive} />}</Observer>
  );
}
