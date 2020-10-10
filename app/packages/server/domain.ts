export type User = {
  id: string; // Uuid
  name: string;
  createdAt: Date;
};

export type Store = {
  fetchUser: <T>(key: T) => Promise<User | undefined>;
  fetchUsers: <T>(key: T) => Promise<User[]>;
  insert: <T>(row: T) => Promise<void>;
  update: <T>(row: T) => Promise<void>;
};
