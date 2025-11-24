"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    const teamName = 'ttt';
    console.log(`Searching for team: ${teamName}`);
    const team = await prisma.team.findFirst({
        where: { name: teamName },
        include: { progress: true },
    });
    if (!team) {
        console.log('Team not found');
    }
    else {
        console.log('Team found:', JSON.stringify(team, null, 2));
        if (!team.progress) {
            console.log('WARNING: Team has no progress record!');
        }
        else {
            const event = await prisma.event.findUnique({ where: { id: team.eventId } });
            console.log('Event found:', JSON.stringify(event, null, 2));
            if (event) {
                const now = new Date();
                const totalDuration = event.eventEndTime.getTime() - event.eventStartTime.getTime();
                const timeRemaining = event.eventEndTime.getTime() - now.getTime();
                console.log('Now:', now.toISOString());
                console.log('Total Duration (ms):', totalDuration);
                console.log('Time Remaining (ms):', timeRemaining);
                console.log('Time Factor:', Math.max(0, timeRemaining / totalDuration));
            }
        }
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
