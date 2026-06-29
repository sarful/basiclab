import { cp, mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";

import { BackupJobModel } from "@/db/models/BackupJob";
import { AnnouncementModel } from "@/db/models/Announcement";
import { AuditLogModel } from "@/db/models/AuditLog";
import { CertificateModel } from "@/db/models/Certificate";
import { CertificateTemplateModel } from "@/db/models/CertificateTemplate";
import { CourseModel } from "@/db/models/Course";
import { CourseCategoryModel } from "@/db/models/CourseCategory";
import { EnrollmentModel } from "@/db/models/Enrollment";
import { LearningProgressModel } from "@/db/models/LearningProgress";
import { NotificationModel } from "@/db/models/Notification";
import { OtpCodeModel } from "@/db/models/OtpCode";
import { PasswordResetTokenModel } from "@/db/models/PasswordResetToken";
import { QuizAttemptModel } from "@/db/models/QuizAttempt";
import { QuizModel } from "@/db/models/Quiz";
import { SessionModel } from "@/db/models/Session";
import { SupportTicketModel } from "@/db/models/SupportTicket";
import { UploadedFileModel } from "@/db/models/UploadedFile";
import { UserModel } from "@/db/models/User";
import { VerificationTokenModel } from "@/db/models/VerificationToken";
import { env } from "@/config/env";
import { connectToDatabase } from "@/db/mongodb";
import { errorResponse, successResponse } from "@/lib/api-response";
import { logActivity } from "@/services/auth/activity-log-service";

type BackupType = "FULL" | "DATABASE" | "FILES";

const modelRegistry = {
  users: UserModel,
  verificationTokens: VerificationTokenModel,
  otpCodes: OtpCodeModel,
  passwordResetTokens: PasswordResetTokenModel,
  sessions: SessionModel,
  courseCategories: CourseCategoryModel,
  courses: CourseModel,
  enrollments: EnrollmentModel,
  learningProgress: LearningProgressModel,
  quizzes: QuizModel,
  quizAttempts: QuizAttemptModel,
  certificateTemplates: CertificateTemplateModel,
  certificates: CertificateModel,
  auditLogs: AuditLogModel,
  announcements: AnnouncementModel,
  notifications: NotificationModel,
  supportTickets: SupportTicketModel,
  uploadedFiles: UploadedFileModel,
} as const;

async function exportDatabaseSnapshot() {
  const snapshot: Record<string, unknown[]> = {};

  for (const [key, model] of Object.entries(modelRegistry)) {
    const rows = await model.find().lean();
    snapshot[key] = JSON.parse(JSON.stringify(rows));
  }

  return snapshot;
}

async function importDatabaseSnapshot(snapshot: Record<string, unknown[]>) {
  for (const [key, model] of Object.entries(modelRegistry)) {
    await model.deleteMany({});
    const rows = snapshot[key] ?? [];
    if (rows.length > 0) {
      await model.insertMany(rows, { ordered: false });
    }
  }
}

async function countFilesInDirectory(directory: string) {
  try {
    const entries = await readdir(directory, { withFileTypes: true });
    return entries.filter((entry) => entry.isFile()).length;
  } catch {
    return 0;
  }
}

function sanitizeBackupJob(job: {
  _id: { toString(): string };
  type: BackupType;
  status: string;
  backupPath: string;
  summary?: Record<string, unknown>;
  createdBy: { toString(): string } | string;
  restoredAt?: Date;
  restoredBy?: { toString(): string } | string;
  createdAt: Date;
  updatedAt: Date;
}) {
  return {
    id: job._id.toString(),
    type: job.type,
    status: job.status,
    backupPath: job.backupPath,
    summary: job.summary,
    createdBy: typeof job.createdBy === "string" ? job.createdBy : job.createdBy.toString(),
    restoredAt: job.restoredAt,
    restoredBy:
      typeof job.restoredBy === "string" ? job.restoredBy : job.restoredBy?.toString(),
    createdAt: job.createdAt,
    updatedAt: job.updatedAt,
  };
}

export async function createBackup(type: BackupType, actorId: string) {
  await connectToDatabase();
  await mkdir(env.BACKUP_DIR, { recursive: true });

  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  const backupPath = path.join(env.BACKUP_DIR, `${stamp}-${type.toLowerCase()}`);
  await mkdir(backupPath, { recursive: true });

  const summary: Record<string, unknown> = {
    type,
    databaseCollections: 0,
    fileCount: 0,
  };

  if (type === "FULL" || type === "DATABASE") {
    const snapshot = await exportDatabaseSnapshot();
    await writeFile(path.join(backupPath, "database.json"), JSON.stringify(snapshot, null, 2), "utf8");
    summary.databaseCollections = Object.keys(snapshot).length;
  }

  if (type === "FULL" || type === "FILES") {
    await mkdir(env.UPLOAD_DIR, { recursive: true });
    const filesBackupPath = path.join(backupPath, "uploads");
    await cp(env.UPLOAD_DIR, filesBackupPath, { recursive: true, force: true });
    summary.fileCount = await countFilesInDirectory(filesBackupPath);
  }

  const job = await BackupJobModel.create({
    type,
    status: "COMPLETED",
    backupPath,
    summary,
    createdBy: actorId,
  });

  await logActivity({
    userId: actorId,
    action: "BACKUP_CREATED",
    entityType: "BackupJob",
    entityId: job._id.toString(),
    metadata: { type, backupPath },
  });

  return {
    status: 201,
    body: successResponse("Backup created successfully", sanitizeBackupJob(job)),
  };
}

export async function listBackups() {
  await connectToDatabase();
  const jobs = await BackupJobModel.find().sort({ createdAt: -1 }).limit(100);
  return {
    status: 200,
    body: successResponse("Backups fetched successfully", jobs.map((job) => sanitizeBackupJob(job))),
  };
}

export async function restoreBackup(backupId: string, actorId: string) {
  await connectToDatabase();
  const job = await BackupJobModel.findById(backupId);
  if (!job) {
    return { status: 404, body: errorResponse("Backup not found") };
  }

  const dbFile = path.join(job.backupPath, "database.json");
  const filesPath = path.join(job.backupPath, "uploads");

  try {
    const databasePayload = await readFile(dbFile, "utf8").catch(() => null);
    if (databasePayload) {
      await importDatabaseSnapshot(JSON.parse(databasePayload) as Record<string, unknown[]>);
    }

    await mkdir(env.UPLOAD_DIR, { recursive: true });
    await cp(filesPath, env.UPLOAD_DIR, { recursive: true, force: true }).catch(() => undefined);
  } catch (error) {
    return {
      status: 500,
      body: errorResponse("Backup restore failed", {
        reason: error instanceof Error ? error.message : "Unknown restore error",
      }),
    };
  }

  job.status = "RESTORED";
  job.restoredAt = new Date();
  job.restoredBy = actorId;
  await job.save();

  await logActivity({
    userId: actorId,
    action: "BACKUP_RESTORED",
    entityType: "BackupJob",
    entityId: job._id.toString(),
    metadata: { backupPath: job.backupPath },
  });

  return {
    status: 200,
    body: successResponse("Backup restored successfully", sanitizeBackupJob(job)),
  };
}
