import * as uuid from "uuid";
import { Store, Lock, ErrorKind, User } from ".";

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
