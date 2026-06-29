import { Types } from "mongoose";

import { CourseModel } from "@/db/models/Course";
import { EnrollmentModel } from "@/db/models/Enrollment";
import { LearningProgressModel } from "@/db/models/LearningProgress";
import { QuizAttemptModel } from "@/db/models/QuizAttempt";
import { QuizModel } from "@/db/models/Quiz";
import { connectToDatabase } from "@/db/mongodb";
import { errorResponse, successResponse } from "@/lib/api-response";
import { logActivity } from "@/services/auth/activity-log-service";
import {
  createQuizSchema,
  submitQuizSchema,
  updateQuizSchema,
} from "@/services/quiz/quiz-schemas";

function isValidObjectId(value: string) {
  return Types.ObjectId.isValid(value);
}

function sanitizeQuiz(quiz: {
  _id: { toString(): string };
  courseId: { toString(): string } | string;
  title: string;
  description?: string;
  quizType: "MCQ" | "PRACTICE" | "FINAL";
  assigned: boolean;
  passingScore: number;
  questions: Array<{
    prompt: string;
    options: string[];
    explanation?: string;
    points?: number;
  }>;
  createdAt: Date;
  updatedAt: Date;
}) {
  return {
    id: quiz._id.toString(),
    courseId:
      typeof quiz.courseId === "string" ? quiz.courseId : quiz.courseId.toString(),
    title: quiz.title,
    description: quiz.description,
    quizType: quiz.quizType,
    assigned: quiz.assigned,
    passingScore: quiz.passingScore,
    questions: quiz.questions.map((question, index) => ({
      index,
      prompt: question.prompt,
      options: question.options,
      explanation: question.explanation,
      points: question.points ?? 1,
    })),
    createdAt: quiz.createdAt,
    updatedAt: quiz.updatedAt,
  };
}

function sanitizeAttempt(attempt: {
  _id: { toString(): string };
  quizId: { toString(): string } | string;
  userId: { toString(): string } | string;
  courseId: { toString(): string } | string;
  answers: Array<Record<string, unknown>>;
  totalScore: number;
  percentage: number;
  passed: boolean;
  attemptType: "MCQ" | "PRACTICE" | "FINAL";
  submittedAt: Date;
  createdAt?: Date;
  updatedAt?: Date;
}) {
  return {
    id: attempt._id.toString(),
    quizId: typeof attempt.quizId === "string" ? attempt.quizId : attempt.quizId.toString(),
    userId: typeof attempt.userId === "string" ? attempt.userId : attempt.userId.toString(),
    courseId:
      typeof attempt.courseId === "string" ? attempt.courseId : attempt.courseId.toString(),
    answers: attempt.answers,
    totalScore: attempt.totalScore,
    percentage: attempt.percentage,
    passed: attempt.passed,
    attemptType: attempt.attemptType,
    submittedAt: attempt.submittedAt,
    createdAt: attempt.createdAt,
    updatedAt: attempt.updatedAt,
  };
}

export async function createQuiz(input: unknown, actorId: string) {
  const parsed = createQuizSchema.safeParse(input);
  if (!parsed.success) {
    return { status: 400, body: errorResponse("Invalid quiz payload", parsed.error.flatten()) };
  }

  if (!isValidObjectId(parsed.data.courseId)) {
    return { status: 400, body: errorResponse("Invalid course id") };
  }

  await connectToDatabase();
  const course = await CourseModel.findById(parsed.data.courseId);
  if (!course) {
    return { status: 404, body: errorResponse("Course not found") };
  }

  const quiz = await QuizModel.create({
    ...parsed.data,
    assigned: false,
  });

  await logActivity({
    userId: actorId,
    action: "QUIZ_CREATED",
    entityType: "Quiz",
    entityId: quiz._id.toString(),
    metadata: { courseId: parsed.data.courseId },
  });

  return { status: 201, body: successResponse("Quiz created successfully", sanitizeQuiz(quiz)) };
}

