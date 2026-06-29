import { z } from "zod";

const questionSchema = z.object({
  prompt: z.string().min(1),
  options: z.array(z.string().min(1)).min(2),
  correctAnswer: z.string().min(1),
  explanation: z.string().optional(),
  points: z.number().int().positive().optional(),
});

export const createQuizSchema = z.object({
  courseId: z.string().min(1),
  title: z.string().min(2).max(180),
  description: z.string().max(1000).optional(),
  quizType: z.enum(["MCQ", "PRACTICE", "FINAL"]).default("MCQ"),
  passingScore: z.number().min(0).max(100).optional(),
  questions: z.array(questionSchema).min(1),
});

export const updateQuizSchema = createQuizSchema.partial();

export const submitQuizSchema = z.object({
  answers: z.array(
    z.object({
      questionIndex: z.number().int().min(0),
      answer: z.string().min(1),
    }),
  ),
});
