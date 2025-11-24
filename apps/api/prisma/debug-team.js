"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('Checking database state...');
    const eventId = '1';
    // Check if event exists
    const event = await prisma.event.findUnique({ where: { id: eventId } });
    console.log('Event:', event ? 'Found' : 'Not Found');
    // List all users
    const users = await prisma.user.findMany();
    console.log(`Found ${users.length} users`);
    for (const user of users) {
        console.log(`User: ${user.email} (${user.id})`);
        // Check if user is in a team for this event
        const member = await prisma.teamMember.findFirst({
            where: {
                userId: user.id,
                team: { eventId },
            },
            include: { team: true },
        });
        if (member) {
            console.log(`  - Already in team: ${member.team.name} (Code: ${member.team.joinCode})`);
        }
        else {
            console.log(`  - Not in any team for event ${eventId}`);
        }
    }
    // List all teams for this event
    const teams = await prisma.team.findMany({ where: { eventId } });
    console.log(`Found ${teams.length} teams for event ${eventId}:`);
    teams.forEach(t => console.log(`  - ${t.name} (${t.joinCode})`));
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