export async function updateQuiz(quizId: string, input: unknown, actorId: string) {
  if (!isValidObjectId(quizId)) {
    return { status: 400, body: errorResponse("Invalid quiz id") };
  }

  const parsed = updateQuizSchema.safeParse(input);
  if (!parsed.success) {
    return { status: 400, body: errorResponse("Invalid quiz payload", parsed.error.flatten()) };
  }

  await connectToDatabase();
  const quiz = await QuizModel.findById(quizId);
  if (!quiz) {
    return { status: 404, body: errorResponse("Quiz not found") };
  }

  Object.assign(quiz, parsed.data);
  await quiz.save();

  await logActivity({
    userId: actorId,
    action: "QUIZ_UPDATED",
    entityType: "Quiz",
    entityId: quizId,
  });

  return { status: 200, body: successResponse("Quiz updated successfully", sanitizeQuiz(quiz)) };
}

export async function deleteQuiz(quizId: string, actorId: string) {
  if (!isValidObjectId(quizId)) {
    return { status: 400, body: errorResponse("Invalid quiz id") };
  }

  await connectToDatabase();
  const quiz = await QuizModel.findByIdAndDelete(quizId);
  if (!quiz) {
    return { status: 404, body: errorResponse("Quiz not found") };
  }

  await QuizAttemptModel.deleteMany({ quizId });

  await logActivity({
    userId: actorId,
    action: "QUIZ_DELETED",
    entityType: "Quiz",
    entityId: quizId,
  });

  return { status: 200, body: successResponse("Quiz deleted successfully", null) };
}

export async function assignQuiz(quizId: string, actorId: string) {
  if (!isValidObjectId(quizId)) {
    return { status: 400, body: errorResponse("Invalid quiz id") };
  }

  await connectToDatabase();
  const quiz = await QuizModel.findById(quizId);
  if (!quiz) {
    return { status: 404, body: errorResponse("Quiz not found") };
  }

  quiz.assigned = true;
  await quiz.save();

  await logActivity({
    userId: actorId,
    action: "QUIZ_ASSIGNED",
    entityType: "Quiz",
    entityId: quizId,
  });

  return { status: 200, body: successResponse("Quiz assigned successfully", sanitizeQuiz(quiz)) };
}

export async function listAdminQuizzes(query: Record<string, string | undefined>) {
  await connectToDatabase();
  const filter: Record<string, unknown> = {};

  if (query.courseId && isValidObjectId(query.courseId)) {
    filter.courseId = query.courseId;
  }
  if (query.quizType) {
    filter.quizType = query.quizType;
  }

  const quizzes = await QuizModel.find(filter).sort({ createdAt: -1 }).limit(100);
  return {
    status: 200,
    body: successResponse("Quizzes fetched successfully", quizzes.map((quiz) => sanitizeQuiz(quiz))),
  };
}

export async function getQuizForLearner(userId: string, quizId: string) {
  if (!isValidObjectId(quizId)) {
    return { status: 400, body: errorResponse("Invalid quiz id") };
  }

  await connectToDatabase();
  const quiz = await QuizModel.findById(quizId);
  if (!quiz || !quiz.assigned) {
    return { status: 404, body: errorResponse("Assigned quiz not found") };
  }

  const enrollment = await EnrollmentModel.findOne({
    userId,
    courseId: quiz.courseId,
    status: "APPROVED",
  });
  if (!enrollment) {
    return { status: 403, body: errorResponse("Quiz access not granted") };
  }

  return {
    status: 200,
    body: successResponse("Quiz fetched successfully", sanitizeQuiz(quiz)),
  };
}

export async function listLearnerQuizzes(userId: string, query: Record<string, string | undefined>) {
  await connectToDatabase();
  const approvedEnrollments = await EnrollmentModel.find({
    userId,
    status: "APPROVED",
  });
  const courseIds = approvedEnrollments.map((item) => item.courseId);

  const filter: Record<string, unknown> = {
    assigned: true,
    courseId: { $in: courseIds },
  };

  if (query.courseId && isValidObjectId(query.courseId)) {
    filter.courseId = query.courseId;
  }
  if (query.quizType) {
    filter.quizType = query.quizType;
  }

  const quizzes = await QuizModel.find(filter).sort({ createdAt: -1 }).limit(100);
  return {
    status: 200,
    body: successResponse("Learner quizzes fetched successfully", quizzes.map((quiz) => sanitizeQuiz(quiz))),
  };
}

