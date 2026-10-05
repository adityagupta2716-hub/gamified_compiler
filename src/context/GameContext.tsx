import React, { createContext, useContext, useState, useEffect } from 'react';
import { Badge, ALL_BADGES, LEVELS, LevelInfo } from '../types/game';

interface GameState {
  username: string;
  xp: number;
  level: number;
  currentStreak: number;
  completedChallenges: string[];
  unlockedBadgeIds: string[];
  compiledCodeHashes: string[];
  pipelineMastery: {
    lexical: boolean;
    syntax: boolean;
    semantic: boolean;
    ir: boolean;
    optimization: boolean;
    codegen: boolean;
  };
  bossHp: number;
  bossDefeated: boolean;
  soundEnabled: boolean;
}

interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'xp' | 'badge';
  title: string;
  message: string;
}

interface GameContextType {
  state: GameState;
  currentLevelInfo: LevelInfo;
  nextLevelInfo: LevelInfo | null;
  xpProgressPercent: number;
  addXp: (amount: number, reason: string) => boolean;
  unlockBadge: (badgeId: string) => void;
  completeChallenge: (challengeId: string, xpReward: number) => void;
  recordCompilation: (code: string, success: boolean, phaseProgress: any) => void;
  damageBoss: (amount: number) => boolean;
  resetProgress: () => void;
  toggleSound: () => void;
  setUsername: (name: string) => void;
  activeLevelUp: { show: boolean; level: number; title: string } | null;
  dismissLevelUp: () => void;
  activeBadgeUnlocked: Badge | null;
  dismissBadgeUnlock: () => void;
  toasts: ToastMessage[];
  removeToast: (id: string) => void;
  playSound: (type: 'compile' | 'success' | 'levelup' | 'error' | 'badge') => void;
}

const STORAGE_KEY = 'compiler_quest_game_state_v1';

