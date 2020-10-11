import * as uuid from "uuid";
import { ErrorKind } from "./error";
export type User = {
  id: string; // Uuid
  name: string;
};

export function defaultUser(): User {
  return {
    id: uuid.v4(),
    name: "",
  };
}

export type CreatePayload = {
  name: string;
};
export async function createUser(
  lock: Lock,
  store: Store,
  payload: CreatePayload
): Promise<string> {
  const user = defaultUser();
  user.name = payload.name;
  await lock.withLock(async () => {
    if (await store.fetchUser({ name: user.name })) {
      throw new Error(ErrorKind.UserAlreadyExists);
    }
    await store.insertUser(user);
  });
  return user.id;
}

export type Store = {
  fetchUsers: () => Promise<User[]>;
  fetchUser: (payload: { name?: string }) => Promise<User | undefined>;
  insertUser: (row: User) => Promise<void>;
};
export type Lock = {
  withLock: (fn: () => Promise<void>) => Promise<void>;
};
