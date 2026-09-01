export interface AdaptiveInput {
  score: number;
  accuracy: number;
  mistakes: number;
  duration: number;
  level: number;
  gameId: string;
  previousSessions?: { score: number; accuracy: number }[];
}

export const adaptiveEngine = {
  // Process adaptive performance output without medical diagnostics
  processPerformance(input: AdaptiveInput) {
    const score = Math.max(0, Math.min(100, input.score));
    const accuracy = Math.max(0, Math.min(100, input.accuracy));

    // Performance classification
    let classification: 'excellent' | 'good' | 'needs practice' | 'additional support';
    if (score >= 85) {
      classification = 'excellent';
    } else if (score >= 70) {
      classification = 'good';
    } else if (score >= 50) {
      classification = 'needs practice';
    } else {
      classification = 'additional support';
    }

    // Average calculations (including previous sessions if available)
    const history = input.previousSessions || [];
    const scores = [score, ...history.map(h => h.score)];
    const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;

    let recommendation: 'INCREASE DIFFICULTY' | 'MAINTAIN DIFFICULTY' | 'PROVIDE MORE PRACTICE';
    let nextLevelUnlocked = false;
    let recommendedLevel = input.level;

    if (avgScore >= 85) {
      recommendation = 'INCREASE DIFFICULTY';
      nextLevelUnlocked = input.level < 5;
      recommendedLevel = input.level < 5 ? input.level + 1 : 5;
    } else if (avgScore >= 70) {
      recommendation = 'MAINTAIN DIFFICULTY';
      nextLevelUnlocked = false; // needs consistent >85 or caregiver prompt to advance
      recommendedLevel = input.level;
    } else {
      recommendation = 'PROVIDE MORE PRACTICE';
      nextLevelUnlocked = false;
      recommendedLevel = input.level; // stay at same level, or support easier level
    }

    return {
      classification,
      recommendation,
      adaptiveResult: {
        currentLevel: input.level,
        nextLevelUnlocked,
        recommendedLevel
      }
    };
  },

  // Calculate global unlock configurations for the patient UI
  calculateUnlocks(history: { gameId: string; level: number; completed: boolean }[]) {
    // Unlocks base
    const unlocked: Record<string, boolean> = {
      'game-1': true, // Memory Match
      'game-2': true  // Sequence & Order
    };

    const isMatchL1 = history.some(h => h.gameId === 'game-1' && h.level === 1 && h.completed);
    const isPatternL1 = history.some(h => h.gameId === 'game-2' && h.level === 1 && h.completed);
    if (isMatchL1 && isPatternL1) {
      unlocked['game-3'] = true; // Attention Focus
    }

    const isMatchL2 = history.some(h => h.gameId === 'game-1' && h.level === 2 && h.completed);
    const isPatternL2 = history.some(h => h.gameId === 'game-2' && h.level === 2 && h.completed);
    const isAttentionL1 = history.some(h => h.gameId === 'game-3' && h.level === 1 && h.completed);
    if (isMatchL2 && isPatternL2 && isAttentionL1) {
      unlocked['game-4'] = true; // Object Recognition
    }

    // Sufficient progress in first four unlocks routine and language
    const countCompletedGames = Object.keys(unlocked).length;
    if (countCompletedGames >= 4) {
      unlocked['game-5'] = true; // Daily Routine Recall
    }
    if (countCompletedGames >= 5) {
      unlocked['game-6'] = true; // Language & Word Memory
    }

    return unlocked;
  }
};
