import { Prisma, Provider } from '@prisma/client';

export type UserResponse = Prisma.UserGetPayload<{
  omit: {
    password: true;
  };
  include: {
    profilePhoto: true;
    UserProvider: {
      select: {
        provider: true;
        providerId: true;
      };
    };
  };
}> &
  Partial<{
    providers: ProviderResponse[];
    accessToken: string;
    refreshToken: string;
    provider: ProviderResponse;
    providerId: string;
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
