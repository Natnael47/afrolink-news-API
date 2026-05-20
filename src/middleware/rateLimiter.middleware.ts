import rateLimit from "express-rate-limit";

// Strict rate limiter for auth routes (prevent brute force)
export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts per 15 minutes
  message: {
    Success: false,
    Message: "Too many authentication attempts",
    Object: null,
    Errors: ["Please try again after 15 minutes"],
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
});

// Rate limiter for article reads
export const readRateLimiter = rateLimit({
  windowMs: 10 * 1000,
  max: 100,
  message: {
    Success: false,
    Message: "Too many read requests",
    Object: null,
    Errors: ["Rate limit exceeded. Maximum 100 article reads per 10 seconds."],
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Stricter limiter for non-authenticated users
export const publicReadRateLimiter = rateLimit({
  windowMs: 10 * 1000,
  max: 20,
  message: {
    Success: false,
    Message: "Too many read requests",
    Object: null,
    Errors: [
      "Please slow down. Maximum 20 article reads per 10 seconds for non-authenticated users.",
    ],
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// General API rate limiter
export const apiRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 200,
  message: {
    Success: false,
    Message: "Too many requests",
    Object: null,
    Errors: ["Please slow down your requests"],
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => req.path === "/health",
});
