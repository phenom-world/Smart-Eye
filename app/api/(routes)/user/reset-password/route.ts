import prisma from '@/prisma';

import { ApiResponse, asyncWrapper, CustomRequest, hashPassword, sendEmail } from '../../../lib';
import { authorizeRoles, authorizeUser, handler } from '../../../middlewares';

const resetPassword = asyncWrapper(async (req: CustomRequest) => {
  const user = req.user;
  const { password, email, sendMail } = await req.json();
  const hashedPassword = await hashPassword(password);

  const updatedUser = await prisma.user.update({ where: { email }, data: { password: hashedPassword } });

  if (sendMail) {
    await sendEmail('reset-success', [updatedUser?.email], {
      caregiverName: `${updatedUser?.firstName} ${updatedUser?.lastName}`,
      email: updatedUser?.email,
      password,
      appLink: `${process.env.APP_URL}`,
      adminContactInfo: user?.provider?.phone,
    });
  }

  return ApiResponse(updatedUser, 'User password reset successfully');
});

const requestResetPassword = asyncWrapper(async (req: CustomRequest) => {
  const { email } = await req.json();
  const user = await prisma.user.findUnique({ where: { email }, include: { UserProvider: { select: { provider: true } } } });

  await sendEmail('password-reset', [user?.UserProvider[0]?.provider?.email as string], {
    caregiverName: `${user?.firstName} ${user?.lastName}`,
    email,
    appLink: `${process.env.APP_URL}`,
  });
});

const POST = handler(authorizeUser, authorizeRoles('admin'), resetPassword);
const PUT = handler(requestResetPassword);

export { POST, PUT };
