"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("@tartan-ctf/database");
const prisma = new database_1.PrismaClient();
async function seedTestData() {
    console.log('Seeding test data...');
    // Create a test event
    const event = await prisma.event.upsert({
        where: { id: '1' },
        update: {},
        create: {
            id: '1',
            name: 'Test CTF Event',
            description: 'A test event for development',
            registrationStartTime: new Date(),
            registrationEndTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
            eventStartTime: new Date(),
            eventEndTime: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
            maxTeamSize: 4,
            minTeamSize: 1,
            maxTeams: 50,
            totalLevels: 10
        }
    });
    console.log('✓ Created event:', event.name);
    // Create a test team
    const team = await prisma.team.upsert({
        where: { id: 'team-1' },
        update: {},
        create: {
            id: 'team-1',
            name: 'Test Team',
            joinCode: 'TEST123',
            event: {
                connect: { id: '1' }
            },
            leader: {
                connect: { clerkId: 'mock-user-id-123' }
            }
        }
    });
    console.log('✓ Created team:', team.name);
    // Add user to team
    // Note: TeamMember references User by id (UUID), not clerkId
    const user = await prisma.user.findUnique({ where: { clerkId: 'mock-user-id-123' } });
    if (!user)
        throw new Error('User not found');
    const member = await prisma.teamMember.upsert({
        where: {
            userId_teamId: {
                userId: user.id,
                teamId: team.id
            }
        },
        update: {},
        create: {
            userId: user.id,
            teamId: team.id
        }
    });
    console.log('✓ Created team member');
    // Create team progress
    const progress = await prisma.teamProgress.upsert({
        where: { teamId: team.id },
        update: {},
        create: {
            teamId: team.id,
            currentLevel: 1,
            totalPoints: 0
        }
    });
    console.log('✓ Created team progress');
    console.log('\n✅ Test data seeded successfully!');
    console.log(`\nYou can now test at: http://localhost:3000/game/1`);
    await prisma.$disconnect();
}
seedTestData().catch((error) => {
    console.error('Error seeding data:', error);
    process.exit(1);
});
