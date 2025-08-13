import dotenv from 'dotenv';
import { CookieOptions } from 'express';

dotenv.config();

const configCookie = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  path: '/',
  sameSite: 'lax',
  // httpOnly: true,
  // secure: true,
  // sameSite: 'none',
  // partitioned: true,
  // domain: 'cardsfrontend.vercel.app',
  // path: '/',
} satisfies CookieOptions;

export { configCookie };
