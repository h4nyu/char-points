import { AxiosInstance } from "axios"
import { Service as Srv } from '@charpoints/core/charImage'

export const CharImageApi = (arg: {http:AxiosInstance, prefix: string}) => {
  const create = async ():Promise<string|Error> => {
    return "string"
  }

  return {
    create,
  }
}
