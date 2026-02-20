export const includes = <T>(array: readonly T[], value: unknown): boolean =>
  (array as readonly unknown[]).includes(value);

export const generateRandomInteger = (
  min: number,
  max: number,
  decimals = 0
): number => {
  const random = Math.random() * (max - min) + min;
  return parseFloat(random.toFixed(decimals));
};

export const getRandomItems = <T>(array: T[]): T[] => {
  const shuffled = array.sort(() => 0.5 - Math.random());
  const randomCount = generateRandomInteger(1, array.length);
  return shuffled.slice(0, randomCount);
};

export const getRandomItem = <T>(array: T[]): T => {
  const randomIndex = generateRandomInteger(0, array.length - 1);
  return array[randomIndex];
};

export const getErrorMessage = (error: unknown): string =>
  error instanceof Error ? error.message : String(error);
