const { v4: uuidv4 } = require('uuid');
import { faker } from '@faker-js/faker';
const bcrypt = require('bcryptjs');

const asyncForEach = async <T>(array: T[], callback: (item: T, index: number, array: T[]) => Promise<void>): Promise<void> => {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
};
import { UserStatus } from '@prisma/client';

import { log, prisma, updateUserStatus } from '..';

export async function seed() {
  const hashedPassword = await bcrypt.hash('password', 10);

  const [provider, provider2] = await prisma.$transaction(
    new Array(2).fill(0).map(() => {
      return prisma.provider.create({
        data: {
          name: faker.company.name(),
          logo: {
            create: {
              src: faker.image.avatar(),
              mediaId: uuidv4(),
              fileType: 'IMG',
            },
          },
          email: faker.internet.email().toLowerCase(),
          phone: faker.phone.number(),
          fax: faker.phone.number(),
          address1: faker.location.streetAddress(),
        },
      });
    })
  );

  // create admin login
  const user = await prisma.user.create({
    data: {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      password: hashedPassword,
      email: faker.internet.email().toLowerCase(),
      role: 'admin',
      ...updateUserStatus(UserStatus.ACTIVE),
      profilePhoto: {
        create: {
          src: faker.image.avatar(),
          mediaId: uuidv4(),
          fileType: 'IMG',
        },
      },
      UserProvider: {
        create: {
          providerId: provider.uuid,
        },
      },
    },
  });

  const userWithMultipleProviders = await prisma.user.create({
    data: {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      password: hashedPassword,
      email: faker.internet.email().toLowerCase(),
      ...updateUserStatus(UserStatus.ACTIVE),
      role: 'admin',
      profilePhoto: {
        create: {
          src: faker.image.avatar(),
          mediaId: uuidv4(),
          fileType: 'IMG',
        },
      },
      UserProvider: { createMany: { data: [{ providerId: provider.uuid }, { providerId: provider2.uuid }] } },
    },
  });

  await asyncForEach(Array(10), async () => {
    await prisma.user.create({
      data: {
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        password: hashedPassword,
        role: 'caregiver',
        phone: faker.number.int().toString(),
        ...updateUserStatus(Object.values(UserStatus)[Math.floor(Math.random() * Object.values(UserStatus).length)] as UserStatus),
        email: faker.internet.email().toLowerCase(),
        profilePhoto: {
          create: {
            src: faker.image.avatar(),
            mediaId: uuidv4(),
            fileType: 'IMG',
          },
        },
        UserProvider: {
          create: {
            providerId: provider.uuid,
          },
        },
      },
    });
    // create caregiver with multiple providers
    await prisma.user.create({
      data: {
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        password: hashedPassword,
        role: 'caregiver',
        phone: faker.number.int().toString(),
        ...updateUserStatus(Object.values(UserStatus)[Math.floor(Math.random() * Object.values(UserStatus).length)] as UserStatus),
        email: faker.internet.email().toLowerCase(),
        profilePhoto: {
          create: {
            src: faker.image.avatar(),
            mediaId: uuidv4(),
            fileType: 'IMG',
          },
        },
        UserProvider: { createMany: { data: [{ providerId: provider.uuid }, { providerId: provider2.uuid }] } },
      },
    });
    const patient = await prisma.patient.create({
      data: {
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        email: faker.internet.email().toLowerCase(),
        provider: { connect: { id: provider.id } },
        profilePhoto: {
          create: {
            src: faker.image.avatar(),
            mediaId: uuidv4(),
            fileType: 'IMG',
          },
        },
      },
    });
    await prisma.patientAdmission.create({ data: { patientId: patient.uuid, status: 'ACTIVE' } });
  });

  log(`User created: \u001b[1m\u001b[33m${user.email}\u001b[0m`);
  log(`Admin user with multiple providers created: \u001b[1m\u001b[33m${userWithMultipleProviders.email}\u001b[0m`);
}
