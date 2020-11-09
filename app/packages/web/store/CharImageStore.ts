import { observable } from "mobx";
import { CharImage } from "@charpoints/core";
import { RootStore } from ".";
import { RootApi } from "@charpoints/api";
import { fileTob64 } from "../utils";
import { saveAs } from "file-saver";
import { DataStore } from "./DataStore"


type State = {
  charImage?: CharImage;
};
export const CharImageStore = (args: { 
  api: RootApi,
  dataStore: DataStore
}) => {
  const { api, dataStore } = args;
  const state: State = observable({
    charImage: undefined
  });

  const uploadFiles = async (files:File[]) => {
    const ids = []
    for (const f of files){
      const data = await fileTob64(f)
      if(data instanceof Error){
        continue;
      }
      const id = await api.charImage.create({ data })
      if(id instanceof Error){
        continue;
      }
      ids.push(id)
    }
    await dataStore.fetchCharImages()
  }

  return {
    ...state,
    uploadFiles
  };
};
