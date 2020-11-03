import {DataStore} from './DataStore'

export const RootStore = () => {
  const dataStore = DataStore()
  return {
    dataStore
  }
}

export default RootStore()
