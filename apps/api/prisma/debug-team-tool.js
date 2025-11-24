"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('Inspecting team "tool"...');
    const team = await prisma.team.findFirst({
        where: { name: 'tool' },
        include: {
            members: {
                include: { user: true }
            },
            event: true
        }
    });
    if (!team) {
        console.log('Team "tool" not found!');
        // List all teams to see what exists
        const allTeams = await prisma.team.findMany();
        console.log('All teams:', allTeams.map(t => `${t.name} (${t.eventId})`));
        return;
    }
    console.log('Team found:');
    console.log(`- ID: ${team.id}`);
    console.log(`- Name: ${team.name}`);
    console.log(`- Event ID: ${team.eventId}`);
    console.log(`- Join Code: ${team.joinCode}`);
    console.log(`- Members: ${team.members.length}`);
    team.members.forEach(m => {
        console.log(`  - ${m.user.email} (User ID: ${m.userId})`);
    });
    console.log('\nChecking Event 1:');
    const event = await prisma.event.findUnique({ where: { id: '1' } });
    console.log(event ? 'Event 1 exists' : 'Event 1 NOT found');
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
