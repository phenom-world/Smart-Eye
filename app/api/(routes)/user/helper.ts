import { UserStatus } from '@prisma/client';

export const updateUserStatus = (status: UserStatus) => {
  let obj = {};
  switch (status) {
    case 'ACTIVE':
      obj = { activeAt: new Date() };
      break;
    case 'INVITED':
      obj = { invitedAt: new Date() };
      break;
    case 'ARCHIVED':
      obj = { archivedAt: new Date() };
      break;
  }
  return { ...obj, status };
};
