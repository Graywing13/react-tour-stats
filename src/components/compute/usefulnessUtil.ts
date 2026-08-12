import { sum } from 'lodash';

export const EIGHT_PLAYER_USEFULNESS = [
  0,
  1,
  9 / 14,
  17 / 42,
  1 / 4,
  3 / 20,
  1 / 12,
  1 / 28,
  0,
];

const PLAYERS_PER_TEAM = 4;

export function calculateAvgRating(challongeData: string[][]): number {
  const [_headerRow, ...dataRows] = challongeData;
  const participantColumn = 1;
  const totalStartStr = '| Total = ';
  const totalEndStr = ' |';
  const totalRankPerTeam = dataRows
    .map((row) => row[participantColumn])
    .map((teamData) => teamData.split(totalStartStr)[1])
    .map((partialTeamStr) => partialTeamStr.split(totalEndStr)[0])
    .map((strNum) => Number(strNum));
  const totalRankInTour = sum(totalRankPerTeam);
  const totalPlayers = dataRows.length * PLAYERS_PER_TEAM;
  return totalRankInTour / totalPlayers;
}
