export const validateGameSubmission = (body: any) => {
  const score = Number(body.score ?? 0);
  const accuracy = Number(body.accuracy ?? 0);
  const mistakes = Number(body.mistakes ?? 0);
  const duration = Number(body.duration ?? 0);
  const level = Number(body.level ?? 1);

  return {
    score: Math.min(100, Math.max(0, score)),
    accuracy: Math.min(100, Math.max(0, accuracy)),
    mistakes: Math.max(0, mistakes),
    duration: Math.max(0, duration),
    level: Math.min(5, Math.max(1, level)),
    gameId: String(body.gameId || 'game-1')
  };
};

export const sanitizeString = (str: string): string => {
  return str.replace(/[<>]/g, ''); // Simple XSS sanitization
};
