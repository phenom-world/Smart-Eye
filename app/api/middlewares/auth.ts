/* eslint-disable @typescript-eslint/no-explicit-any */
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

import prisma from '@/prisma';

import { CustomRequest, ErrorResponse, getQuery, ParamProps } from '../lib';
import { NextFunction } from './handler';

// allows mutation of a resource if the resource has the same providerId as the loggeduser's providerId
export const authorizeMutateProvider = (schema: keyof PrismaClient, parent?: keyof PrismaClient) => {
  return async (req: CustomRequest, { params }: ParamProps, next: NextFunction) => {
    const { id } = await req.clone().json();
    const reqId = id ?? params?.id;
    if (reqId) {
      let response;
      if (parent) {
        response = await (prisma[schema] as any).findUnique({ where: { cuid: reqId, [parent]: { providerId: req.user.providerId } } });
      } else {
        response = await (prisma[schema] as any).findUnique({ where: { cuid: reqId, providerId: req.user.providerId } });
      }
      if (!response) return ErrorResponse('Forbidden: Access denied', 401);
    }
    next();
  };
};

// allows read access to a resource if the resource has the same providerId as the loggeduser's providerId
export const authorizeGetProvider = (schema: keyof PrismaClient, parent?: keyof PrismaClient) => {
  return async (req: CustomRequest, { params }: ParamProps, next: NextFunction) => {
    const queryId = getQuery(req)?.id ?? params?.id;
    if (queryId) {
      let response;
      if (parent) {
        response = await (prisma[schema] as any).findUnique({ where: { cuid: queryId, [parent]: { providerId: req.user.providerId } } });
      } else {
        response = await (prisma[schema] as any).findUnique({ where: { cuid: queryId, providerId: req.user.providerId } });
      }
      if (!response) return ErrorResponse('Forbidden: Access denied', 401);
    }
    next();
  };
};

export const authorizeRoles = (...roles: string[]) => {
  return async (req: CustomRequest, _res: NextResponse, next: NextFunction) => {
    if (!roles.includes(req.user.role as string)) return ErrorResponse('Forbidden: Access denied', 401);
    next();
  };
};
