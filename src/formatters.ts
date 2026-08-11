export function roundNumbers(numbersToRound: number[]) {
  return JSON.stringify(
    numbersToRound
      .map((num: number) => Math.round(num * 1000) / 1000)
      .join(' / '),
  );
}
