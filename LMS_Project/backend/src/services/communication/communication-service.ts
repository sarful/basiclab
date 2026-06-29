import { Types } from "mongoose";

import { AnnouncementModel } from "@/db/models/Announcement";
import { CourseModel } from "@/db/models/Course";
import { EnrollmentModel } from "@/db/models/Enrollment";
import { NotificationModel } from "@/db/models/Notification";
import { SupportTicketModel } from "@/db/models/SupportTicket";
import { UserModel } from "@/db/models/User";
import { connectToDatabase } from "@/db/mongodb";
import { errorResponse, successResponse } from "@/lib/api-response";
import { logActivity } from "@/services/auth/activity-log-service";
import { sendEmail } from "@/services/auth/email-service";
import {
  createAnnouncementSchema,
  createSupportTicketSchema,
  listSupportTicketsSchema,
  supportReplySchema,
  supportStatusSchema,
  updateAnnouncementSchema,
} from "@/services/communication/communication-schemas";
import type { UserRole } from "@/types/auth";

function isValidObjectId(value: string) {
  return Types.ObjectId.isValid(value);
}

function sanitizeNotification(notification: {
  _id: { toString(): string };
  userId: { toString(): string } | string;
  type: string;
  title: string;
  message: string;
  channel: string;
  isRead: boolean;
  readAt?: Date;
  metadata?: Record<string, unknown>;
  createdAt?: Date;
  updatedAt?: Date;
}) {
  return {
    id: notification._id.toString(),
    userId: typeof notification.userId === "string" ? notification.userId : notification.userId.toString(),
    type: notification.type,
    title: notification.title,
    message: notification.message,
    channel: notification.channel,
    isRead: notification.isRead,
    readAt: notification.readAt,
    metadata: notification.metadata,
    createdAt: notification.createdAt,
    updatedAt: notification.updatedAt,
  };
}

function sanitizeAnnouncement(announcement: {
  _id: { toString(): string };
  title: string;
  content: string;
  audience: string;
  courseId?: { toString(): string } | string;
  status: string;
  publishedAt?: Date;
  createdBy: { toString(): string } | string;
  createdAt: Date;
  updatedAt: Date;
}) {
  return {
    id: announcement._id.toString(),
    title: announcement.title,
    content: announcement.content,
    audience: announcement.audience,
    courseId:
      typeof announcement.courseId === "string"
        ? announcement.courseId
        : announcement.courseId?.toString(),
    status: announcement.status,
    publishedAt: announcement.publishedAt,
    createdBy:
      typeof announcement.createdBy === "string"
        ? announcement.createdBy
        : announcement.createdBy.toString(),
    createdAt: announcement.createdAt,
    updatedAt: announcement.updatedAt,
  };
}

function sanitizeSupportTicket(ticket: {
  _id: { toString(): string };
  userId: { toString(): string } | string;
  subject: string;
  category: string;
  message: string;
  status: string;
  priority: string;
  replies: Array<{
    authorId: { toString(): string } | string;
    authorRole: UserRole;
    message: string;
    createdAt: Date;
  }>;
  lastRepliedAt?: Date;
  closedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}) {
  return {
    id: ticket._id.toString(),
    userId: typeof ticket.userId === "string" ? ticket.userId : ticket.userId.toString(),
    subject: ticket.subject,
    category: ticket.category,
    message: ticket.message,
    status: ticket.status,
    priority: ticket.priority,
    replies: ticket.replies.map((reply) => ({
      authorId: typeof reply.authorId === "string" ? reply.authorId : reply.authorId.toString(),
      authorRole: reply.authorRole,
      message: reply.message,
      createdAt: reply.createdAt,
    })),
    lastRepliedAt: ticket.lastRepliedAt,
    closedAt: ticket.closedAt,
    createdAt: ticket.createdAt,
    updatedAt: ticket.updatedAt,
  };
}

async function createNotificationRecord(input: {
  userId: string;
  type: "EMAIL" | "OTP" | "ENROLLMENT" | "COURSE_UPDATE" | "COMPLETION" | "ANNOUNCEMENT" | "SUPPORT";
  title: string;
  message: string;
  channel?: "IN_APP" | "EMAIL" | "BOTH";
  metadata?: Record<string, unknown>;
}) {
  return NotificationModel.create({
    userId: input.userId,
    type: input.type,
    title: input.title,
    message: input.message,
    channel: input.channel ?? "BOTH",
    metadata: input.metadata,
  });
}

