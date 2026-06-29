import crypto from "node:crypto";
import { Types } from "mongoose";

import { CertificateModel } from "@/db/models/Certificate";
import { CertificateTemplateModel } from "@/db/models/CertificateTemplate";
import { CourseModel } from "@/db/models/Course";
import { LearningProgressModel } from "@/db/models/LearningProgress";
import { QuizAttemptModel } from "@/db/models/QuizAttempt";
import { UserModel } from "@/db/models/User";
import { connectToDatabase } from "@/db/mongodb";
import { errorResponse, successResponse } from "@/lib/api-response";
import { logActivity } from "@/services/auth/activity-log-service";
import { deriveCourseLessonsForRole } from "@/services/learning/course-lessons";
import {
  createCertificateTemplateSchema,
  generateCertificateSchema,
  updateCertificateTemplateSchema,
} from "@/services/certificate/certificate-schemas";

function isValidObjectId(value: string) {
  return Types.ObjectId.isValid(value);
}

function generateCertificateCode() {
  return `BL-${crypto.randomBytes(4).toString("hex").toUpperCase()}`;
}

function sanitizeTemplate(template: {
  _id: { toString(): string };
  name: string;
  title: string;
  subtitle?: string;
  body?: string;
  signatureName?: string;
  signatureTitle?: string;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}) {
  return {
    id: template._id.toString(),
    name: template.name,
    title: template.title,
    subtitle: template.subtitle,
    body: template.body,
    signatureName: template.signatureName,
    signatureTitle: template.signatureTitle,
    isDefault: template.isDefault,
    createdAt: template.createdAt,
    updatedAt: template.updatedAt,
  };
}

function sanitizeCertificate(certificate: {
  _id: { toString(): string };
  certificateCode: string;
  userId: { toString(): string } | string;
  courseId: { toString(): string } | string;
  templateId?: { toString(): string } | string;
  issuedAt: Date;
  printableContent: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}) {
  return {
    id: certificate._id.toString(),
    certificateCode: certificate.certificateCode,
    userId:
      typeof certificate.userId === "string"
        ? certificate.userId
        : certificate.userId.toString(),
    courseId:
      typeof certificate.courseId === "string"
        ? certificate.courseId
        : certificate.courseId.toString(),
    templateId:
      typeof certificate.templateId === "string"
        ? certificate.templateId
        : certificate.templateId?.toString(),
    issuedAt: certificate.issuedAt,
    printableContent: certificate.printableContent,
    createdAt: certificate.createdAt,
    updatedAt: certificate.updatedAt,
  };
}

export async function createCertificateTemplate(input: unknown, actorId: string) {
  const parsed = createCertificateTemplateSchema.safeParse(input);
  if (!parsed.success) {
    return { status: 400, body: errorResponse("Invalid certificate template payload", parsed.error.flatten()) };
  }

  await connectToDatabase();
  if (parsed.data.isDefault) {
    await CertificateTemplateModel.updateMany({}, { isDefault: false });
  }

  const template = await CertificateTemplateModel.create(parsed.data);

  await logActivity({
    userId: actorId,
    action: "CERTIFICATE_TEMPLATE_CREATED",
    entityType: "CertificateTemplate",
    entityId: template._id.toString(),
  });

  return {
    status: 201,
    body: successResponse("Certificate template created successfully", sanitizeTemplate(template)),
  };
}

export async function updateCertificateTemplate(templateId: string, input: unknown, actorId: string) {
  if (!isValidObjectId(templateId)) {
    return { status: 400, body: errorResponse("Invalid template id") };
  }

  const parsed = updateCertificateTemplateSchema.safeParse(input);
  if (!parsed.success) {
    return { status: 400, body: errorResponse("Invalid certificate template payload", parsed.error.flatten()) };
  }

  await connectToDatabase();
  if (parsed.data.isDefault) {
    await CertificateTemplateModel.updateMany({}, { isDefault: false });
  }

  const template = await CertificateTemplateModel.findByIdAndUpdate(templateId, parsed.data, {
    new: true,
  });
  if (!template) {
    return { status: 404, body: errorResponse("Certificate template not found") };
  }

  await logActivity({
    userId: actorId,
    action: "CERTIFICATE_TEMPLATE_UPDATED",
    entityType: "CertificateTemplate",
    entityId: templateId,
  });

  return {
    status: 200,
    body: successResponse("Certificate template updated successfully", sanitizeTemplate(template)),
  };
}

export async function listCertificateTemplates() {
  await connectToDatabase();
  const templates = await CertificateTemplateModel.find().sort({ createdAt: -1 });
  return {
    status: 200,
    body: successResponse(
      "Certificate templates fetched successfully",
      templates.map((template) => sanitizeTemplate(template)),
    ),
  };
}

