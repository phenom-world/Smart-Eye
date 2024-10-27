import { isEmpty } from 'lodash';
import { NextResponse } from 'next/server';

import { UserResponse } from '@/types';

import { CustomRequest, ErrorResponse, generateAuthToken, logout, verifyToken } from '../lib';
import { NextFunction } from './handler';
export const JWT_SECRET = process.env.JWT_SECRET || '';
export const REFRESH_SECRET = process.env.REFRESH_SECRET || '';

export const authorizeUser = async (req: CustomRequest, _res: object, next: NextFunction): Promise<NextResponse | void> => {
  let token = '';
  let decoded = {} as UserResponse;
  const authorization = req.headers.get('authorization') || req.headers.get('x-access-token');
  const cookie = req.cookies.get('auth')?.value;
  const refreshToken = req.cookies.get('refresh')?.value;
  if (!authorization && !cookie && !refreshToken) {
    return ErrorResponse('current session has expired', 403);
  }
  if (authorization && authorization.startsWith('Bearer')) token = authorization.split(' ')[1];
  if (cookie) token = cookie;

  try {
    decoded = await verifyToken(token, JWT_SECRET);

    // if no jwt error and refresh token is present but decoded is empty, generate new token
    if (!isEmpty(decoded) && refreshToken) {
      try {
        const user = await verifyToken(refreshToken, REFRESH_SECRET);
        if (!isEmpty(user)) {
          const token = generateAuthToken(user);
          decoded.accessToken = token;
        }
      } catch (error) {
        logout();
        if (error?.name === 'TokenExpiredError') {
          return ErrorResponse('Token has expired, please login again', 403);
        }
        return ErrorResponse('Invalid Token', 403);
      }
    }
  } catch (error) {
    // if there is an error and refresh token is present, generate new token
    if (refreshToken) {
      try {
        const user = await verifyToken(refreshToken, REFRESH_SECRET);
        if (!isEmpty(user)) {
          const token = generateAuthToken(user);
          decoded.accessToken = token;
        }
      } catch (error) {
        logout();
        if (error?.name === 'TokenExpiredError') {
          return ErrorResponse('Token has expired, please login again', 403);
        }
        return ErrorResponse('Invalid Token', 403);
      }
    } else {
      logout();
      if (error?.name === 'TokenExpiredError') {
        return ErrorResponse('Token has expired, please login again', 403);
      }
      return ErrorResponse('Invalid Token', 403);
    }
  }
  req.user = decoded;
  if (isEmpty(req.user)) {
    logout();
    return ErrorResponse('Not authorized to access this route', 403);
  }
  next();
};
