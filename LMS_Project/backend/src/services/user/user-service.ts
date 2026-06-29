import { Types } from "mongoose";

import { UserModel } from "@/db/models/User";
import { connectToDatabase } from "@/db/mongodb";
import { errorResponse, successResponse } from "@/lib/api-response";
import { sanitizeUser } from "@/lib/auth-utils";
import { logActivity } from "@/services/auth/activity-log-service";
import { searchUsersSchema, updateUserSchema } from "@/services/user/user-schemas";

function isValidObjectId(value: string) {
  return Types.ObjectId.isValid(value);
}

export async function listUsers(query: Record<string, string | undefined>) {
  const parsed = searchUsersSchema.safeParse(query);

  if (!parsed.success) {
    return { status: 400, body: errorResponse("Invalid search query", parsed.error.flatten()) };
  }

  await connectToDatabase();

  const filter: Record<string, unknown> = {};

  if (parsed.data.q) {
    filter.$or = [
      { fullName: { $regex: parsed.data.q, $options: "i" } },
      { email: { $regex: parsed.data.q, $options: "i" } },
    ];
  }

  if (parsed.data.role) {
    filter.role = parsed.data.role;
  }

  if (parsed.data.suspended) {
    filter.isSuspended = parsed.data.suspended === "true";
  }

  const users = await UserModel.find(filter).sort({ createdAt: -1 }).limit(100);

  return {
    status: 200,
    body: successResponse("Users fetched successfully", users.map((user) => sanitizeUser(user))),
  };
}

export async function getUserById(userId: string) {
  if (!isValidObjectId(userId)) {
    return { status: 400, body: errorResponse("Invalid user id") };
  }

  await connectToDatabase();
  const user = await UserModel.findById(userId);

  if (!user) {
    return { status: 404, body: errorResponse("User not found") };
  }

  return { status: 200, body: successResponse("User fetched successfully", sanitizeUser(user)) };
}

export async function updateUser(userId: string, input: unknown, actorId: string) {
  if (!isValidObjectId(userId)) {
    return { status: 400, body: errorResponse("Invalid user id") };
  }

  const parsed = updateUserSchema.safeParse(input);
  if (!parsed.success) {
    return { status: 400, body: errorResponse("Invalid user update payload", parsed.error.flatten()) };
  }

  await connectToDatabase();
  const user = await UserModel.findById(userId);
  if (!user) {
    return { status: 404, body: errorResponse("User not found") };
  }

  Object.assign(user, parsed.data);
  await user.save();

  await logActivity({
    userId: actorId,
    action: "USER_UPDATED",
    entityType: "User",
    entityId: user._id.toString(),
    metadata: parsed.data,
  });

  return { status: 200, body: successResponse("User updated successfully", sanitizeUser(user)) };
}

export async function deleteUser(userId: string, actorId: string) {
  if (!isValidObjectId(userId)) {
    return { status: 400, body: errorResponse("Invalid user id") };
  }

  await connectToDatabase();
  const user = await UserModel.findByIdAndDelete(userId);

  if (!user) {
    return { status: 404, body: errorResponse("User not found") };
  }

  await logActivity({
    userId: actorId,
    action: "USER_DELETED",
    entityType: "User",
    entityId: userId,
  });

  return { status: 200, body: successResponse("User deleted successfully", null) };
}

export async function setUserSuspended(userId: string, suspended: boolean, actorId: string) {
  if (!isValidObjectId(userId)) {
    return { status: 400, body: errorResponse("Invalid user id") };
  }

  await connectToDatabase();
  const user = await UserModel.findById(userId);
  if (!user) {
    return { status: 404, body: errorResponse("User not found") };
  }

  user.isSuspended = suspended;
  await user.save();

  await logActivity({
    userId: actorId,
    action: suspended ? "USER_SUSPENDED" : "USER_ACTIVATED",
    entityType: "User",
    entityId: userId,
  });

  return {
    status: 200,
    body: successResponse(
      suspended ? "User suspended successfully" : "User activated successfully",
      sanitizeUser(user),
    ),
  };
}