async function deliverNotificationEmail(userId: string, subject: string, text: string) {
  const user = await UserModel.findById(userId);
  if (!user) {
    return;
  }

  await sendEmail({
    to: user.email,
    subject,
    text,
  });
}

async function createAndSendNotification(input: {
  userId: string;
  type: "EMAIL" | "OTP" | "ENROLLMENT" | "COURSE_UPDATE" | "COMPLETION" | "ANNOUNCEMENT" | "SUPPORT";
  title: string;
  message: string;
  metadata?: Record<string, unknown>;
}) {
  const notification = await createNotificationRecord({
    ...input,
    channel: "BOTH",
  });

  await deliverNotificationEmail(input.userId, input.title, input.message);
  return notification;
}

async function getAudienceUserIds(audience: "ALL" | "ADMIN" | "LEARNER_EN" | "LEARNER_BN") {
  const filter =
    audience === "ALL"
      ? {}
      : audience === "ADMIN"
        ? { role: "ADMIN" }
        : { role: audience };

  const users = await UserModel.find(filter).select("_id");
  return users.map((user) => user._id.toString());
}

export async function listNotifications(userId: string) {
  await connectToDatabase();
  const notifications = await NotificationModel.find({ userId }).sort({ createdAt: -1 }).limit(100);

  return {
    status: 200,
    body: successResponse(
      "Notifications fetched successfully",
      notifications.map((notification) => sanitizeNotification(notification)),
    ),
  };
}

export async function markNotificationRead(userId: string, notificationId: string) {
  if (!isValidObjectId(notificationId)) {
    return { status: 400, body: errorResponse("Invalid notification id") };
  }

  await connectToDatabase();
  const notification = await NotificationModel.findOne({ _id: notificationId, userId });
  if (!notification) {
    return { status: 404, body: errorResponse("Notification not found") };
  }

  notification.isRead = true;
  notification.readAt = new Date();
  await notification.save();

  return {
    status: 200,
    body: successResponse("Notification marked as read", sanitizeNotification(notification)),
  };
}

export async function createAnnouncement(input: unknown, actorId: string) {
  const parsed = createAnnouncementSchema.safeParse(input);
  if (!parsed.success) {
    return { status: 400, body: errorResponse("Invalid announcement payload", parsed.error.flatten()) };
  }

  if (parsed.data.courseId && !isValidObjectId(parsed.data.courseId)) {
    return { status: 400, body: errorResponse("Invalid course id") };
  }

  await connectToDatabase();
  const announcement = await AnnouncementModel.create({
    ...parsed.data,
    createdBy: actorId,
  });

  await logActivity({
    userId: actorId,
    action: "ANNOUNCEMENT_CREATED",
    entityType: "Announcement",
    entityId: announcement._id.toString(),
  });

  return {
    status: 201,
    body: successResponse("Announcement created successfully", sanitizeAnnouncement(announcement)),
  };
}

export async function updateAnnouncement(announcementId: string, input: unknown, actorId: string) {
  if (!isValidObjectId(announcementId)) {
    return { status: 400, body: errorResponse("Invalid announcement id") };
  }

  const parsed = updateAnnouncementSchema.safeParse(input);
  if (!parsed.success) {
    return { status: 400, body: errorResponse("Invalid announcement payload", parsed.error.flatten()) };
  }

  if (parsed.data.courseId && !isValidObjectId(parsed.data.courseId)) {
    return { status: 400, body: errorResponse("Invalid course id") };
  }

  await connectToDatabase();
  const announcement = await AnnouncementModel.findById(announcementId);
  if (!announcement) {
    return { status: 404, body: errorResponse("Announcement not found") };
  }

  Object.assign(announcement, parsed.data);
  await announcement.save();

  await logActivity({
    userId: actorId,
    action: "ANNOUNCEMENT_UPDATED",
    entityType: "Announcement",
    entityId: announcementId,
  });

  return {
    status: 200,
    body: successResponse("Announcement updated successfully", sanitizeAnnouncement(announcement)),
  };
}

