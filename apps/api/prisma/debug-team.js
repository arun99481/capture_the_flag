"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('Checking database state...');
    const eventId = '1';
    const event = await prisma.event.findUnique({ where: { id: eventId } });
    console.log('Event:', event ? 'Found' : 'Not Found');
    const users = await prisma.user.findMany();
    console.log(`Found ${users.length} users`);
    for (const user of users) {
        console.log(`User: ${user.email} (${user.id})`);
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
//# sourceMappingURL=debug-team.js.map