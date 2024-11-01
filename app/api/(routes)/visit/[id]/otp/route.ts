import prisma from '@/prisma';

import { ApiResponse, asyncWrapper, CustomRequest, ErrorResponse, generateOtp, sendEmail } from '../../../../lib';
import { authorizeMutateProvider, authorizeRoles, authorizeUser, handler } from '../../../../middlewares';

const sendOtp = asyncWrapper(async (req: CustomRequest, { params }: { params: { id: string } }) => {
  const user = req.user;
  const otp = generateOtp();
  await prisma.visit.update({
    where: { cuid: params.id },
    data: {
      otp: otp,
      otpExpiresAt: new Date(Date.now() + 10 * 60 * 1000),
    },
  });
  await sendEmail('otp-checkin', [user?.email], {
    name: `${user?.firstName} ${user?.lastName}`,
    code: otp,
    adminContactInfo: user?.provider?.phone,
  });
  return ApiResponse(null, 'OTP sent successfully');
});

const verifyOtp = asyncWrapper(async (req: CustomRequest, { params }: { params: { id: string } }) => {
  const { otp } = await req.json();
  const visit = await prisma.visit.findUnique({ where: { cuid: params.id } });
  if (!visit) return ErrorResponse('Visit not found');
  if (visit.otp !== otp) return ErrorResponse('Invalid OTP');
  if (visit.otpExpiresAt && visit.otpExpiresAt < new Date()) return ErrorResponse('OTP expired');
  await prisma.visit.update({
    where: { cuid: params.id },
    data: {
      checkinAt: new Date(),
      otp: null,
      otpExpiresAt: null,
      status: 'IN_PROGRESS',
    },
  });
  return ApiResponse(null, 'Caregiver checked in successfully');
});

const POST = handler(authorizeUser, authorizeRoles('caregiver'), authorizeMutateProvider('visit'), sendOtp);
const PUT = handler(authorizeUser, authorizeRoles('caregiver'), authorizeMutateProvider('visit'), verifyOtp);

export { POST, PUT };
