
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    const email = 'arunraja@andrew.cmu.edu';
    const newPassword = 'adminpassword';

    console.log(`Resetting password for user: ${email}`);

    const user = await prisma.user.findUnique({ where: { email } });

    if (user) {
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await prisma.user.update({
            where: { id: user.id },
            data: { password: hashedPassword },
        });
        console.log('Password updated successfully.');
    } else {
        console.log(`User ${email} not found.`);
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