export async function deleteAnnouncement(announcementId: string, actorId: string) {
  if (!isValidObjectId(announcementId)) {
    return { status: 400, body: errorResponse("Invalid announcement id") };
  }

  await connectToDatabase();
  const announcement = await AnnouncementModel.findByIdAndDelete(announcementId);
  if (!announcement) {
    return { status: 404, body: errorResponse("Announcement not found") };
  }

  await logActivity({
    userId: actorId,
    action: "ANNOUNCEMENT_DELETED",
    entityType: "Announcement",
    entityId: announcementId,
  });

  return {
    status: 200,
    body: successResponse("Announcement deleted successfully", null),
  };
}

export async function publishAnnouncement(announcementId: string, actorId: string) {
  if (!isValidObjectId(announcementId)) {
    return { status: 400, body: errorResponse("Invalid announcement id") };
  }

  await connectToDatabase();
  const announcement = await AnnouncementModel.findById(announcementId);
  if (!announcement) {
    return { status: 404, body: errorResponse("Announcement not found") };
  }

  announcement.status = "PUBLISHED";
  announcement.publishedAt = new Date();
  await announcement.save();

  const audienceUserIds = await getAudienceUserIds(announcement.audience);
  await Promise.all(
    audienceUserIds.map((userId) =>
      createAndSendNotification({
        userId,
        type: "ANNOUNCEMENT",
        title: announcement.title,
        message: announcement.content,
        metadata: {
          announcementId,
          courseId: announcement.courseId?.toString(),
        },
      }),
    ),
  );

  await logActivity({
    userId: actorId,
    action: "ANNOUNCEMENT_PUBLISHED",
    entityType: "Announcement",
    entityId: announcementId,
  });

  return {
    status: 200,
    body: successResponse("Announcement published successfully", sanitizeAnnouncement(announcement)),
  };
}

export async function listAdminAnnouncements() {
  await connectToDatabase();
  const announcements = await AnnouncementModel.find().sort({ createdAt: -1 }).limit(100);
  return {
    status: 200,
    body: successResponse(
      "Announcements fetched successfully",
      announcements.map((announcement) => sanitizeAnnouncement(announcement)),
    ),
  };
}

export async function listPublishedAnnouncements(userRole?: UserRole) {
  await connectToDatabase();
  const audienceFilter = userRole
    ? { $in: ["ALL", userRole] }
    : { $in: ["ALL"] };

  const announcements = await AnnouncementModel.find({
    status: "PUBLISHED",
    audience: audienceFilter,
  })
    .sort({ publishedAt: -1, createdAt: -1 })
    .limit(100);

  return {
    status: 200,
    body: successResponse(
      "Published announcements fetched successfully",
      announcements.map((announcement) => sanitizeAnnouncement(announcement)),
    ),
  };
}

export async function createSupportTicket(userId: string, input: unknown) {
  const parsed = createSupportTicketSchema.safeParse(input);
  if (!parsed.success) {
    return { status: 400, body: errorResponse("Invalid support ticket payload", parsed.error.flatten()) };
  }

  await connectToDatabase();
  const ticket = await SupportTicketModel.create({
    userId,
    ...parsed.data,
  });

  const admins = await UserModel.find({ role: "ADMIN" }).select("_id");
  await Promise.all(
    admins.map((admin) =>
      createAndSendNotification({
        userId: admin._id.toString(),
        type: "SUPPORT",
        title: `New support ticket: ${ticket.subject}`,
        message: ticket.message,
        metadata: { ticketId: ticket._id.toString(), category: ticket.category },
      }),
    ),
  );

  await logActivity({
    userId,
    action: "SUPPORT_TICKET_CREATED",
    entityType: "SupportTicket",
    entityId: ticket._id.toString(),
  });

  return {
    status: 201,
    body: successResponse("Support ticket created successfully", sanitizeSupportTicket(ticket)),
  };
}