export async function submitQuiz(userId: string, quizId: string, input: unknown) {
  if (!isValidObjectId(quizId)) {
    return { status: 400, body: errorResponse("Invalid quiz id") };
  }

  const parsed = submitQuizSchema.safeParse(input);
  if (!parsed.success) {
    return { status: 400, body: errorResponse("Invalid quiz submission payload", parsed.error.flatten()) };
  }

  await connectToDatabase();
  const quiz = await QuizModel.findById(quizId);
  if (!quiz || !quiz.assigned) {
    return { status: 404, body: errorResponse("Assigned quiz not found") };
  }

  const enrollment = await EnrollmentModel.findOne({
    userId,
    courseId: quiz.courseId,
    status: "APPROVED",
  });
  if (!enrollment) {
    return { status: 403, body: errorResponse("Quiz access not granted") };
  }

  const gradedAnswers = parsed.data.answers.map((answer) => {
    const question = quiz.questions[answer.questionIndex];
    const isCorrect = !!question && question.correctAnswer === answer.answer;
    const pointsAwarded = isCorrect ? question?.points ?? 1 : 0;

    return {
      questionIndex: answer.questionIndex,
      answer: answer.answer,
      isCorrect,
      pointsAwarded,
    };
  });

  const totalAvailable = quiz.questions.reduce(
    (sum: number, question: { points?: number }) => sum + (question.points ?? 1),
    0,
  );
  const totalScore = gradedAnswers.reduce((sum, answer) => sum + answer.pointsAwarded, 0);
  const percentage =
    totalAvailable > 0 ? Math.round((totalScore / totalAvailable) * 100) : 0;
  const passed = percentage >= quiz.passingScore;

  const attempt = await QuizAttemptModel.create({
    quizId,
    userId,
    courseId: quiz.courseId,
    answers: gradedAnswers,
    totalScore,
    percentage,
    passed,
    attemptType: quiz.quizType,
    submittedAt: new Date(),
  });

  const progress = await LearningProgressModel.findOne({
    userId,
    courseId: quiz.courseId,
  });
  if (progress) {
    progress.history.push({
      type: "ACHIEVEMENT_UNLOCKED",
      title: `${quiz.quizType} quiz submitted`,
      occurredAt: new Date(),
      metadata: {
        quizId,
        percentage,
        passed,
      },
    });
    await progress.save();
  }

  await logActivity({
    userId,
    action: "QUIZ_SUBMITTED",
    entityType: "QuizAttempt",
    entityId: attempt._id.toString(),
    metadata: { quizId, percentage, passed },
  });

  return {
    status: 201,
    body: successResponse("Quiz submitted successfully", sanitizeAttempt(attempt)),
  };
}

export async function getQuizResults(userId: string, quizId: string) {
  if (!isValidObjectId(quizId)) {
    return { status: 400, body: errorResponse("Invalid quiz id") };
  }

  await connectToDatabase();
  const attempts = await QuizAttemptModel.find({ quizId, userId }).sort({ submittedAt: -1 });

  return {
    status: 200,
    body: successResponse(
      "Quiz results fetched successfully",
      attempts.map((attempt) => sanitizeAttempt(attempt)),
    ),
  };
}

export async function getAssessmentResults(userId: string) {
  await connectToDatabase();
  const attempts = await QuizAttemptModel.find({ userId }).sort({ submittedAt: -1 });
  return {
    status: 200,
    body: successResponse(
      "Assessment results fetched successfully",
      attempts.map((attempt) => sanitizeAttempt(attempt)),
    ),
  };
}

export async function getPerformanceDashboard(userId: string) {
  await connectToDatabase();
  const attempts = await QuizAttemptModel.find({ userId });

  const totalAttempts = attempts.length;
  const passedAttempts = attempts.filter((attempt) => attempt.passed).length;
  const averageScore = totalAttempts
    ? Math.round(
        attempts.reduce((sum, attempt) => sum + attempt.percentage, 0) / totalAttempts,
      )
    : 0;

  return {
    status: 200,
    body: successResponse("Performance dashboard fetched successfully", {
      totalAttempts,
      passedAttempts,
      averageScore,
      results: attempts.map((attempt) => sanitizeAttempt(attempt)),
    }),
  };
}
