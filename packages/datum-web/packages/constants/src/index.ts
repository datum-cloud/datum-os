export const IS_DEV = process.env.NODE_ENV !== "production";
export const IS_PROD = process.env.NEXT_PUBLIC_VERCEL_ENV === "production";
export const IS_SERVER = typeof globalThis?.window === "undefined";
export const IS_PREVIEW = process.env.NEXT_PUBLIC_VERCEL_ENV === "preview";
export const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "";

export enum HttpStatus {
  Ok = 200,
  NoContent = 204,
  MovedPermanently = 301,
  TemporaryRedirect = 307,
  BadRequest = 400,
  Unauthorized = 401,
  NotFound = 404,
  Conflict = 409,
  Teapot = 418,
  UnprocessableContent = 422,
  TooManyRequests = 429,
  InternalServerError = 500,
  NotImplemented = 501,
  ServiceUnavailable = 503,
  GatewayTimeout = 504,
}