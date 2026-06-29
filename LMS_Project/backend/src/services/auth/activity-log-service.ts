import { AuditLogModel } from "@/db/models/AuditLog";

type ActivityLogInput = {
  userId?: string | null;
  action: string;
  entityType: string;
  entityId?: string;
  metadata?: Record<string, unknown>;
};

export async function logActivity(input: ActivityLogInput) {
  await AuditLogModel.create({
    userId: input.userId ?? undefined,
    action: input.action,
    entityType: input.entityType,
    entityId: input.entityId,
    metadata: input.metadata,
  });
}
