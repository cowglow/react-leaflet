import type { NextFunction, Request, RequestHandler, Response } from "express";

// Express 4 does not catch rejected promises from async route handlers — an
// uncaught rejection there crashes the whole process (Node terminates on unhandled
// rejections by default). Wrapping every async handler in this forwards the error to
// Express's error-handling middleware instead.
export function asyncHandler(
  handler: (req: Request, res: Response, next: NextFunction) => Promise<unknown>,
): RequestHandler {
  return (req, res, next) => {
    handler(req, res, next).catch(next);
  };
}
