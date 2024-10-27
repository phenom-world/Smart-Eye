import { Provider } from '@prisma/client';
import jwt from 'jsonwebtoken';
import _ from 'lodash';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { v4 } from 'uuid';
import { ErrorMessageOptions, generateErrorMessage } from 'zod-error';

import { cookieOptions } from '@/constants';
import prisma from '@/prisma';
import { ObjectData, UserResponse, ValidateParseResponse } from '@/types';

import { NextFunction } from '../middlewares/handler';
export const JWT_SECRET = process.env.JWT_SECRET || 'secret key';
export const JWT_EXPIRY = process.env.JWT_EXPIRY || '';
export const REFRESH_SECRET = process.env.REFRESH_SECRET || 'refresh key';
export const REFRESH_EXPIRY = process.env.REFRESH_EXPIRY || '';

export type CustomRequest = NextRequest & { user: UserResponse };
export type ParamProps = {
  params: {
    [key: string]: string;
  };
};

export const ErrorResponse = (message: string | object, status?: number, data?: object) => {
  return NextResponse.json({ message, ...data }, { status: status || 400 });
};
export const ApiResponse = (data: object | null, message?: string, status?: number) => {
  return NextResponse.json({ data, success: true, message }, { status: status || 200 });
};

export const StreamResponse = (stream: ReadableStream, headers: ObjectData) => {
  return new Response(stream, {
    headers,
  });
};

// verify token
export const verifyToken = async (token: string, secret: string): Promise<UserResponse> => {
  const data = jwt.verify(token, secret) as UserResponse;
  if (!data) return {} as UserResponse;
  const user = await prisma.user.findUnique({
    where: { uuid: data.uuid },
    include: { profilePhoto: true, UserProvider: { where: { providerId: data.providerId }, select: { provider: true, providerId: true }, take: 1 } },
  });

  if (!user) return {} as UserResponse;
  return {
    ...user,
    providerId: user?.UserProvider[0].providerId as string,
    provider: user?.UserProvider[0].provider as Provider,
  };
};

export const getQuery = (req: NextRequest): ObjectData => {
  const searchParams = req.nextUrl.searchParams;
  const query: ObjectData = {};
  for (const [key, value] of searchParams.entries()) {
    query[key] = value;
  }
  return query;
};

const options: ErrorMessageOptions = {
  delimiter: {
    error: ', ',
    component: ': ',
  },
  path: {
    enabled: true,
    type: 'objectNotation',
    transform: ({ value }) => value,
  },
  code: {
    enabled: false,
  },
  message: {
    enabled: true,
    transform: ({ value }) => value.toLowerCase(),
  },
};

export const validate = (response: ValidateParseResponse, next: NextFunction): NextResponse | void => {
  if (!response.success) {
    const { errors } = response.error;
    const errorMessage = generateErrorMessage(errors, options); // You need to define 'options' or remove it if unnecessary
    return ErrorResponse(errorMessage, 400);
  }
  next();
};

export const authenticateUser = (id: number, uuid: string) => {
  const token = jwt.sign({ id, uuid }, JWT_SECRET, {
    expiresIn: parseInt(JWT_EXPIRY),
  });
  return token;
};

export const authenticateUserWithProvider = (user: Partial<UserResponse>) => {
  if (!user) return;
  const token = jwt.sign({ id: user.id, uuid: user.uuid, providerId: user.providerId }, JWT_SECRET, {
    expiresIn: parseInt(JWT_EXPIRY),
  });
  const refreshToken = jwt.sign({ id: user.id, uuid: user.uuid, providerId: user.providerId }, REFRESH_SECRET, {
    expiresIn: parseInt(REFRESH_EXPIRY),
  });
  cookies().set('auth', token, { ...cookieOptions, maxAge: parseInt(JWT_EXPIRY) });
  cookies().set('refresh', refreshToken, { ...cookieOptions, maxAge: parseInt(REFRESH_EXPIRY) });
  return { token, refreshToken };
};

export const generateAuthToken = (user: Partial<UserResponse>) => {
  if (!user) return;
  const token = jwt.sign({ id: user.id, uuid: user.uuid, providerId: user.providerId }, JWT_SECRET, {
    expiresIn: parseInt(JWT_EXPIRY),
  });
  cookies().set('auth', token, { ...cookieOptions, maxAge: parseInt(JWT_EXPIRY) });
  return token;
};

export const logout = () => {
  cookies().delete('auth');
  cookies().delete('refresh');
};

export const resetTime = (date: Date, time = '00:00') => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}T${time}:00.000Z`;
};

export function Bool(val: string) {
  return val ? !!JSON.parse(String(val).toLowerCase()) : false;
}

export const dateRange = (date: string | Date) => {
  return {
    gte: new Date(new Date(date).setHours(0, 0, 0, 0)),
    lt: new Date(new Date(date).setHours(23, 59, 59, 999)),
  };
};
export const generateUUID = () => {
  const myUUID = v4();
  return myUUID;
};

export const asyncForEach = async <T>(array: T[], callback: (item: T, index: number, array: T[]) => Promise<void>): Promise<void> => {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
};

export function isTrue(value?: string | boolean | number) {
  if (typeof value === 'string') {
    value = value.trim().toLowerCase();
  }
  switch (value) {
    case true:
    case 'true':
    case 1:
    case '1':
    case 'on':
    case 'yes':
      return true;
    default:
      return false;
  }
}
export const isValue = (value?: string) => {
  if (value !== 'undefined' && value !== 'null' && value) {
    return value;
  }
  return undefined;
};

export const pickValues = <T extends Record<string, unknown>>(obj: T): Partial<T> => {
  const pickedObj: Partial<T> = {};
  Object.keys(obj).forEach((key: keyof T) => {
    if (!_.isUndefined(obj[key]) && !_.isNull(obj[key]) && !_.isEqual(obj[key], '')) {
      pickedObj[key] = obj[key];
    }
  });
  return pickedObj;
};

export const dateRangeFilter = (startDate?: string, endDate?: string) => {
  return pickValues({
    gte: isValue(startDate) ? new Date(new Date(startDate as string).setHours(0, 0, 0, 0)) : undefined,
    lte: isValue(endDate) ? new Date(new Date(endDate as string).setHours(23, 59, 59, 999)) : undefined,
  });
};

export const dateFilter = (date?: string) => {
  return pickValues({
    gte: isValue(date) ? new Date(new Date(date as string).setHours(0, 0, 0, 0)) : undefined,
    lt: isValue(date) ? new Date(new Date(date as string).setHours(23, 59, 59, 999)) : undefined,
  });
};

export const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};
