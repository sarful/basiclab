import { model, models, Schema } from "mongoose";

const ticketReplySchema = new Schema(
  {
    authorId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    authorRole: {
      type: String,
      enum: ["ADMIN", "LEARNER_EN", "LEARNER_BN"],
      required: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false },
);

const supportTicketSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    subject: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      enum: ["GENERAL", "TECHNICAL", "ENROLLMENT", "COURSE", "CERTIFICATE", "PAYMENT"],
      default: "GENERAL",
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"],
      default: "OPEN",
    },
    priority: {
      type: String,
      enum: ["LOW", "MEDIUM", "HIGH", "URGENT"],
      default: "MEDIUM",
    },
    replies: {
      type: [ticketReplySchema],
      default: [],
    },
    lastRepliedAt: Date,
    closedAt: Date,
  },
  {
    timestamps: true,
  },
);

export const SupportTicketModel =
  models.SupportTicket || model("SupportTicket", supportTicketSchema);
