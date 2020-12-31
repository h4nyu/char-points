import React from "react";
import { formatISO } from "date-fns";
export const DateView = (props: { value: Date }) => {
  return <>{formatISO(props.value)}</>;
};
export default DateView;
