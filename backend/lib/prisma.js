// Fix import issues in API files by updating the Prisma client export
import { PrismaClient } from '@prisma/client';

// Prevent multiple instances of Prisma Client in development
let prisma;

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient();
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient();
  }
  prisma = global.prisma;
}

// Export both as default and named export to support both import styles
export default prisma;
export { prisma };
