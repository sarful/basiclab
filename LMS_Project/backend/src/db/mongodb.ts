import mongoose from "mongoose";

import { env } from "@/config/env";

const globalForMongoose = globalThis as typeof globalThis & {
  mongoosePromise?: Promise<typeof mongoose>;
};

function getDatabaseConfigErrorMessage(databaseUrl: string) {
  if (databaseUrl.includes("@cluster.mongodb.net")) {
    return "Invalid DATABASE_URL host. Replace cluster.mongodb.net with your real MongoDB Atlas host, for example cluster0.xxxxx.mongodb.net.";
  }

  return null;
}

function getDatabaseConnectionErrorMessage(error: unknown) {
  if (!error || typeof error !== "object") {
    return null;
  }

  if ("code" in error && error.code === "ENOTFOUND") {
    return "MongoDB host could not be resolved. Check DATABASE_URL and make sure the Atlas hostname is correct.";
  }

  if ("code" in error && "syscall" in error) {
    const code = error.code;
    const syscall = error.syscall;

    if (code === "ECONNREFUSED" && syscall === "querySrv") {
      return [
        "MongoDB Atlas SRV lookup failed for the configured hostname.",
        "Your network or DNS is refusing the SRV query used by mongodb+srv URLs.",
        "Update DATABASE_URL to a standard mongodb:// connection string from Atlas, or switch to a DNS/network that allows SRV lookups, then retry.",
      ].join(" ");
    }
  }

  return null;
}

export async function connectToDatabase() {
  const configErrorMessage = getDatabaseConfigErrorMessage(env.DATABASE_URL);
  if (configErrorMessage) {
    throw new Error(configErrorMessage);
  }

  if (!globalForMongoose.mongoosePromise) {
    globalForMongoose.mongoosePromise = mongoose
      .connect(env.DATABASE_URL, {
        dbName: env.DATABASE_NAME,
      })
      .catch((error: unknown) => {
        globalForMongoose.mongoosePromise = undefined;

        const connectionErrorMessage = getDatabaseConnectionErrorMessage(error);
        if (connectionErrorMessage) {
          throw new Error(connectionErrorMessage);
        }

        throw error;
      });
  }

  return globalForMongoose.mongoosePromise;
}
