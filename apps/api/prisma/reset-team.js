"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('Resetting team membership for arun@arun.com...');
    const user = await prisma.user.findFirst({ where: { email: 'arun@arun.com' } });
    if (!user) {
        console.log('User not found');
        return;
    }
    const deleted = await prisma.teamMember.deleteMany({
        where: {
            userId: user.id,
            team: { eventId: '1' }
        }
    });
    console.log(`Removed user from ${deleted.count} teams.`);
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
