import { AxiosInstance } from "axios";
import { CreatePayload } from "server/domain";

export const UserApi = (axios: AxiosInstance) => {
  const create = async (payload: CreatePayload): Promise<string> => {
    const res = await axios.post("/user", payload);
    return res.data;
  };
  return {
    create,
  };
};
