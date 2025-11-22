import axios from 'axios';

async function main() {
    const url = 'http://localhost:3001/api/auth/login';
    const email = 'student@cmu.edu'; // Using the user from the debug output earlier
    const password = 'password'; // I don't know the password, but I can try a guess or create a new user

    console.log(`Attempting login to ${url} with email ${email}...`);

    try {
        const response = await axios.post(url, {
            email,
            password
        });
        console.log('Login successful!');
        console.log('Status:', response.status);
        console.log('Data:', response.data);
    } catch (error: any) {
        console.error('Login failed!');
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', error.response.data);
        } else {
            console.error('Error:', error.message);
        }
    }
}

main();
