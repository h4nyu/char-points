import { CharImageApi} from "./charImage"
import axios from "axios"

export const RootApi = () => {
  const http = axios.create()
  const prefix = "api/v1"
  const charImage = CharImageApi({http, prefix: `${prefix}/char-image`})
  return {
    charImage
  }
}
