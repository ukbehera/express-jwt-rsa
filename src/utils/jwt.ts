import jwt, { Secret, SignOptions } from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';
import type { StringValue } from "ms";

// Read RSA keys
const privateKey = fs.readFileSync(path.join(__dirname, '../../../cert/private.pem'), 'utf8');
const publicKey = fs.readFileSync(path.join(__dirname, '../../../cert/public.pem'), 'utf8');

export interface JwtPayload {
  userId: string;
}

export const signAccessToken = (payload: JwtPayload): string => {
    const expiresIn = (process.env.JWT_ACCESS_EXPIRY || '15m') as StringValue;
  const options: SignOptions = {
    algorithm: 'RS256',
    expiresIn,
  };
  return jwt.sign(payload, privateKey as Secret, options);
};

export const signRefreshToken = (payload: JwtPayload): string => {
  const options: SignOptions = {
    algorithm: 'RS256',
    expiresIn: (process.env.JWT_REFRESH_EXPIRY || '7d') as StringValue,
  };
  return jwt.sign(payload, privateKey as Secret, options);
};

export const verifyToken = (token: string): JwtPayload => {
  try {
    return jwt.verify(token, publicKey as Secret, { algorithms: ['RS256'] }) as JwtPayload;
  } catch (error) {
    throw new Error('Invalid token');
  }
};