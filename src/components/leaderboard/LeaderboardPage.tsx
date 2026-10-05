import React from 'react';
import { useGame } from '../../context/GameContext';
import { Trophy, Award, Shield, Flame, Medal, UserCheck } from 'lucide-react';
import { LeaderboardEntry } from '../../types/game';

export const LeaderboardPage: React.FC = () => {
  const { state } = useGame();

  const mockLeaderboard: LeaderboardEntry[] = [
    {
      rank: 1,
      id: 'p1',
      username: 'AdaLovelace99',
      level: 8,
      xp: 5400,
      challengesCompleted: 10,
      badgesCount: 10,
      avatar: '👑',
    },
    {
      rank: 2,
      id: 'p2',
      username: 'TuringMachine',
      level: 7,
      xp: 4200,
      challengesCompleted: 9,
      badgesCount: 8,
      avatar: '⚡',
    },
    {
      rank: 3,
      id: 'p3',
      username: 'ChomskyGrammar',
      level: 6,
      xp: 3100,
      challengesCompleted: 8,
      badgesCount: 7,
      avatar: '📜',
    },
    {
      rank: 4,
      id: 'p4',
      username: 'LexerKnight',
      level: 5,
      xp: 2250,
      challengesCompleted: 7,
      badgesCount: 6,
      avatar: '🛡️',
    },
    {
      rank: 5,
      id: 'p5',
      username: 'DragonBookFan',
      level: 4,
      xp: 1600,
      challengesCompleted: 5,
      badgesCount: 5,
      avatar: '🐉',
    },
    {
      rank: 6,
      id: 'p6',
      username: 'ByteCoder',
      level: 3,
      xp: 950,
      challengesCompleted: 4,
      badgesCount: 4,
      avatar: '💻',
    },
  ];

  // Insert current user based on current XP
  const fullLeaderboard: LeaderboardEntry[] = [
    ...mockLeaderboard,
    {
      rank: 0,
      id: 'current_user',
      username: `${state.username} (You)`,
      level: state.level,
      xp: state.xp,
      challengesCompleted: state.completedChallenges.length,
      badgesCount: state.unlockedBadgeIds.length,
      avatar: '🚀',
    },
  ]
    .sort((a, b) => b.xp - a.xp)
    .map((entry, idx) => ({ ...entry, rank: idx + 1 }));

  return (
    <div className="mx-auto max-w-5xl p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="border-b border-slate-800 pb-4">
        <div className="flex items-center space-x-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
          <Trophy className="h-4 w-4" />
          <span>Global Student Standings</span>
        </div>
        <h1 className="text-2xl font-extrabold text-white mt-1">Compiler Quest Hall of Fame</h1>
        <p className="text-xs text-slate-400">
          Rankings updated dynamically based on earned compiler pipeline and challenge XP
        </p>
      </div>

      {/* Top 3 Podiums */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
        {/* Silver Rank 2 */}
        <div className="order-2 md:order-1 rounded-3xl border border-slate-700 bg-gradient-to-b from-slate-850 to-[#070914] p-5 text-center space-y-2 mt-4 shadow-xl">
          <div className="text-2xl">🥈</div>
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Rank 2</div>
          <div className="text-base font-extrabold text-white">{fullLeaderboard[1]?.username}</div>
          <div className="text-xs text-cyan-400 font-mono font-bold">{fullLeaderboard[1]?.xp} XP</div>
          <div className="text-[11px] text-slate-500">Level {fullLeaderboard[1]?.level}</div>
        </div>

        {/* Gold Rank 1 */}
        <div className="order-1 md:order-2 rounded-3xl border border-amber-500/40 bg-gradient-to-b from-amber-950/30 to-[#070914] p-6 text-center space-y-2 shadow-2xl relative">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full border border-amber-500/50 bg-amber-950 px-3 py-0.5 text-[10px] font-bold text-amber-300">
            Current Champion
          </div>
          <div className="text-3xl mt-1">🥇</div>
          <div className="text-xs font-bold text-amber-400 uppercase tracking-wider">Rank 1</div>
          <div className="text-lg font-black text-white">{fullLeaderboard[0]?.username}</div>
          <div className="text-sm text-amber-400 font-mono font-bold">{fullLeaderboard[0]?.xp} XP</div>
          <div className="text-[11px] text-slate-400">Level {fullLeaderboard[0]?.level} • Master Architect</div>
        </div>

        {/* Bronze Rank 3 */}
        <div className="order-3 md:order-3 rounded-3xl border border-amber-900/60 bg-gradient-to-b from-amber-950/20 to-[#070914] p-5 text-center space-y-2 mt-6 shadow-xl">
          <div className="text-2xl">🥉</div>
          <div className="text-xs font-bold text-amber-600 uppercase tracking-wider">Rank 3</div>
          <div className="text-base font-extrabold text-white">{fullLeaderboard[2]?.username}</div>
          <div className="text-xs text-cyan-400 font-mono font-bold">{fullLeaderboard[2]?.xp} XP</div>
          <div className="text-[11px] text-slate-500">Level {fullLeaderboard[2]?.level}</div>
        </div>
      </div>

      {/* Leaderboard Table */}
      <div className="overflow-hidden rounded-3xl border border-slate-800 bg-[#080c1a] shadow-2xl">
        <table className="w-full text-left text-xs border-collapse">
          <thead className="bg-[#0c1024] text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-800 font-mono">
            <tr>
              <th className="py-3 px-4">Rank</th>
              <th className="py-3 px-4">Player</th>
              <th className="py-3 px-4">Level</th>
              <th className="py-3 px-4">Total XP</th>
              <th className="py-3 px-4">Challenges</th>
              <th className="py-3 px-4">Badges</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-850">
            {fullLeaderboard.map((player) => {
              const isMe = player.id === 'current_user';

              return (
                <tr
                  key={player.id}
                  className={`transition-colors ${
                    isMe
                      ? 'bg-cyan-950/30 border-l-4 border-l-cyan-400 font-semibold text-white'
                      : 'hover:bg-slate-900/60 text-slate-300'
                  }`}
                >
                  <td className="py-3 px-4 font-mono font-bold">
                    {player.rank === 1 ? '🥇' : player.rank === 2 ? '🥈' : player.rank === 3 ? '🥉' : `#${player.rank}`}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2.5">
                      <span className="text-base">{player.avatar}</span>
                      <span className={`font-semibold ${isMe ? 'text-cyan-300' : 'text-slate-200'}`}>
                        {player.username}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="rounded-md border border-purple-500/30 bg-purple-950/40 px-2 py-0.5 text-[10px] font-bold text-purple-300">
                      LVL {player.level}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-amber-400">
                    {player.xp} XP
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-400">
                    {player.challengesCompleted} / 10
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center space-x-1 text-cyan-400 font-mono">
                      <Award className="h-3.5 w-3.5" />
                      <span>{player.badgesCount}</span>
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
