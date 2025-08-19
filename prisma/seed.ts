import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const providerId = process.env.MASTER_USER_PROVIDER_ID;

  if (!providerId) {
    console.warn('MASTER_USER_PROVIDER_ID not set; skipping master user seed.');
    return;
  }

  const username = process.env.MASTER_USERNAME || 'master';
  const nickname = process.env.MASTER_NICKNAME || 'Master User';
  const email = process.env.MASTER_EMAIL || 'mail@mail.com';

  const user = await prisma.user.upsert({
    where: { userProviderId: providerId },
    update: { username, nickname, email },
    create: {
      userProviderId: providerId,
      username,
      nickname,
      email,
    },
  });

  console.log('Master user ensured:', {
    id: user.id,
    userProviderId: user.userProviderId,
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
