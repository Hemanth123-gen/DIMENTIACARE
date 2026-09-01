import { GameSession } from '../models/types';

export const gameService = {
  // Generate configuration based on gameId and level
  generateConfig(gameId: string, level: number) {
    const clampedLevel = Math.max(1, Math.min(5, level));

    switch (gameId) {
      case 'game-1': // Memory Match
        // Level 1: 2 pairs, Level 2: 3 pairs, Level 3: 4 pairs, Level 4: 6 pairs, Level 5: 8 pairs
        const pairsCount = clampedLevel === 1 ? 2 : clampedLevel === 2 ? 3 : clampedLevel === 3 ? 4 : clampedLevel === 4 ? 6 : 8;
        const symbolsPool = ['🌸', '🍎', '🎈', '🚗', '🐈', '🌟', '🍊', '🦋', '⚽', '🔑'];
        const chosenSymbols = symbolsPool.slice(0, pairsCount);
        return {
          pairs: pairsCount,
          symbols: [...chosenSymbols, ...chosenSymbols].sort(() => Math.random() - 0.5),
          previewTime: Math.max(1000, 4000 - clampedLevel * 500) // preview gets faster
        };

      case 'game-2':
      case 'sequence-order': {
        // Level 1: 3 items, Level 2: 4 items, Level 3: 5 items, Level 4: 6 items, Level 5: 7 items
        const itemsCount = 2 + clampedLevel;
        const itemsPool = [
          { id: 'breakfast', label: 'Breakfast', icon: 'Breakfast' },
          { id: 'medicine', label: 'Medicine', icon: 'Medicine' },
          { id: 'walk', label: 'Walk', icon: 'Walk' },
          { id: 'rest', label: 'Rest', icon: 'Rest' },
          { id: 'call_family', label: 'Call Family', icon: 'CallFamily' },
          { id: 'lunch', label: 'Lunch', icon: 'Lunch' },
          { id: 'dinner', label: 'Dinner', icon: 'Dinner' },
          { id: 'sleep', label: 'Sleep', icon: 'Sleep' },
          { id: 'cup', label: 'Cup', icon: 'Cup' },
          { id: 'book', label: 'Book', icon: 'Book' },
          { id: 'flower', label: 'Flower', icon: 'Flower' },
          { id: 'fruit', label: 'Fruit', icon: 'Fruit' },
          { id: 'house', label: 'House', icon: 'House' },
          { id: 'phone', label: 'Phone', icon: 'Phone' },
          { id: 'clock', label: 'Clock', icon: 'Clock' }
        ];

        // Shuffle pool and select N unique items
        const shuffledPool = [...itemsPool].sort(() => Math.random() - 0.5);
        const sequence = shuffledPool.slice(0, itemsCount);

        return {
          level: clampedLevel,
          sequence,
          previewDuration: Math.max(1500, 5000 - clampedLevel * 700)
        };
      }

      case 'game-3': // Attention Focus
        // Click odd symbol or changed visual property
        return {
          targetSymbol: '🦁',
          distractors: ['🐯', '🐱', '🐆', '🐈'].slice(0, Math.min(4, clampedLevel)),
          gridCount: 4 + clampedLevel * 4,
          speedLimitMs: Math.max(1000, 6000 - clampedLevel * 1000)
        };

      case 'game-4': // Object Recognition
        // Category identification
        const categories = ['house', 'tree', 'fruit', 'food', 'cup', 'medicine', 'flower'];
        const targetCategory = categories[clampedLevel % categories.length];
        return {
          targetCategory,
          objects: [
            { id: '1', name: 'apple', category: 'fruit', symbol: '🍎' },
            { id: '2', name: 'banana', category: 'fruit', symbol: '🍌' },
            { id: '3', name: 'hibiscus', category: 'flower', symbol: '🌺' },
            { id: '4', name: 'sunflower', category: 'flower', symbol: '🌻' },
            { id: '5', name: 'house', category: 'house', symbol: '🏠' },
            { id: '6', name: 'rice', category: 'food', symbol: '🍚' },
            { id: '7', name: 'tea', category: 'cup', symbol: '🍵' },
            { id: '8', name: 'pill', category: 'medicine', symbol: '💊' }
          ].sort(() => Math.random() - 0.5)
        };

      case 'game-5': // Daily Routine Recall
        // Generate sequencing questions based on schedule passed
        return {
          prompt: 'Identify if the routine sequence is correct',
          levelsCount: clampedLevel
        };

      case 'game-6': // Language & Word Memory
        // Remember list of NER-local and general words
        const wordPool = ['GAMOSA', 'PITHA', 'ORCHID', 'RIVER', 'VALLEY', 'HILLS', 'TEA', 'RHINO'];
        const count = 2 + clampedLevel;
        return {
          wordsToRemember: wordPool.slice(0, count).sort(() => Math.random() - 0.5),
          recallTimeoutMs: Math.max(5000, 15000 - clampedLevel * 2000)
        };

      default:
        return { message: 'Default configuration' };
    }
  },

  // Calculate local score based on game parameters
  calculateResult(gameId: string, level: number, details: any) {
    const accuracy = Math.max(0, Math.min(100, details.accuracy ?? 100));
    const mistakes = Math.max(0, details.mistakes ?? 0);
    const duration = Math.max(0, details.duration ?? 30);

    // Dynamic transparent algorithm
    const completionScore = 100;
    const consistencyScore = accuracy >= 80 ? 100 : accuracy >= 50 ? 70 : 40;
    const speedScore = Math.max(10, 100 - Math.floor(duration / 2));

    const finalScore = Math.round(
      accuracy * 0.60 + 
      completionScore * 0.20 + 
      consistencyScore * 0.10 + 
      speedScore * 0.10
    );

    return {
      score: Math.min(100, Math.max(0, finalScore)),
      accuracy,
      mistakes,
      duration
    };
  }
};
