import prisma from '@/prisma';

import { ApiResponse, asyncWrapper, CustomRequest } from '../../lib';
import { authorizeRoles, authorizeUser, handler } from '../../middlewares';
import { getProviders } from './helper';

const fetchProviders = asyncWrapper(async () => {
  const providers = await getProviders();
  return ApiResponse(providers);
});

const createProvider = asyncWrapper(async (req: CustomRequest) => {
  const { logoId, ...data } = await req.json();
  const createdProvider = await prisma.provider.create({ data: { ...data, logo: logoId && { create: { mediaId: logoId } } } });
  return ApiResponse(createdProvider, 'Provider created successfully');
});

const updateProvider = asyncWrapper(async (req: CustomRequest) => {
  const { logoId, ...data } = await req.json();

  const updatedUser = await prisma.provider.update({
    where: { id: req.user.providerId },
    data: { ...data, logo: logoId && { create: { mediaId: logoId } } },
  });
  return ApiResponse(updatedUser, 'Provider updated successfully');
});

const deleteProviders = asyncWrapper(async (req: CustomRequest) => {
  const { providers, status: currentStatus } = await req.json();
  await prisma.provider.updateMany({
    where: { id: { in: providers || [] } },
    data: { active: currentStatus === 'active' ? false : true, archivedAt: currentStatus === 'active' ? new Date() : null },
  });
  return ApiResponse(null, `provider(s) ${currentStatus === 'active' ? 'archived' : 'activated'} successfully`);
});

const GET = handler(authorizeUser, authorizeRoles('admin'), fetchProviders);
const POST = handler(authorizeUser, authorizeRoles('admin'), createProvider);
const PUT = handler(authorizeUser, authorizeRoles('admin'), updateProvider);
const DELETE = handler(authorizeUser, authorizeRoles('admin'), deleteProviders);

export { DELETE, GET, POST, PUT };
