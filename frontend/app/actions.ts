"use server";

import { register } from "@/lib/api";
import { ApiError, type Lead, type RegisterInput } from "@/lib/types";
import { normalizeRegistration, validateRegistration, type FieldErrors } from "@/lib/validation";

export type RegisterResult =
  | { ok: true; lead: Lead }
  | { ok: false; message: string; fieldErrors: FieldErrors };

export async function registerLead(raw: RegisterInput): Promise<RegisterResult> {
  try {
    const input = normalizeRegistration(raw);
    const fieldErrors = validateRegistration(input);
    if (Object.keys(fieldErrors).length > 0) {
      return { ok: false, message: "Please fix the highlighted fields.", fieldErrors };
    }
    return { ok: true, lead: await register(input) };
  } catch (error) {
    if (error instanceof ApiError) {
      return { ok: false, message: error.message, fieldErrors: error.fieldErrors };
    }
    return { ok: false, message: "Something went wrong. Please try again.", fieldErrors: {} };
  }
}
