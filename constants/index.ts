export * from './caregiver';
export * from './patient';
export * from './user';
export * from './visit';

import { QueryType } from '@/types';

export const ALLOWED_CONTENT_TYPES = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf', 'application/zip'];
export const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
export const ALLOWED_FILE_TYPES = ['application/pdf', 'application/zip', ...ACCEPTED_IMAGE_TYPES];
export const MAX_IMAGE_SIZE = 5000000;
export const MAX_FILE_SIZE = 25 * 1024 * 1024 * 1024;

export const cookieOptions = {
  httpOnly: true,
  path: '/',
  sameSite: 'strict' as true | false | 'lax' | 'strict' | 'none' | undefined,
  secure: process.env.NODE_ENV === 'production',
};

export const initialQuery: QueryType = {
  pageIndex: 0,
  pageSize: 10,
  // search: '',
};

export const themes = [
  { color: '#2051E5', theme: 'light' },
  { color: '#058A0A', theme: 'green' },
  { color: '#9E2DD7', theme: 'purple' },
  { color: '#FF9500', theme: 'orange' },
  { color: '#FF0535', theme: 'red' },
];
