import { Prisma } from '@prisma/client';

interface TokenInfo {
  accessToken?: string;
  refreshToken?: string;
}

export type UserResponse = TokenInfo &
  Prisma.UserGetPayload<{
    omit: { password: true };
    include: { profilePhoto: true; provider: { include: { logo: true } }; providerId: true };
  }>;

export type PatientAdmissionResponse = Prisma.PatientAdmissionGetPayload<{
  include: {
    patient: true;
    dischargedBy: true;
    admittedBy: true;
  };
}>;

export type PatientResponse = Prisma.PatientGetPayload<{
  include: {
    profilePhoto: true;
    PatientAdmission: true;
    Visit: true;
  };
}>;

export type VisitResponse = Prisma.VisitGetPayload<{
  include: {
    patient: true;
    caregiver: true;
  };
}>;

export type ProviderResponse = Prisma.ProviderGetPayload<{
  include: {
    logo: true;
  };
}>;
