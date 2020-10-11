import * as uuid from "uuid";
export type User = {
  id: string; // Uuid
  name: string;
};

export function newUser(): User {
  return {
    id: uuid.v4(),
    name: "",
  };
}

export type Store = {
  fetchUsers: () => Promise<User[]>;
  // fetchUsers: <T>(key: T) => Promise<User[]>;
  // insert: <T>(row: T) => Promise<void>;
  // update: <T>(row: T) => Promise<void>;
};

export type Lock = {
  lock: () => Promise<void>;
  unlock: () => Promise<void>;
};
