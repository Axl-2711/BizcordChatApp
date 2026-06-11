import express from 'express';
import cors from 'cors';

const PORT = process.env.PORT || 4000;
const app = express();

app.use(cors({ origin: 'http://localhost:5173' }));
app.get('/', (req, res) => res.send('BizCord server is running'));
app.get('/health', (req, res) => res.json({ ok: true }));

app.listen(PORT, () => console.log(`BizCord server running on http://localhost:${PORT}`));
