import { z } from 'zod';

export const SalarySubmitSchema = z.object({
  companyName: z.string().min(2, "Company name must be at least 2 characters"),
  role: z.string().min(2, "Role is required"),
  internalLevel: z.string().min(1, "Level is required"),
  location: z.string().min(2, "Location is required"),
  baseSalary: z.number().min(1, "Base salary must be > 0").max(500, "Base salary seems unrealistically high"),
  bonus: z.number().min(0).default(0),
  equity: z.number().min(0).default(0),
  yearsExp: z.number().min(0).max(50)
});

export type SalarySubmitPayload = z.infer<typeof SalarySubmitSchema>;

export const SalaryQuerySchema = z.object({
  company: z.string().optional(),
  role: z.string().optional(),
  location: z.string().optional(),
  minLevel: z.coerce.number().optional(),
  maxLevel: z.coerce.number().optional(),
  minYoe: z.coerce.number().optional(),
  maxYoe: z.coerce.number().optional(),
  page: z.coerce.number().default(1),
  limit: z.coerce.number().default(20),
  sortBy: z.enum(['totalComp', 'baseSalary', 'createdAt']).default('createdAt'),
  sortDir: z.enum(['asc', 'desc']).default('desc')
});
