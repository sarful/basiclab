import { mkdir, readdir, stat, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";

import { env } from "@/config/env";

export type StoredFileResult = {
  storageKey: string;
  url: string;
  absolutePath: string;
};

export async function persistBuffer(
  buffer: Buffer,
  fileName: string,
): Promise<StoredFileResult> {
  if (env.STORAGE_DRIVER !== "local") {
    throw new Error("Only local storage is scaffolded in Phase 1");
  }

  await mkdir(env.UPLOAD_DIR, { recursive: true });

  const storageKey = `${Date.now()}-${fileName}`;
  const absolutePath = join(env.UPLOAD_DIR, storageKey);

  await writeFile(absolutePath, buffer);

  return {
    storageKey,
    url: `/uploads/${storageKey}`,
    absolutePath,
  };
}

export function resolveStoragePath(storageKey: string) {
  return resolve(env.UPLOAD_DIR, storageKey);
}

export async function getStorageStats() {
  await mkdir(env.UPLOAD_DIR, { recursive: true });
  const entries = await readdir(env.UPLOAD_DIR, { withFileTypes: true });
  let totalBytes = 0;
  let fileCount = 0;

  for (const entry of entries) {
    if (!entry.isFile()) {
      continue;
    }

    const entryPath = join(env.UPLOAD_DIR, entry.name);
    const fileStat = await stat(entryPath);
    totalBytes += fileStat.size;
    fileCount += 1;
  }

  return {
    storageDriver: env.STORAGE_DRIVER,
    uploadDirectory: env.UPLOAD_DIR,
    fileCount,
    totalBytes,
    totalMegabytes: Math.round((totalBytes / 1024 / 1024) * 100) / 100,
    maxFileSizeMb: env.MAX_FILE_SIZE_MB,
  };
}
