export { ErrorKind } from "./error";

export type User = {
  id: string; // Uuid
  name: string;
};

export type Store = {
  fetchUsers: () => Promise<User[]>;
  fetchUser: (payload: { name?: string }) => Promise<User | undefined>;
  insertUser: (row: User) => Promise<void>;
};
export type Lock = {
  withLock: (fn: () => Promise<void>) => Promise<void>;
};
