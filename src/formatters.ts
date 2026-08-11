export function roundNumbers(numbersToRound: number[]) {
  return JSON.stringify(
    numbersToRound
      .map((num: number) => Math.round(num * 1000) / 1000)
      .join(' / '),
  );
}

export function roundIfNumber(value: number | string) {
  if (typeof value === 'string') return value;
  return Math.round(value * 1000) / 1000;
}
