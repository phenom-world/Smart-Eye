import { z } from 'zod';
import type { Prisma } from '@prisma/client';

/////////////////////////////////////////
// HELPER FUNCTIONS
/////////////////////////////////////////


/////////////////////////////////////////
// ENUMS
/////////////////////////////////////////

export const TransactionIsolationLevelSchema = z.enum(['ReadUncommitted','ReadCommitted','RepeatableRead','Serializable']);

export const ProviderScalarFieldEnumSchema = z.enum(['uuid','id','name','billing','number','contact1','contact2','address1','address2','state','country','city','zip','tpi','npi','taxId','phone','fax','email','logoId','theme','active','archivedAt','createdAt','updatedAt']);

export const UserScalarFieldEnumSchema = z.enum(['uuid','id','lastName','firstName','middleName','email','status','phone','zip','password','country','state','city','address','role','sssopId','gender','dob','invitedAt','activeAt','archivedAt','createdAt','updatedAt','profilePhotoId']);

export const PatientScalarFieldEnumSchema = z.enum(['uuid','id','firstName','lastName','middleName','email','providerId','gender','dob','race','country','state','city','zip','apartmentNumber','address','medicaidNumber','phone','ssnNumber','active','archivedAt','createdAt','updatedAt','profilePhotoId']);

export const UserProviderScalarFieldEnumSchema = z.enum(['id','userId','providerId','createdAt','updatedAt']);

export const PatientAdmissionScalarFieldEnumSchema = z.enum(['uuid','id','patientId','status','reason','admittedById','dischargedById','createdAt','updatedAt']);

export const MediaScalarFieldEnumSchema = z.enum(['uuid','id','fileType','fileName','mediaId','src','alt','size','updatedAt','createdAt','archivedAt']);

export const VisitScalarFieldEnumSchema = z.enum(['uuid','id','patientId','providerId','caregiverId','checkedinMethod','patientSignatureId','caregiverSignatureId','visitDate','startTime','endTime','checkinAt','checkoutAt','latitude','longitude','otp','otpExpiresAt','status','createdAt','updatedAt']);

export const SortOrderSchema = z.enum(['asc','desc']);

export const QueryModeSchema = z.enum(['default','insensitive']);

export const NullsOrderSchema = z.enum(['first','last']);

export const GenderSchema = z.enum(['MALE','FEMALE']);

export type GenderType = `${z.infer<typeof GenderSchema>}`

export const UserStatusSchema = z.enum(['INVITED','ACTIVE','ARCHIVED']);

export type UserStatusType = `${z.infer<typeof UserStatusSchema>}`

export const VisitStatusSchema = z.enum(['IN_PROGRESS','COMPLETED']);

export type VisitStatusType = `${z.infer<typeof VisitStatusSchema>}`

export const CheckedInMethodSchema = z.enum(['GPS','SIGNATURE','OTP']);

export type CheckedInMethodType = `${z.infer<typeof CheckedInMethodSchema>}`

export const AdmissionStatusSchema = z.enum(['ACTIVE','DISCHARGED']);

export type AdmissionStatusType = `${z.infer<typeof AdmissionStatusSchema>}`

/////////////////////////////////////////
// MODELS
/////////////////////////////////////////

/////////////////////////////////////////
// PROVIDER SCHEMA
/////////////////////////////////////////

