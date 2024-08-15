import { ErrorInstance } from "@src/utils/errors";
import { NextFunction, Request, Response } from "express";

function getMessageError(message: string) {
  let response: Object | string;
  try {
    response = JSON.parse(message);
  } catch (error) {
    response = message || "Internal Server Error";
  }

  return response;
}

export function ErrorMiddleware(
  error: Error & Partial<ErrorInstance>,
  req: Request,
  res: Response,
  next: NextFunction
) {
  const statusCode = error.statusCode || 500;
  const message = getMessageError(error.message);
  const errorText = error.error || "Internal Server Error";

  return res.status(statusCode).json({
    statusCode,
    errorText,
    message,
  });
}
