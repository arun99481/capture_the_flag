import axios from 'axios';

const API_URL = 'http://localhost:3001/api';

async function main() {
    const email = `flowtest${Date.now()}@test.com`;
    const password = 'password';
    const name = 'Flow Test User';

    console.log(`1. Signing up as ${email}...`);
    await axios.post(`${API_URL}/auth/signup`, { email, password, name });

    console.log('2. Logging in...');
    const loginRes = await axios.post(`${API_URL}/auth/login`, { email, password });
    const token = loginRes.data.token;
    const userId = loginRes.data.user.id;
    console.log('Logged in as:', userId);

    const axiosAuth = axios.create({
        baseURL: API_URL,
        headers: { Authorization: `Bearer ${token}` }
    });

    const eventId = '1';
    const teamName = `Flow Team ${Date.now()}`;

    console.log('3. Creating Team...');
    const createRes = await axiosAuth.post('/teams', { name: teamName, eventId });
    console.log('Team created:', createRes.data.name, 'ID:', createRes.data.id);
    console.log('Invite Code:', createRes.data.joinCode);

    // Check if members are returned (for UI consistency)
    if (!createRes.data.members) {
        console.log('WARNING: Members not returned in create response');
    }

    console.log('4. Immediately fetching Game Status...');
    try {
        const statusRes = await axiosAuth.get(`/game/${eventId}/status`);
        console.log('Game Status fetched successfully!');
        console.log('Current Level:', statusRes.data.currentLevel);
        console.log('Team ID in status:', statusRes.data.team.id);
    } catch (e: any) {
        console.error('FAILED to fetch game status:', e.response?.data || e.message);
    }
}

main();
