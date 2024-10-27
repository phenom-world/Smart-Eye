import { PrismaClient } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';

let prisma: PrismaClient<{ omit: { user: { password: true } } }, never, DefaultArgs>;

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient({
    omit: {
      user: {
        password: true,
      },
    },
  });
} else {
  const globalWithPrisma = global as typeof globalThis & {
    prisma: typeof prisma;
  };
  if (!globalWithPrisma.prisma) {
    globalWithPrisma.prisma = new PrismaClient({
      omit: {
        user: {
          password: true,
        },
      },
    });
  }
  prisma = globalWithPrisma.prisma;
}

export default prisma;
