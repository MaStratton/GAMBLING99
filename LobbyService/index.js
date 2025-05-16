const express = require('express');
const bodyParser = require('body-parser');
const redis = require('redis');

const app = express();
const PORT = 8080;

app.use(bodyParser.json());

const client = redis.createClient({
    url: 'redis://redis:6379'
});

client.connect().catch(console.error);

// ABSOLUTE CINEMA!!!
function auth(req, res, next) {
    if (!req.headers.authorization) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    next();
}

function adminAuth(req, res, next) {
    if (req.headers.authorization !== 'admin') {
        return res.status(403).json({ error: 'Admin only' });
    }
    next();
}

// GET /lobby/leaderboard
app.get('/lobby/leaderboard', async (req, res) => {
    try {
        const keys = await client.keys('lobby:user:*');
        const users = [];

        for (const key of keys) {
            const data = JSON.parse(await client.get(key));
            users.push({ user_id: data.user_id, balance: data.balance });
        }

        users.sort((a, b) => b.balance - a.balance);
        const leaderboard = users.map((u, i) => ({ position: i + 1, ...u }));

        res.json(leaderboard);
    } catch (err) {
        res.status(500).json({ error: 'Failed to load leaderboard' });
    }
});

// POST /lobby/join
app.post('/lobby/join', auth, async (req, res) => {
    const { user_id } = req.body;
    if (!user_id) return res.json({ error: 'Missing user_id' });

    const key = `lobby:user:${user_id}`;
    const exists = await client.exists(key);
    if (exists) return res.json({ error: 'Already joined' });

    await client.set(key, JSON.stringify({ user_id, balance: 0 }));
    res.json({ message: 'joined' });
});

// POST /lobby/leave
app.post('/lobby/leave', auth, async (req, res) => {
    const { user_id } = req.body;
    if (!user_id) return res.json({ error: 'Missing user_id' });

    const key = `lobby:user:${user_id}`;
    const deleted = await client.del(key);
    if (!deleted) return res.json({ error: 'Not found' });

    res.json({ message: 'left' });
});

// POST /lobby/create
app.post('/lobby/create', adminAuth, async (req, res) => {
    const { name, host } = req.body;
    if (!name || !host) return res.json({ error: 'Missing name or host' });

    const id = Date.now();
    const key = `lobby:${id}`;
    await client.set(key, JSON.stringify({ id, name, host }));
    res.json({ lobby_id: id });
});

// DELETE /lobby/:id
app.delete('/lobby/:id', adminAuth, async (req, res) => {
    const key = `lobby:${req.params.id}`;
    const deleted = await client.del(key);
    if (!deleted) return res.json({ error: 'Lobby not found' });

    res.json({ message: 'success' });
});

// PATCH /lobby/:user_id
app.patch('/lobby/:user_id', auth, async (req, res) => {
    const { user_id } = req.params;
    const { new_balance } = req.body;
    if (typeof new_balance !== 'number') return res.json({ error: 'Invalid balance' });

    const key = `lobby:user:${user_id}`;
    const data = await client.get(key);
    if (!data) return res.json({ error: 'User not found' });

    const user = JSON.parse(data);
    user.balance = new_balance;
    await client.set(key, JSON.stringify(user));

    res.json({ balance: new_balance });
});

app.get('/lobby/home', (req, res) => {
  res.sendFile(__dirname + "/House.png");
})

app.listen(PORT, () => {
    console.log(`lobby_service running on http://lobby_service:${PORT}`);
});
