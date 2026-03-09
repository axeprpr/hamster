import { z } from "zod/v4";

export const registerSchema = z.object({
  email: z.email("Invalid email address"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const loginSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const credentialSchema = z.object({
  name: z.string().min(1, "Name is required"),
  category: z.string().min(1, "Category is required"),
  value: z.string().min(1, "Value is required"),
  description: z.string().optional(),
  metadata: z.record(z.string(), z.string()).optional(),
});

export const credentialUpdateSchema = z.object({
  name: z.string().min(1).optional(),
  category: z.string().min(1).optional(),
  value: z.string().min(1).optional(),
  description: z.string().optional(),
  metadata: z.record(z.string(), z.string()).optional(),
});

export const skillSchema = z.object({
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase letters, numbers, and hyphens"),
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  instructionTemplate: z.string().min(1, "Instruction template is required"),
  credentialIds: z.array(z.string()).optional(),
  isPublished: z.boolean().optional(),
});

export const skillUpdateSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  instructionTemplate: z.string().min(1).optional(),
  credentialIds: z.array(z.string()).optional(),
  isPublished: z.boolean().optional(),
});

export const machineSchema = z.object({
  machineCode: z.string().min(1, "Machine code is required"),
  label: z.string().optional(),
});

export const tokenSchema = z.object({
  machineId: z.string().uuid().optional(),
  name: z.string().optional(),
  expiresInDays: z.number().int().positive().optional(),
});

export const installSchema = z.object({
  machineCode: z.string().min(1, "Machine code is required"),
});
