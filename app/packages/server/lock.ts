import fs from "fs";
import path from "path";

export const Lock = (option: {
  dir: string;
  filename?: string;
  pollInterval?: number;
}) => {
  const dir = path.resolve(option.dir);
  const filename = option.filename || "lock";
  const lockPath = path.resolve(path.join(dir, filename));
  const pollInterval = option.pollInterval || 1;

  let isLocked = false; /* eslint-disable */

  const lock = async () => {
    try {
      await fs.promises.mkdir(lockPath);
      isLocked = true;
    } catch (e) {
      isLocked = false;
      await new Promise((resolve) => setTimeout(resolve, pollInterval));
      await lock();
    }
  };
  const unlock = async () => {
    await fs.promises.rmdir(lockPath);
    isLocked = false;
  };

  const withLock = async (fn: () => Promise<void>) => {
    try {
      await lock();
      await fn();
    } finally {
      await unlock();
    }
  };

  return {
    withLock,
    lock,
    unlock,
  };
};
