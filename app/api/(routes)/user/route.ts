import prisma from '@/prisma';

import { ApiResponse, asyncWrapper, CustomRequest, generateRandomString, getQuery, hashPassword, sendEmail } from '../../lib';
import { authorizeUser, handler } from '../../middlewares';
import { authorizeMutateProvider, authorizeRoles } from '../../middlewares/auth';
import { updateUserStatus } from './helper';

const fetchUsers = asyncWrapper(async (req: CustomRequest) => {
  const { status, role = 'all' } = getQuery(req);
  const filter = status === 'all' ? {} : status === 'not-invited' ? { status: null } : { status: status?.toUpperCase() };

  const authUser = req.user;
  const users = await prisma.user.findMany({
    where: {
      role,
      ...filter,
      providerId: authUser?.providerId,
    },
  });
  return ApiResponse(users);
});

const createUser = asyncWrapper(async (req: CustomRequest) => {
  const { mediaId, sendMail, ...rest } = await req.json();
  const user = req.user;
  const password = generateRandomString();
  const hashedPassword = await hashPassword(password);

  const createdUser = await prisma.user.create({
    data: {
      ...rest,
      password: hashedPassword,
      profilePhoto: mediaId && { create: { mediaId: mediaId as string } },
      providerId: user?.providerId,
    },
  });

  if (sendMail) {
    await sendEmail('activation', [createdUser.email], {
      name: `${createdUser.firstName} ${createdUser.lastName}`,
      email: createdUser.email,
      password,
      appLink: `${process.env.APPSTORE_URL}`,
      companyName: user?.provider?.name,
      adminContactInfo: user?.provider?.phone,
      role: 'caregiver',
      companyId: req.user.providerId,
    });

    await prisma.user.update({
      where: { cuid: createdUser.cuid },
      data: updateUserStatus('INVITED'),
    });
  }
  return ApiResponse(createdUser, 'User created successfully');
});

const updateUser = asyncWrapper(async (req: CustomRequest) => {
  const data = await req.json();
  const { id, mediaId, sendMail, ...rest } = data;
  const password = generateRandomString();
  const hashedPassword = await hashPassword(password);

  const user = req.user;
  const updatedUser = await prisma.user.update({
    where: { cuid: id },
    data: { ...rest, password: hashedPassword, profilePhoto: mediaId && { create: { mediaId: mediaId as string } } },
  });

  if (sendMail) {
    await sendEmail('activation', [updatedUser.email], {
      name: `${updatedUser.firstName} ${updatedUser.lastName}`,
      companyId: req.user.providerId,
      email: updatedUser.email,
      password,
      appLink: `${process.env.APPSTORE_URL}`,
      companyName: user?.provider?.name,
      adminContactInfo: user?.provider?.phone,
      role: 'caregiver',
    });

    await prisma.user.update({
      where: { cuid: updatedUser.cuid },
      data: updateUserStatus('INVITED'),
    });
  }
  return ApiResponse(updatedUser, 'User updated successfully');
});

const updateStatus = asyncWrapper(async (req: CustomRequest) => {
  const { ids, status } = await req.json();
  await prisma.user.updateMany({
    where: { cuid: { in: ids || [] }, providerId: req.user?.providerId },
    data: updateUserStatus(status?.toUpperCase()),
  });
  return ApiResponse(null, `User(s) ${status === 'active' ? 'activated' : status} successfully`);
});

const GET = handler(authorizeUser, authorizeRoles('admin'), fetchUsers);
const POST = handler(authorizeUser, authorizeRoles('admin'), createUser);
const PUT = handler(authorizeUser, authorizeRoles('admin'), authorizeMutateProvider('user'), updateUser);
const DELETE = handler(authorizeUser, authorizeRoles('admin'), updateStatus);

export { DELETE, GET, POST, PUT };