export async function generateCertificate(userId: string, input: unknown) {
  const parsed = generateCertificateSchema.safeParse(input);
  if (!parsed.success) {
    return { status: 400, body: errorResponse("Invalid certificate generation payload", parsed.error.flatten()) };
  }

  if (!isValidObjectId(parsed.data.courseId)) {
    return { status: 400, body: errorResponse("Invalid course id") };
  }
  if (parsed.data.templateId && !isValidObjectId(parsed.data.templateId)) {
    return { status: 400, body: errorResponse("Invalid template id") };
  }

  await connectToDatabase();
  const [user, course, progress, finalAttempt] = await Promise.all([
    UserModel.findById(userId),
    CourseModel.findById(parsed.data.courseId),
    LearningProgressModel.findOne({ userId, courseId: parsed.data.courseId }),
    QuizAttemptModel.findOne({
      userId,
      courseId: parsed.data.courseId,
      attemptType: "FINAL",
      passed: true,
    }).sort({ submittedAt: -1 }),
  ]);

  if (!user || !course) {
    return { status: 404, body: errorResponse("User or course not found") };
  }

  if (!progress) {
    return { status: 400, body: errorResponse("Course progress not found") };
  }

  const allowedLessons = deriveCourseLessonsForRole(course, user.role);
  const allowedLessonIds = new Set(allowedLessons.map((lesson) => lesson.id));
  const completedAllowedLessonIds = (progress.completedLessonIds ?? []).filter(
    (lessonId: string) => allowedLessonIds.has(lessonId),
  );

  if (
    allowedLessons.length === 0 ||
    completedAllowedLessonIds.length < allowedLessons.length
  ) {
    return {
      status: 400,
      body: errorResponse("Course is not yet completed for this learner access scope"),
    };
  }

  const template =
    (parsed.data.templateId
      ? await CertificateTemplateModel.findById(parsed.data.templateId)
      : await CertificateTemplateModel.findOne({ isDefault: true })) ??
    (await CertificateTemplateModel.findOne());

  const existing = await CertificateModel.findOne({
    userId,
    courseId: parsed.data.courseId,
  });
  if (existing) {
    return {
      status: 200,
      body: successResponse("Certificate already exists", sanitizeCertificate(existing)),
    };
  }

  const certificate = await CertificateModel.create({
    certificateCode: generateCertificateCode(),
    userId,
    courseId: parsed.data.courseId,
    templateId: template?._id,
    issuedAt: new Date(),
    printableContent: {
      learnerName: user.fullName,
      courseTitle: course.title,
      issuedAt: new Date().toISOString(),
      template: template
        ? {
            name: template.name,
            title: template.title,
            subtitle: template.subtitle,
            body: template.body,
            signatureName: template.signatureName,
            signatureTitle: template.signatureTitle,
          }
        : null,
      finalAssessmentScore: finalAttempt?.percentage ?? null,
    },
  });

  await logActivity({
    userId,
    action: "CERTIFICATE_GENERATED",
    entityType: "Certificate",
    entityId: certificate._id.toString(),
    metadata: { courseId: parsed.data.courseId },
  });

  return {
    status: 201,
    body: successResponse("Certificate generated successfully", sanitizeCertificate(certificate)),
  };
}

export async function listCertificates(userId: string) {
  await connectToDatabase();
  const certificates = await CertificateModel.find({ userId }).sort({ issuedAt: -1 });
  return {
    status: 200,
    body: successResponse(
      "Certificates fetched successfully",
      certificates.map((certificate) => sanitizeCertificate(certificate)),
    ),
  };
}

export async function getCertificate(certificateId: string, userId?: string) {
  if (!isValidObjectId(certificateId)) {
    return { status: 400, body: errorResponse("Invalid certificate id") };
  }

  await connectToDatabase();
  const filter: Record<string, unknown> = { _id: certificateId };
  if (userId) {
    filter.userId = userId;
  }
  const certificate = await CertificateModel.findOne(filter);
  if (!certificate) {
    return { status: 404, body: errorResponse("Certificate not found") };
  }

  return {
    status: 200,
    body: successResponse("Certificate fetched successfully", sanitizeCertificate(certificate)),
  };
}

export async function verifyCertificateByCode(certificateCode: string) {
  await connectToDatabase();
  const certificate = await CertificateModel.findOne({ certificateCode });
  if (!certificate) {
    return { status: 404, body: errorResponse("Certificate not found") };
  }

  return {
    status: 200,
    body: successResponse("Certificate verified successfully", sanitizeCertificate(certificate)),
  };
}
