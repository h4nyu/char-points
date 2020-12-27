import { AxiosInstance } from "axios";
import { toError } from ".";
import {
  FilterPayload,
  CreatePayload,
  UpdatePayload,
  DeletePayload,
  FindPayload,
  Service,
  Image,
} from "@charpoints/core/image";

export type ImageApi = Service;

export const ImageApi = (arg: {
  http: AxiosInstance;
  prefix: string;
}): Service => {
  const { http, prefix } = arg;
  const create = async (payload: CreatePayload): Promise<string | Error> => {
    try {
      const res = await http.post(`${prefix}/create`, payload);
      return res.data;
    } catch (err) {
      return toError(err);
    }
  };

  const filter = async (payload: FilterPayload) => {
    try {
      const res = await http.post(`${prefix}/filter`, payload);
      return res.data;
    } catch (err) {
      return toError(err);
    }
  };
  const update = async (payload: UpdatePayload) => {
    try {
      const res = await http.post(`${prefix}/update`, payload);
      return res.data;
    } catch (err) {
      return toError(err);
    }
  };

  const delete_ = async (payload: DeletePayload) => {
    try {
      const res = await http.post(`${prefix}/delete`, payload);
      return res.data;
    } catch (err) {
      return toError(err);
    }
  };
  const find = async (payload: FindPayload) => {
    try {
      const res = await http.post(`${prefix}/find`, payload);
      return res.data;
    } catch (err) {
      return toError(err);
    }
  };

  return {
    create,
    filter,
    update,
    find,
    delete: delete_,
  };
};
