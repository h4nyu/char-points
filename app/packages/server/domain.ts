export type User = {
  id: string; // Uuid
  name: string;
};

export type Store = {
  fetchUsers: () => Promise<User[]>;
  // fetchUsers: <T>(key: T) => Promise<User[]>;
  // insert: <T>(row: T) => Promise<void>;
  // update: <T>(row: T) => Promise<void>;
};
