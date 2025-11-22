
import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    const email = 'admin@example.com';
    const password = 'adminpassword';
    const name = 'Admin User';

    console.log(`Creating admin user: ${email}`);

    // Hash password (simulating what AuthService does, though AuthService stores it in memory currently... wait)
    // Ah, AuthService uses `storePassword` which is in-memory map.
    // BUT, for the `login` to work, it needs to find the user in DB AND verify password.
    // Since I can't easily inject into the running service's memory map from here, 
    // I should probably update AuthService to use a real DB table for passwords or just mock it for now.
    // OR, I can just create the user in DB and then use the Signup flow via API to create the user + password.
    // But Signup creates a STUDENT by default.
    // So:
    // 1. Signup via API (creates user + in-memory password)
    // 2. Update user role to ADMIN in DB manually.

    // Let's do that. I'll use axios or fetch to call the signup endpoint? 
    // No, I can just use the script to update the role AFTER I manually signup in the UI?
    // Or I can simulate the signup here if I can access the service? No.

    // Better approach:
    // Just create the user in DB with ADMIN role.
    // AND since the password check is in-memory in `AuthService`, I can't "seed" it from here easily unless I restart the server 
    // and the server has some seeding logic.
    // BUT, `AuthService` is ephemeral. If I restart the server, passwords are lost.
    // This is a flaw in the current `AuthService` implementation I saw earlier.
    // "Storing in memory for demo (NOT PRODUCTION READY)"

    // To make this work for the user now, I should probably fix `AuthService` to store passwords in DB, 
    // OR I just tell the user to Sign Up as a normal user, and then I run a script to promote them to ADMIN.

    // Let's go with: Promote existing user to ADMIN.
    // I'll ask the user to sign up, or I'll pick an existing user.

    const targetEmail = 'arunraja@andrew.cmu.edu';
    const user = await prisma.user.findUnique({ where: { email: targetEmail } });
    if (user) {
        console.log(`Promoting user ${user.email} to ADMIN...`);
        await prisma.user.update({
            where: { id: user.id },
            data: { role: Role.ADMIN },
        });
        console.log('User promoted.');
    } else {
        console.log(`User ${targetEmail} not found. Please sign up first.`);
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
