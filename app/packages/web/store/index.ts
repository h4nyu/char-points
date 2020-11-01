import React, { useState } from "react";
import { createContainer } from "unstated-next";

export const useCounter = () => {
  const [count, setCount] = useState(0);
  const countUp = () => {
    setCount(count + 1);
    console.log(`counterUp ${count}`);
  };
  return {
    count,
    countUp,
  };
};

export default createContainer(useCounter);
