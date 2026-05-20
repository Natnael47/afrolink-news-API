import { ZodError } from "zod";

export const formatZodErrors = (error: ZodError): string[] => {
  // Use error.issues instead of error.errors
  return error.issues.map((err) => `${err.path.join(".")}: ${err.message}`);
};
