import { observable } from "mobx";
import { CharImage } from "@charpoints/core";

type State = {
  charImages: CharImage[];
};

export const DataStore = () => {
  const state: State = observable({
    charImages: [],
  });
  const fetchCharImages = async () => {};
  return {
    state,
  };
};