export async function listMySupportTickets(userId: string) {
  await connectToDatabase();
  const tickets = await SupportTicketModel.find({ userId }).sort({ updatedAt: -1 }).limit(100);
  return {
    status: 200,
    body: successResponse(
      "Support tickets fetched successfully",
      tickets.map((ticket) => sanitizeSupportTicket(ticket)),
    ),
  };
}

export async function listAdminSupportTickets(query: Record<string, string | undefined>) {
  const parsed = listSupportTicketsSchema.safeParse(query);
  if (!parsed.success) {
    return { status: 400, body: errorResponse("Invalid support ticket query", parsed.error.flatten()) };
  }

  await connectToDatabase();
  const filter: Record<string, unknown> = {};
  if (parsed.data.status) filter.status = parsed.data.status;
  if (parsed.data.priority) filter.priority = parsed.data.priority;
  if (parsed.data.category) filter.category = parsed.data.category;
  if (parsed.data.userId) {
    if (!isValidObjectId(parsed.data.userId)) {
      return { status: 400, body: errorResponse("Invalid user id") };
    }
    filter.userId = parsed.data.userId;
  }

  const tickets = await SupportTicketModel.find(filter).sort({ updatedAt: -1 }).limit(100);
  return {
    status: 200,
    body: successResponse(
      "Support tickets fetched successfully",
      tickets.map((ticket) => sanitizeSupportTicket(ticket)),
    ),
  };
}

export async function getSupportTicket(ticketId: string, requester: { userId: string; role: UserRole }) {
  if (!isValidObjectId(ticketId)) {
    return { status: 400, body: errorResponse("Invalid ticket id") };
  }

  await connectToDatabase();
  const filter: Record<string, unknown> = { _id: ticketId };
  if (requester.role !== "ADMIN") {
    filter.userId = requester.userId;
  }

  const ticket = await SupportTicketModel.findOne(filter);
  if (!ticket) {
    return { status: 404, body: errorResponse("Support ticket not found") };
  }

  return {
    status: 200,
    body: successResponse("Support ticket fetched successfully", sanitizeSupportTicket(ticket)),
  };
}

export async function replyToSupportTicket(
  ticketId: string,
  actor: { userId: string; role: UserRole },
  input: unknown,
) {
  if (!isValidObjectId(ticketId)) {
    return { status: 400, body: errorResponse("Invalid ticket id") };
  }

  const parsed = supportReplySchema.safeParse(input);
  if (!parsed.success) {
    return { status: 400, body: errorResponse("Invalid support reply payload", parsed.error.flatten()) };
  }

  await connectToDatabase();
  const ticket = await SupportTicketModel.findById(ticketId);
  if (!ticket) {
    return { status: 404, body: errorResponse("Support ticket not found") };
  }

  if (actor.role !== "ADMIN" && ticket.userId.toString() !== actor.userId) {
    return { status: 403, body: errorResponse("Forbidden") };
  }

  ticket.replies.push({
    authorId: actor.userId,
    authorRole: actor.role,
    message: parsed.data.message,
    createdAt: new Date(),
  });
  ticket.lastRepliedAt = new Date();
  ticket.status = actor.role === "ADMIN" ? "IN_PROGRESS" : ticket.status;
  await ticket.save();

  const notificationUserId = actor.role === "ADMIN" ? ticket.userId.toString() : undefined;
  if (notificationUserId) {
    await createAndSendNotification({
      userId: notificationUserId,
      type: "SUPPORT",
      title: `Reply on ticket: ${ticket.subject}`,
      message: parsed.data.message,
      metadata: { ticketId },
    });
  }

  await logActivity({
    userId: actor.userId,
    action: "SUPPORT_TICKET_REPLIED",
    entityType: "SupportTicket",
    entityId: ticketId,
  });

  return {
    status: 200,
    body: successResponse("Support ticket reply added successfully", sanitizeSupportTicket(ticket)),
  };
}