export const ProviderSchema = z.object({
  uuid: z.string(),
  id: z.number(),
  name: z.string().nullish(),
  billing: z.string().nullish(),
  number: z.string().nullish(),
  contact1: z.string().nullish(),
  contact2: z.string().nullish(),
  address1: z.string().nullish(),
  address2: z.string().nullish(),
  state: z.string().nullish(),
  country: z.string().nullish(),
  city: z.string().nullish(),
  zip: z.string().nullish(),
  tpi: z.string().nullish(),
  npi: z.string().nullish(),
  taxId: z.string().nullish(),
  phone: z.string().nullish(),
  fax: z.string().nullish(),
  email: z.string().nullish(),
  logoId: z.string().nullish(),
  theme: z.string().nullish(),
  active: z.boolean(),
  archivedAt: z.date().nullish(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export type Provider = z.infer<typeof ProviderSchema>

/////////////////////////////////////////
// USER SCHEMA
/////////////////////////////////////////

export const UserSchema = z.object({
  status: UserStatusSchema.nullish(),
  gender: GenderSchema.nullish(),
  uuid: z.string(),
  id: z.number(),
  lastName: z.string().nullish(),
  firstName: z.string().nullish(),
  middleName: z.string().nullish(),
  email: z.string(),
  phone: z.string().nullish(),
  zip: z.string().nullish(),
  password: z.string().nullish(),
  country: z.string().nullish(),
  state: z.string().nullish(),
  city: z.string().nullish(),
  address: z.string().nullish(),
  role: z.string().nullish(),
  sssopId: z.string().nullish(),
  dob: z.date().nullish(),
  invitedAt: z.date().nullish(),
  activeAt: z.date().nullish(),
  archivedAt: z.date().nullish(),
  createdAt: z.date(),
  updatedAt: z.date(),
  profilePhotoId: z.string().nullish(),
})

export type User = z.infer<typeof UserSchema>

/////////////////////////////////////////
// PATIENT SCHEMA
/////////////////////////////////////////

export const PatientSchema = z.object({
  gender: GenderSchema.nullish(),
  uuid: z.string(),
  id: z.number(),
  firstName: z.string().nullish(),
  lastName: z.string().nullish(),
  middleName: z.string().nullish(),
  email: z.string(),
  providerId: z.string(),
  dob: z.date().nullish(),
  race: z.string().nullish(),
  country: z.string().nullish(),
  state: z.string().nullish(),
  city: z.string().nullish(),
  zip: z.string().nullish(),
  apartmentNumber: z.string().nullish(),
  address: z.string().nullish(),
  medicaidNumber: z.string().nullish(),
  phone: z.string().nullish(),
  ssnNumber: z.string().nullish(),
  active: z.boolean(),
  archivedAt: z.date().nullish(),
  createdAt: z.date(),
  updatedAt: z.date(),
  profilePhotoId: z.string().nullish(),
})

export type Patient = z.infer<typeof PatientSchema>

/////////////////////////////////////////
// USER PROVIDER SCHEMA
/////////////////////////////////////////

export const UserProviderSchema = z.object({
  id: z.string(),
  userId: z.string(),
  providerId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export type UserProvider = z.infer<typeof UserProviderSchema>

/////////////////////////////////////////
// PATIENT ADMISSION SCHEMA
/////////////////////////////////////////

export const PatientAdmissionSchema = z.object({
  status: AdmissionStatusSchema.nullish(),
  uuid: z.string(),
  id: z.number(),
  patientId: z.string().nullish(),
  reason: z.string().nullish(),
  admittedById: z.string().nullish(),
  dischargedById: z.string().nullish(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export type PatientAdmission = z.infer<typeof PatientAdmissionSchema>

/////////////////////////////////////////
// MEDIA SCHEMA
/////////////////////////////////////////

export const MediaSchema = z.object({
  uuid: z.string(),
  id: z.number(),
  fileType: z.string().nullish(),
  fileName: z.string().nullish(),
  mediaId: z.string(),
  src: z.string().nullish(),
  alt: z.string().nullish(),
  size: z.number().nullish(),
  updatedAt: z.date(),
  createdAt: z.date(),
  archivedAt: z.date().nullish(),
})

export type Media = z.infer<typeof MediaSchema>

/////////////////////////////////////////
// VISIT SCHEMA
/////////////////////////////////////////

export const VisitSchema = z.object({
  status: VisitStatusSchema.nullish(),
  uuid: z.string(),
  id: z.number(),
  patientId: z.string().nullish(),
  providerId: z.string(),
  caregiverId: z.string().nullish(),
  checkedinMethod: z.string().nullish(),
  patientSignatureId: z.string().nullish(),
  caregiverSignatureId: z.string().nullish(),
  visitDate: z.date().nullish(),
  startTime: z.date().nullish(),
  endTime: z.date().nullish(),
  checkinAt: z.date().nullish(),
  checkoutAt: z.date().nullish(),
  latitude: z.number().nullish(),
  longitude: z.number().nullish(),
  otp: z.string().nullish(),
  otpExpiresAt: z.date().nullish(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export type Visit = z.infer<typeof VisitSchema>
