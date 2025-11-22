
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const teamName = 'ttt';
    const eventId = '1';

    // 1. Update Event to be in the future
    console.log('Updating event end time...');
    await prisma.event.update({
        where: { id: eventId },
        data: {
            eventEndTime: new Date('2026-02-16T10:00:00.000Z'), // Extend by 1 year
        },
    });
    console.log('Event updated.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
