import { PrismaClient, UserStatus } from '@prisma/client';

import { seed } from './helper.ts';
export const prisma = new PrismaClient();

const isTest = process.env.NODE_ENV === 'test';
export const log = (text: string) => (!isTest ? console.log(text) : null);
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

async function deleteAll() {
  await prisma.user.deleteMany();
  await prisma.patient.deleteMany();
  await prisma.provider.deleteMany();
}

async function main() {
  console.log('Seeding started');

  await deleteAll();

  for (let i = 0; i < 2; i++) {
    await seed();
  }

  console.log('Seeding completed');

  process.exit();
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
