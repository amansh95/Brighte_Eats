import type { RegisterInput } from "./types";

export type FieldErrors = Record<string, string>;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const AU_MOBILE = /^(?:04\d{8}|\+614\d{8})$/;
const AU_POSTCODE = /^\d{4}$/;

export function normalizeRegistration(input: RegisterInput): RegisterInput {
  return {
    name: input.name.trim(),
    email: input.email.trim().toLowerCase(),
    mobile: input.mobile.replace(/\s/g, ""),
    postcode: input.postcode.trim(),
    services: input.services,
  };
}

export function validateRegistration(input: RegisterInput): FieldErrors {
  const errors: FieldErrors = {};
  if (!input.name) errors.name = "Enter your name.";
  if (!EMAIL.test(input.email)) errors.email = "Enter a valid email address.";
  if (!AU_MOBILE.test(input.mobile)) errors.mobile = "Enter an Australian mobile, like 0412 345 678.";
  if (!AU_POSTCODE.test(input.postcode)) errors.postcode = "Postcode must be 4 digits.";
  return errors;
}