export async function updateSupportTicketStatus(ticketId: string, actorId: string, input: unknown) {
  if (!isValidObjectId(ticketId)) {
    return { status: 400, body: errorResponse("Invalid ticket id") };
  }

  const parsed = supportStatusSchema.safeParse(input);
  if (!parsed.success) {
    return { status: 400, body: errorResponse("Invalid support status payload", parsed.error.flatten()) };
  }

  await connectToDatabase();
  const ticket = await SupportTicketModel.findById(ticketId);
  if (!ticket) {
    return { status: 404, body: errorResponse("Support ticket not found") };
  }

  if (parsed.data.status) {
    ticket.status = parsed.data.status;
    if (parsed.data.status === "CLOSED") {
      ticket.closedAt = new Date();
    }
  }
  if (parsed.data.priority) {
    ticket.priority = parsed.data.priority;
  }

  await ticket.save();

  await createAndSendNotification({
    userId: ticket.userId.toString(),
    type: "SUPPORT",
    title: `Ticket updated: ${ticket.subject}`,
    message: `Your support ticket is now ${ticket.status}.`,
    metadata: { ticketId, priority: ticket.priority },
  });

  await logActivity({
    userId: actorId,
    action: "SUPPORT_TICKET_STATUS_UPDATED",
    entityType: "SupportTicket",
    entityId: ticketId,
  });

  return {
    status: 200,
    body: successResponse("Support ticket updated successfully", sanitizeSupportTicket(ticket)),
  };
}

export async function notifyEnrollmentEvent(input: {
  userId: string;
  courseId: string;
  event: "REQUESTED" | "APPROVED" | "REJECTED" | "REMOVED";
  notes?: string;
}) {
  await connectToDatabase();
  const course = await CourseModel.findById(input.courseId);
  if (!course) {
    return;
  }

  const actionText: Record<typeof input.event, string> = {
    REQUESTED: "Enrollment request received",
    APPROVED: "Enrollment approved",
    REJECTED: "Enrollment rejected",
    REMOVED: "Course access removed",
  };

  await createAndSendNotification({
    userId: input.userId,
    type: "ENROLLMENT",
    title: actionText[input.event],
    message: `${actionText[input.event]} for ${course.title}.${input.notes ? ` Note: ${input.notes}` : ""}`,
    metadata: { courseId: input.courseId, event: input.event },
  });
}

export async function notifyCourseUpdate(input: {
  actorId: string;
  courseId: string;
  title: string;
  updateType: "UPDATED" | "PUBLISHED";
}) {
  await connectToDatabase();
  const approvedEnrollments = await EnrollmentModel.find({
    courseId: input.courseId,
    status: "APPROVED",
  }).select("userId");

  await Promise.all(
    approvedEnrollments.map((enrollment) =>
      createAndSendNotification({
        userId: enrollment.userId.toString(),
        type: "COURSE_UPDATE",
        title: input.updateType === "PUBLISHED" ? "New course published" : "Course updated",
        message:
          input.updateType === "PUBLISHED"
            ? `${input.title} is now available for learners.`
            : `${input.title} has new course content or resources available.`,
        metadata: { courseId: input.courseId, updateType: input.updateType },
      }),
    ),
  );

  await logActivity({
    userId: input.actorId,
    action: input.updateType === "PUBLISHED" ? "COURSE_PUBLIC_NOTIFICATION_SENT" : "COURSE_UPDATE_NOTIFICATION_SENT",
    entityType: "Course",
    entityId: input.courseId,
  });
}

export async function notifyCourseCompletion(input: {
  userId: string;
  courseId: string;
}) {
  await connectToDatabase();
  const course = await CourseModel.findById(input.courseId);
  if (!course) {
    return;
  }

  await createAndSendNotification({
    userId: input.userId,
    type: "COMPLETION",
    title: "Course completed",
    message: `Congratulations. You completed ${course.title}.`,
    metadata: { courseId: input.courseId },
  });
}

export async function recordOtpEmailNotification(input: { userId: string; expiresAt: Date }) {
  await connectToDatabase();
  await createNotificationRecord({
    userId: input.userId,
    type: "OTP",
    title: "OTP email sent",
    message: `A one-time password was sent to your email and expires at ${input.expiresAt.toISOString()}.`,
    channel: "EMAIL",
  });
}

export async function recordVerificationEmailNotification(input: { userId: string }) {
  await connectToDatabase();
  await createNotificationRecord({
    userId: input.userId,
    type: "EMAIL",
    title: "Verification email sent",
    message: "Your account verification email has been sent.",
    channel: "EMAIL",
  });
}
