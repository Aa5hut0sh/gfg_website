import { z } from "zod";
import type { Request, Response, NextFunction } from "express";
import type { ZodSchema } from "zod";

export const validate = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse({
      body: req.body,
      params: req.params,
      query: req.query,
    });

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: result.error.issues[0]?.message,
        errors: result.error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        })),
      });
    }

    next();
  };
};

export const signupSchema = z.object({
  body: z.object({
    email: z
      .string()
      .regex(
        /^\d{2}[a-zA-Z]{2}\d{4}@rgipt\.ac\.in$/,
        "Email must be of form 24cs3013@rgipt.ac.in"
      ),

    password: z
      .string()
      .min(6, "Minimum 6 characters")
      .regex(/[A-Z]/, "One uppercase required")
      .regex(/[0-9]/, "One number required")
      .regex(/[^A-Za-z0-9]/, "One special character required"),

    name: z.string().min(2).max(50),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(1, "Password required"),
  }),
});

export const googleLoginSchema = z.object({
  body: z.object({
    credential: z.string().min(1, "Credential required"),
  }),
});

export const refreshTokenSchema = z.object({
  body: z.object({
    refreshToken: z.string().min(1, "Refresh token required"),
  }),
});

const teams = ["Technical Team", "Design Team" , "Dev Team" , "E-sports Team" , "Logistic Team" , "VideoEditing Team" , "PR-Outreach Team" , "SocialMedia Team" , "Editorial Team"];

export const applicationSchema = z.object({
  body: z
    .object({
      MobileNo: z.string().length(10),

      preference1: z.enum(teams),
      preference2: z.enum(teams),
      preference3: z.enum(teams),

      reason: z.string().trim().min(10),

      skills: z
        .array(z.string().trim())
        .min(1, "At least one skill is required"),

      otherClubs: z.array(z.string().trim()).optional(),
    })

    .superRefine((data, ctx) => {
      const prefs = [data.preference1, data.preference2, data.preference3];

      const uniquePrefs = new Set(prefs);

      if (uniquePrefs.size !== prefs.length) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "All preferences must be different",
          path: ["preference1"],
        });
      }
    }),
});

const status = ["pending", "accepted", "rejected"];

const fieldTypes = [
  "text",
  "email",
  "number",
  "select",
  "checkbox",
  "textarea",
  "date",
];

export const updateApplicationSchema = z.object({
  body: z.object({
    userId: z.string(),
    newStatus: z.enum(status),
  }),
});

export const adminLoginSchema = z.object({
  body: z.object({
    email: z
      .string()
      .regex(/^\d{2}[a-zA-Z]{2}\d{4}@rgipt\.ac\.in$/, "Invalid admin email"),

    password: z.string().min(1, "Password required"),

    adminSecret: z.string().min(1, "Admin secret required"),
  }),
});

export const adminSignupSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(50),
    email: z
      .string()
      .regex(
        /^\d{2}[a-zA-Z]{2}\d{4}@rgipt\.ac\.in$/,
        "Email must be of form 24cs3063@rgipt.ac.in",
      ),
    password: z
      .string()
      .min(6, "Minimum 6 characters")
      .regex(/[A-Z]/, "One uppercase required")
      .regex(/[0-9]/, "One number required")
      .regex(/[^A-Za-z0-9]/, "One special character required"),
    adminSecret: z.string().min(2, "Admin secret is required"),
  }),
});

export const createEventSchema = z.object({
  body: z.object({
    title: z.string().min(3, "Title is required"),

    description: z.string().min(10, "Description is required"),

    deadline: z.string().or(z.date()),

    isActive: z
      .preprocess((val) => val === "true" || val === true, z.boolean())
      .optional()
      .default(true),

    fields: z
      .array(
        z.object({
          label: z.string().min(1),
          name: z.string().min(1),
          type: z.enum(fieldTypes),
          required: z.boolean().optional(),
          options: z.array(z.string()).optional(),
        }),
      )
      .min(1, "At least one field is required"),
  }),
});

export const updateEventSchema = z.object({
  params: z.object({
    eventId: z.string(),
  }),

  body: z.object({
    title: z.string().min(3).optional(),

    description: z.string().min(10).optional(),

    deadline: z.string().datetime().optional(),

    isActive: z
      .preprocess((val) => val === "true" || val === true, z.boolean())
      .optional(),

    fields: z
      .array(
        z.object({
          label: z.string().min(1),
          name: z.string().min(1),
          type: z.enum(fieldTypes),
          required: z.boolean().optional(),
          options: z.array(z.string()).optional(),
        }),
      )
      .optional(),
  }),
});

export const registerEventSchema = z.object({
  body: z.object({
    responses: z.record(z.string(), z.any()),
  }),
});
