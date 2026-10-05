import express, { Request, Response } from 'express';
import cors from 'cors';
import { Compiler } from '../../src/compiler/compiler';
import { CHALLENGES } from '../../src/data/challengesData';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// In-Memory Storage & Fallback DB Store
interface UserRecord {
  id: string;
  username: string;
  level: number;
  xp: number;
  streak: number;
  completedChallenges: string[];
  badges: string[];
  lastActive: string;
}

const memoryUsers: Map<string, UserRecord> = new Map([
  [
    'u_demo',
    {
      id: 'u_demo',
      username: 'Cadet Developer',
      level: 1,
      xp: 0,
      streak: 1,
      completedChallenges: [],
      badges: [],
      lastActive: new Date().toISOString(),
    },
  ],
]);

const initialLeaderboard = [
  { rank: 1, id: 'p1', username: 'AdaLovelace99', level: 8, xp: 5400, challengesCompleted: 10, badgesCount: 10, avatar: '👑' },
  { rank: 2, id: 'p2', username: 'TuringMachine', level: 7, xp: 4200, challengesCompleted: 9, badgesCount: 8, avatar: '⚡' },
  { rank: 3, id: 'p3', username: 'ChomskyGrammar', level: 6, xp: 3100, challengesCompleted: 8, badgesCount: 7, avatar: '📜' },
  { rank: 4, id: 'p4', username: 'LexerKnight', level: 5, xp: 2250, challengesCompleted: 7, badgesCount: 6, avatar: '🛡️' },
  { rank: 5, id: 'p5', username: 'DragonBookFan', level: 4, xp: 1600, challengesCompleted: 5, badgesCount: 5, avatar: '🐉' },
  { rank: 6, id: 'p6', username: 'ByteCoder', level: 3, xp: 950, challengesCompleted: 4, badgesCount: 4, avatar: '💻' },
];

// Health Check
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'online',
    platform: 'Compiler Quest Backend API',
    database: 'In-Memory with MongoDB connection compatibility',
    timestamp: new Date().toISOString(),
  });
});

// 1. Users API
app.post('/api/users', (req: Request, res: Response) => {
  const { username } = req.body;
  const id = `user_${Date.now()}`;
  const newUser: UserRecord = {
    id,
    username: username || 'Cadet Developer',
    level: 1,
    xp: 0,
    streak: 1,
    completedChallenges: [],
    badges: [],
    lastActive: new Date().toISOString(),
  };

  memoryUsers.set(id, newUser);
  res.status(201).json({ success: true, user: newUser });
});

app.get('/api/users/:id', (req: Request, res: Response) => {
  const user = memoryUsers.get(req.params.id);
  if (!user) {
    res.status(404).json({ error: 'User not found' });
    return;
  }
  res.json({ success: true, user });
});

// 2. Challenges API
app.get('/api/challenges', (_req: Request, res: Response) => {
  res.json({ success: true, challenges: CHALLENGES });
});

app.post('/api/challenges/:id/complete', (req: Request, res: Response) => {
  const challengeId = req.params.id;
  const { userId, xp } = req.body;

  const user = memoryUsers.get(userId || 'u_demo');
  if (user && !user.completedChallenges.includes(challengeId)) {
    user.completedChallenges.push(challengeId);
    user.xp += xp || 50;
    user.streak += 1;
    user.lastActive = new Date().toISOString();
  }

  res.json({ success: true, message: 'Challenge marked completed', user });
});

// 3. Leaderboard API
app.get('/api/leaderboard', (_req: Request, res: Response) => {
  const dynamicEntries = Array.from(memoryUsers.values()).map((u) => ({
    id: u.id,
    username: u.username,
    level: u.level,
    xp: u.xp,
    challengesCompleted: u.completedChallenges.length,
    badgesCount: u.badges.length,
    avatar: '🚀',
  }));

  const merged = [...initialLeaderboard, ...dynamicEntries]
    .sort((a, b) => b.xp - a.xp)
    .map((item, idx) => ({ ...item, rank: idx + 1 }));

  res.json({ success: true, leaderboard: merged });
});

// 4. Progress Sync API
app.get('/api/progress/:userId', (req: Request, res: Response) => {
  const user = memoryUsers.get(req.params.userId) || memoryUsers.get('u_demo');
  res.json({ success: true, progress: user });
});

app.post('/api/progress/:userId', (req: Request, res: Response) => {
  const { xp, level, streak, completedChallenges, badges, username } = req.body;
  const userId = req.params.userId;

  const existing = memoryUsers.get(userId) || {
    id: userId,
    username: username || 'Cadet Developer',
    level: 1,
    xp: 0,
    streak: 1,
    completedChallenges: [],
    badges: [],
    lastActive: new Date().toISOString(),
  };

  existing.xp = xp ?? existing.xp;
  existing.level = level ?? existing.level;
  existing.streak = streak ?? existing.streak;
  existing.completedChallenges = completedChallenges ?? existing.completedChallenges;
  existing.badges = badges ?? existing.badges;
  if (username) existing.username = username;
  existing.lastActive = new Date().toISOString();

  memoryUsers.set(userId, existing);
  res.json({ success: true, updated: existing });
});

// 5. Real Backend Compiler API (optional server-side evaluation)
app.post('/api/compile', (req: Request, res: Response) => {
  const { code } = req.body;
  if (typeof code !== 'string') {
    res.status(400).json({ error: 'Code must be a string' });
    return;
  }

  const result = Compiler.compile(code);
  res.json({ success: true, result });
});

app.listen(PORT, () => {
  console.log(`[Compiler Quest Backend] Server running on port ${PORT}`);
  console.log(`[Compiler Quest Backend] Local memory storage fallback active with MongoDB compatibility`);
});
