import { observable } from "mobx";
import { CharImage } from "@charpoints/core/charImage";
import { RootApi } from "@charpoints/api";
import { fileTob64 } from "../utils";
import { DataStore } from "./data";
import { RootStore } from ".";

export type CharImageStore = {
  uploadFiles: (files: File[]) => void;
  delete: (id: string) => Promise<void>;
};
export const CharImageStore = (root: { api: RootApi; data: DataStore }) => {
  const { api, data } = root;

  const uploadFiles = async (files: File[]) => {
    const ids: string[] = [];
    for (const f of files) {
      const data = await fileTob64(f);
      if (data instanceof Error) {
        continue;
      }
      const id = await api.charImage.create({ data });
      if (id instanceof Error) {
        continue;
      }
      ids.push(id);
    }
    await data.fetchCharImages({ ids });
  };
  const delete_ = async (id: string) => {
    await data.deleteChartImage(id);
  };

  return {
    uploadFiles,
    delete: delete_,
  };
};