const DEFAULT_STATE: GameState = {
  username: 'Cadet Developer',
  xp: 0,
  level: 1,
  currentStreak: 1,
  completedChallenges: [],
  unlockedBadgeIds: [],
  compiledCodeHashes: [],
  pipelineMastery: {
    lexical: false,
    syntax: false,
    semantic: false,
    ir: false,
    optimization: false,
    codegen: false,
  },
  bossHp: 500,
  bossDefeated: false,
  soundEnabled: true,
};

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<GameState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return { ...DEFAULT_STATE, ...JSON.parse(saved) };
      }
    } catch (e) {
      console.error('Failed to load saved game state', e);
    }
    return DEFAULT_STATE;
  });

  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [activeLevelUp, setActiveLevelUp] = useState<{ show: boolean; level: number; title: string } | null>(null);
  const [activeBadgeUnlocked, setActiveBadgeUnlocked] = useState<Badge | null>(null);

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.error('Failed to persist game state', e);
    }
  }, [state]);

  const addToast = (type: 'success' | 'info' | 'xp' | 'badge', title: string, message: string) => {
    const id = `${Date.now()}_${Math.random()}`;
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Synthesized Web Audio Sound Generator (Zero external audio file dependencies)
  const playSound = (type: 'compile' | 'success' | 'levelup' | 'error' | 'badge') => {
    if (!state.soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      const now = ctx.currentTime;
      if (type === 'compile') {
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.15);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
        osc.start(now);
        osc.stop(now + 0.15);
      } else if (type === 'success') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(523.25, now); // C5
        osc.frequency.setValueAtTime(659.25, now + 0.08); // E5
        osc.frequency.setValueAtTime(783.99, now + 0.16); // G5
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
        osc.start(now);
        osc.stop(now + 0.3);
      } else if (type === 'levelup') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.setValueAtTime(554.37, now + 0.1);
        osc.frequency.setValueAtTime(659.25, now + 0.2);
        osc.frequency.setValueAtTime(880, now + 0.3);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.55);
        osc.start(now);
        osc.stop(now + 0.55);
      } else if (type === 'badge') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(587.33, now);
        osc.frequency.setValueAtTime(880, now + 0.12);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
        osc.start(now);
        osc.stop(now + 0.4);
      } else if (type === 'error') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(180, now);
        osc.frequency.linearRampToValueAtTime(120, now + 0.2);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
        osc.start(now);
        osc.stop(now + 0.2);
      }
    } catch {
      // Audio not supported or blocked by browser autoplay policy
    }
  };

  // Determine current & next level info
  const currentLevelIndex = Math.min(
    LEVELS.length - 1,
    LEVELS.findIndex((lvl, i) => {
      const nextLvl = LEVELS[i + 1];
      return !nextLvl || state.xp < nextLvl.minXp;
    })
  );

  const currentLevelInfo = LEVELS[currentLevelIndex >= 0 ? currentLevelIndex : 0];
  const nextLevelInfo = currentLevelIndex < LEVELS.length - 1 ? LEVELS[currentLevelIndex + 1] : null;

  const xpInCurrentLevel = state.xp - currentLevelInfo.minXp;
  const xpNeededForLevel = nextLevelInfo ? nextLevelInfo.minXp - currentLevelInfo.minXp : 1000;
  const xpProgressPercent = nextLevelInfo
    ? Math.min(100, Math.max(0, Math.round((xpInCurrentLevel / xpNeededForLevel) * 100)))
    : 100;

  const addXp = (amount: number, reason: string): boolean => {
    let leveledUp = false;
    let newLevelNum = state.level;

    setState((prev) => {
      const newXp = prev.xp + amount;
      let calculatedLevel = 1;
      for (const lvl of LEVELS) {
        if (newXp >= lvl.minXp) {
          calculatedLevel = lvl.level;
        }
      }

      if (calculatedLevel > prev.level) {
        leveledUp = true;
        newLevelNum = calculatedLevel;
        const newLvlInfo = LEVELS.find((l) => l.level === calculatedLevel) || LEVELS[0];
        setActiveLevelUp({
          show: true,
          level: calculatedLevel,
          title: newLvlInfo.title,
        });
        playSound('levelup');
      }

      return {
        ...prev,
        xp: newXp,
        level: calculatedLevel,
      };
    });

    addToast('xp', `+${amount} XP Earned!`, reason);
    if (!leveledUp) {
      playSound('success');
    }
    return leveledUp;
  };

  const unlockBadge = (badgeId: string) => {
    if (state.unlockedBadgeIds.includes(badgeId)) return;

    const badge = ALL_BADGES.find((b) => b.id === badgeId);
    if (!badge) return;

    setState((prev) => ({
      ...prev,
      unlockedBadgeIds: [...prev.unlockedBadgeIds, badgeId],
    }));

    setActiveBadgeUnlocked(badge);
    addToast('badge', 'Badge Unlocked!', badge.name);
    playSound('badge');
  };

  const completeChallenge = (challengeId: string, xpReward: number) => {
    if (state.completedChallenges.includes(challengeId)) {
      addToast('info', 'Challenge Already Completed', 'You have already collected XP for this challenge.');
      return;
    }

    setState((prev) => ({
      ...prev,
      completedChallenges: [...prev.completedChallenges, challengeId],
      currentStreak: prev.currentStreak + 1,
    }));

    addXp(xpReward, 'Challenge Completed');
  };

  // Anti-farming compilation record
  const recordCompilation = (code: string, success: boolean, phaseProgress: any) => {
    // Generate simple fast hash of normalized code to prevent identical spam farming
    const normalized = code.replace(/\s+/g, ' ').trim();
    let hash = 0;
    for (let i = 0; i < normalized.length; i++) {
      hash = (hash << 5) - hash + normalized.charCodeAt(i);
      hash |= 0;
    }
    const hashStr = String(hash);

    const isFirstTime = !state.compiledCodeHashes.includes(hashStr);

    setState((prev) => {
      const newHashes = isFirstTime ? [...prev.compiledCodeHashes, hashStr] : prev.compiledCodeHashes;
      const updatedMastery = { ...prev.pipelineMastery };

      if (phaseProgress.lexical) updatedMastery.lexical = true;
      if (phaseProgress.syntax) updatedMastery.syntax = true;
      if (phaseProgress.semantic) updatedMastery.semantic = true;
      if (phaseProgress.ir) updatedMastery.ir = true;
      if (phaseProgress.optimization) updatedMastery.optimization = true;
      if (phaseProgress.codegen) updatedMastery.codegen = true;

      return {
        ...prev,
        compiledCodeHashes: newHashes,
        pipelineMastery: updatedMastery,
      };
    });

    // Check badges
    if (phaseProgress.lexical) unlockBadge('token_hunter');
    if (phaseProgress.syntax) unlockBadge('syntax_solver');
    if (phaseProgress.semantic) unlockBadge('semantic_detective');
    if (phaseProgress.ir) unlockBadge('ir_builder');
    if (phaseProgress.optimization) unlockBadge('optimization_expert');
    if (phaseProgress.codegen) unlockBadge('code_generator');
    if (success) unlockBadge('compiler_architect');

    if (isFirstTime) {
      if (success) {
        addXp(300, 'Complete Compiler Pipeline Executed!');
      } else {
        let partialXp = 0;
        if (phaseProgress.lexical) partialXp += 50;
        if (phaseProgress.syntax) partialXp += 75;
        if (phaseProgress.semantic) partialXp += 100;
        if (partialXp > 0) {
          addXp(partialXp, 'Compilation Phase Milestones');
        }
      }
    } else {
      addToast('info', 'Code Re-compiled', 'Program compiled successfully. XP already claimed for this unique code.');
    }
  };

  const damageBoss = (amount: number): boolean => {
    let defeated = false;
    setState((prev) => {
      const newHp = Math.max(0, prev.bossHp - amount);
      if (newHp === 0 && !prev.bossDefeated) {
        defeated = true;
      }
      return {
        ...prev,
        bossHp: newHp,
        bossDefeated: prev.bossDefeated || defeated,
      };
    });

    if (defeated) {
      unlockBadge('boss_slayer');
      addXp(500, 'Defeated The Compiler Boss!');
    }
    return defeated;
  };

  const resetProgress = () => {
    setState(DEFAULT_STATE);
    localStorage.removeItem(STORAGE_KEY);
    addToast('info', 'Progress Reset', 'All XP, levels, and badges have been reset.');
  };

  const toggleSound = () => {
    setState((prev) => ({ ...prev, soundEnabled: !prev.soundEnabled }));
  };

  const setUsername = (name: string) => {
    setState((prev) => ({ ...prev, username: name }));
  };

  return (
    <GameContext.Provider
      value={{
        state,
        currentLevelInfo,
        nextLevelInfo,
        xpProgressPercent,
        addXp,
        unlockBadge,
        completeChallenge,
        recordCompilation,
        damageBoss,
        resetProgress,
        toggleSound,
        setUsername,
        activeLevelUp,
        dismissLevelUp: () => setActiveLevelUp(null),
        activeBadgeUnlocked,
        dismissBadgeUnlock: () => setActiveBadgeUnlocked(null),
        toasts,
        removeToast,
        playSound,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
