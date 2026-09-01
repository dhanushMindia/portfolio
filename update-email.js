const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Updating user email...');

  // Update the old email to the new email
  const result = await prisma.user.updateMany({
    where: {
      email: 'dhanush.mendu@example.com'
    },
    data: {
      email: 'dhanush.mendu@gmail.com'
    }
  });

  console.log(`Updated ${result.count} user record(s)`);

  // Update profile email
  const profileResult = await prisma.profile.updateMany({
    where: {
      email: 'dhanush.mendu@example.com'
    },
    data: {
      email: 'dhanush.mendu@gmail.com'
    }
  });

  console.log(`Updated ${profileResult.count} profile record(s)`);

  await prisma.$disconnect();
}

main().catch(console.error);
