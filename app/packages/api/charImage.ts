import { AxiosInstance } from "axios"
import { Service as Srv } from '@charpoints/core/charImage'

export const CharImageApi = (arg: {http:AxiosInstance, prefix: string}) => {
  const {http, prefix} = arg

  const create = async ():Promise<string|Error> => {
    return "string"
  }

  const filter = async (payload:Srv.FileUpload):Promise<string|Error> => {
    const res = await http.post(`${prefix}/filter`,payload).catch(e => new Error(e))
    if(res instanceof Error){return res}
    return res.data
  }

  return {
    create,
    filter
  }
}
