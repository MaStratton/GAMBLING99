const express = require('express');
const bodyParser = require('body-parser');
const redis = require('redis');
const jwt = require('jsonwebtoken')
const cors = require('cors');

const app = express();
const PORT = 8080;

app.use(bodyParser.json());

app.use(cors({}));

const client = redis.createClient({
    url: 'redis://redis:6379'
});

client.connect().catch(console.error);

// ABSOLUTE CINEMA!!!
function auth(req, res, next) {
    if (!req.headers.authorization) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
        var token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_KEY);
        req.userId = decoded.userId;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Invalid token' });

    }
}

function admin_auth(req, res, next) {
    if (!req.headers.authorization) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_KEY);
        console.log("Role: " + decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"])
        req.userId = decoded.userId;
        if (decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] === "ADMIN") {
            next();
        } else {
            res.status(401).json({ error: 'Admin only' });
        }
    } catch (error) {
        res.status(401).json({ error: 'Invalid token' });
    }
}

// Redis-backed functions
async function addUserToLobby(userId, lobbyId, money) {
    await client.sAdd(`lobby:${lobbyId}:users`, userId);
    await client.hSet(`lobby:${lobbyId}:user_money`, userId, money);
    await client.set(`user:${userId}:lobby`, lobbyId);
}

async function getUsersWithMoneyInLobby(lobbyId) {
    const userIds = await client.sMembers(`lobby:${lobbyId}:users`);
    const moneyMap = await client.hGetAll(`lobby:${lobbyId}:user_money`);
    return userIds.map(userId => ({ user_id: userId, money: parseFloat(moneyMap[userId] || 0) }));
}

async function getUserMoney(userId) {
    const lobbyId = await client.get(`user:${userId}:lobby`);
    if (!lobbyId) return null;
    const money = await client.hGet(`lobby:${lobbyId}:user_money`, userId);
    return { lobby_id: lobbyId, money: parseFloat(money || 0) };
}

async function getUserLobby(userId) {
    return await client.get(`user:${userId}:lobby`);
}

async function getAllLobbies() {
    return await client.sMembers("lobbies");
}

// ROUTES

// GET /lobby
app.get('/lobby', async (req, res) => {
    res.json({ lobbies: await getAllLobbies() });
});

// GET /lobby/:lobby_id/leaderboard
app.get('/lobby/:lobby_id/leaderboard', async (req, res) => {
    const { lobby_id } = req.params;
    try {
        const users = await getUsersWithMoneyInLobby(lobby_id);
        users.sort((a, b) => b.money - a.money);
        const leaderboard = users.map((u, i) => ({ position: i + 1, ...u }));
        res.json(leaderboard);
    } catch (err) {
        res.status(500).json({ error: 'Failed to load leaderboard' });
    }
});

// POST /lobby/join
app.post('/lobby/join', auth, async (req, res) => {
    const { user_id, lobby_id, initial_money } = req.body;
    if (!user_id || !lobby_id || typeof initial_money !== 'number') {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    const currentLobby = await getUserLobby(user_id);
    if (currentLobby) return res.status(400).json({ error: 'Already in a lobby' });

    await addUserToLobby(user_id, lobby_id, initial_money);
    res.json({ message: 'User added to lobby' });
});

// POST /lobby/leave
app.post('/lobby/leave', auth, async (req, res) => {
    const { user_id } = req.body;
    if (!user_id) return res.status(400).json({ error: 'Missing user_id' });

    const lobbyId = await getUserLobby(user_id);
    if (!lobbyId) return res.status(400).json({ error: 'User not in a lobby' });

    await client.sRem(`lobby:${lobbyId}:users`, user_id);
    await client.hDel(`lobby:${lobbyId}:user_money`, user_id);
    await client.del(`user:${user_id}:lobby`);

    res.json({ message: 'User removed from lobby' });
});

// POST /lobby/create
app.post('/lobby/create', admin_auth, async (req, res) => {
    const { name, host } = req.body;
    if (!name || !host) return res.status(400).json({ error: 'Missing name or host' });

    const id = Date.now().toString();
    const key = `lobby:${id}:meta`;
    await client.set(key, JSON.stringify({ id, name, host }));
    await client.sAdd('lobbies', id);

    res.json({ lobby_id: id });
});

// DELETE /lobby/:id
app.delete('/lobby/:id', admin_auth, async (req, res) => {
    const lobbyId = req.params.id;
    const metaKey = `lobby:${lobbyId}:meta`;
    const usersKey = `lobby:${lobbyId}:users`;
    const moneyKey = `lobby:${lobbyId}:user_money`;

    await client.del(metaKey);
    await client.del(usersKey);
    await client.del(moneyKey);
    await client.sRem("lobbies", lobbyId);

    res.json({ message: 'Lobby deleted' });
});

// PATCH /lobby/:user_id
app.patch('/lobby/:user_id', auth, async (req, res) => {
    const { user_id } = req.params;
    const { new_balance } = req.body;
    if (typeof new_balance !== 'number') return res.status(400).json({ error: 'Invalid balance' });

    const lobbyId = await getUserLobby(user_id);
    if (!lobbyId) return res.status(404).json({ error: 'User not in a lobby' });

    await client.hSet(`lobby:${lobbyId}:user_money`, user_id, new_balance);
    res.json({ message: 'Balance updated', balance: new_balance });
});

// GET /lobby/:user_id/money
app.get('/lobby/:user_id/money', auth, async (req, res) => {
    const { user_id } = req.params;
    const data = await getUserMoney(user_id.toString());
    if (!data) return res.status(404).json({ error: 'User not in a lobby' });
    res.json(data); 
});

app.get('/lobby/home', (req, res) => {
    res.sendFile(__dirname + "/house.png");
});

app.listen(PORT, () => {
    console.log(`lobby_service running on http://lobby_service:${PORT}`);
});
