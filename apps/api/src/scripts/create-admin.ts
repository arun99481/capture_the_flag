import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function createAdminUser() {
    const email = 'admin@ctf.com';
    const password = 'admin123'; // Change this to your desired password

    // Check if admin already exists
    const existingAdmin = await prisma.user.findUnique({
        where: { email }
    });

    if (existingAdmin) {
        console.log('Admin user already exists!');
        console.log('Email:', email);
        return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create admin user
    const admin = await prisma.user.create({
        data: {
            email,
            password: hashedPassword,
            name: 'Admin User',
            clerkId: 'admin-' + Date.now(), // Unique clerkId for admin
            role: 'ADMIN'
        }
    });

    console.log('✅ Admin user created successfully!');
    console.log('Email:', email);
    console.log('Password:', password);
    console.log('\n⚠️  Please change the password after first login.');
}

createAdminUser()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
