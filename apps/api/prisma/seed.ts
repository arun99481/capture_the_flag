import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Seeding database...');

    // Create Event 1 (TartanHacks CTF)
    const event1 = await prisma.event.upsert({
        where: { id: '1' },
        update: {
            name: 'TartanHacks CTF',
            description: 'A 24-hour beginner friendly CTF event designed for students new to cybersecurity.',
            registrationStartTime: new Date('2025-01-01T00:00:00Z'),
            registrationEndTime: new Date('2025-02-15T00:00:00Z'),
            eventStartTime: new Date('2025-02-15T10:00:00Z'),
            eventEndTime: new Date('2025-02-16T10:00:00Z'),
            maxTeams: 50,
            minTeamSize: 1,
            maxTeamSize: 4,
            totalLevels: 10,
        },
        create: {
            id: '1',
            name: 'TartanHacks CTF',
            description: 'A 24-hour beginner friendly CTF event designed for students new to cybersecurity.',
            registrationStartTime: new Date('2025-01-01T00:00:00Z'),
            registrationEndTime: new Date('2025-02-15T00:00:00Z'),
            eventStartTime: new Date('2025-02-15T10:00:00Z'),
            eventEndTime: new Date('2025-02-16T10:00:00Z'),
            maxTeams: 50,
            minTeamSize: 1,
            maxTeamSize: 4,
            totalLevels: 10,
        },
    });

    console.log({ event1 });
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
