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
  const pollInterval = option.pollInterval || 10;
  const watcher = fs.watch(dir, async (event, fn) => {
    if (event === "rename" && fn == filename) {
      try {
        await fs.promises.access(lockPath);
        isLocked = true;
      } catch (err) {
        isLocked = false;
      }
    }
  });

  let isLocked = false;

  const lock = async () => {
    try {
      await fs.promises.mkdir(lockPath);
      isLocked = true;
    } catch (e) {
      await new Promise((resolve) => setTimeout(resolve, pollInterval));
      await lock();
    }
  };
  const unlock = async () => {
    await fs.promises.rmdir(lockPath);
    isLocked = false;
  };

  const close = () => {
    if (fs.existsSync(lockPath)) {
      fs.rmdirSync(lockPath);
    }
    watcher.close();
  };

  return {
    lock,
    unlock,
    close,
  };
};
