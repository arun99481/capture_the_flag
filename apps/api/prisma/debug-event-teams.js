"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    const eventId = '1';
    console.log(`Inspecting Event ${eventId}...`);
    const event = await prisma.event.findUnique({ where: { id: eventId } });
    if (!event) {
        console.error('Event 1 not found!');
        return;
    }
    console.log(`Event: ${event.name} (${event.id})`);
    const teams = await prisma.team.findMany({
        where: { eventId },
        include: {
            members: {
                include: { user: true }
            }
        }
    });
    console.log(`\nFound ${teams.length} teams:`);
    teams.forEach(team => {
        console.log(`\n[Team] ${team.name} (ID: ${team.id})`);
        console.log(`Code: ${team.joinCode}`);
        if (team.members.length === 0) {
            console.log('  No members');
        }
        else {
            team.members.forEach(m => {
                console.log(`  - User: ${m.user.email} (ID: ${m.userId})`);
            });
        }
    });
    console.log('\n--- All Users ---');
    const users = await prisma.user.findMany();
    users.forEach(u => console.log(`${u.email} (${u.id})`));
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
