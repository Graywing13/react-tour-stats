import * as calc from './rawDataCalculator.ts';
import type { PlayerInfo } from '../common/types.ts';

export interface ExtraCalcData {
  avgPlayerRank: number;
}

interface SheetColumnsType {
  [sheetHeaderRow: string]: {
    fn: (
      playerInfo: PlayerInfo,
      extraCalcData: ExtraCalcData,
    ) => number | string;
  };
}

export const ALL_COLUMNS: SheetColumnsType = {
  // about player
  Rank: { fn: calc.getRank },
  'Player name': { fn: calc.getPlayerName },

  // glance
  'Guess rate': { fn: calc.getGuessRate },
  Usefulness: { fn: calc.getUsefulness },

  // compared to lobby
  erigs: { fn: calc.getErigs },
  '0/8s': { fn: calc.getZeroEights },
  "got 7/8'd": { fn: calc.getSevenEightedCount },
  'avg/8': { fn: calc.getAvgEight },
  '# 3/8s or below': { fn: calc.getThreeEightsOrBelow },

  // guess rate details
  'OP guess rate': { fn: calc.getOpGuessRate },
  'ED guess rate': { fn: calc.getEdGuessRate },
  'IN guess rate': { fn: calc.getInGuessRate },

  // compared to lobby pt 2
  "Total X-0's": { fn: calc.getTotalX0s },
  "Total 1-X's": { fn: calc.getTotal1Xs },

  // guess rate details part 2
  'Total hit': { fn: calc.getTotalCorrect },
  'Total songs': { fn: calc.getTotalSongs },

  // self correct song stats
  'avg correct diff': { fn: calc.getAvgCorrectDiff },
  'median lock time': { fn: calc.getMedianCorrectLockTime },

  // team performance
  WIN: { fn: calc.getWins },
  LOSE: { fn: calc.getLose },
  TIE: { fn: calc.getTie },

  // sniper guess rate
  Onlist: { fn: calc.getOnlist },
  Offlist: { fn: calc.getOfflist },

  // your rig, your performance
  'Rig %': { fn: calc.getRigPercentage },
  Rigs: { fn: calc.getRigs },
  'Solo rigs': { fn: calc.getSoloRigs },
  'Missed solos': { fn: calc.getMissedSolos },
  'Rigs hit': { fn: calc.getRigsHit },
  'Rigs missed': { fn: calc.getRigsMissed },
  '0-X on rigs': { fn: calc.getLivesLostOnRigs },
  'Offlist erigs': { fn: calc.getOfflistErigs },

  // your rig, others' performance
  'avg/8 of your rigs': { fn: calc.getAvgEightOfRigs },
};

export const colNames = {
  Rank: 'Rank',
  'Player name': 'Player name',
  'Guess rate': 'Guess rate',
  Usefulness: 'Usefulness',
  erigs: 'erigs',
  '0/8s': '0/8s',
  "got 7/8'd": "got 7/8'd",
  'avg/8': 'avg/8',
  '# 3/8s or below': '# 3/8s or below',
  'OP guess rate': 'OP guess rate',
  'ED guess rate': 'ED guess rate',
  'IN guess rate': 'IN guess rate',
  "Total X-0's": "Total X-0's",
  "Total 1-X's": "Total 1-X's",
  'Total hit': 'Total hit',
  'Total songs': 'Total songs',
  'avg correct diff': 'avg correct diff',
  'median lock time': 'median lock time',
  WIN: 'WIN',
  LOSE: 'LOSE',
  TIE: 'TIE',
  Onlist: 'Onlist',
  Offlist: 'Offlist',
  'Rig %': 'Rig %',
  Rigs: 'Rigs',
  'Solo rigs': 'Solo rigs',
  'Missed solos': 'Missed solos',
  'Rigs hit': 'Rigs hit',
  'Rigs missed': 'Rigs missed',
  '0-X on rigs': '0-X on rigs',
  'Offlist erigs': 'Offlist erigs',
  'avg/8 of your rigs': 'avg/8 of your rigs',
};

export const SUMMARY_STAT_COLS: (keyof typeof ALL_COLUMNS)[] = [
  colNames['Player name'],
  colNames['Guess rate'],
  colNames['Usefulness'],
  colNames['erigs'],
  colNames["got 7/8'd"],
  colNames['avg/8'],
  colNames["Total X-0's"],
  colNames["Total 1-X's"],
  colNames['Total songs'],
  colNames['OP guess rate'],
  colNames['ED guess rate'],
  colNames['IN guess rate'],
  colNames['Rigs'],
  colNames['Rigs missed'],
  colNames['Onlist'],
  colNames['Offlist'],
];

export const SONG_TYPE_AND_DELTAS_COLS: (keyof typeof ALL_COLUMNS)[] = [
  colNames['Rank'],
  colNames['Player name'],
  colNames['Guess rate'], // missing delta gr
  colNames['Usefulness'], // missing delta uf
  colNames['OP guess rate'], // missing delta op, # correct
  colNames['ED guess rate'], // missing delta ed, # correct
  colNames['IN guess rate'], // missing delta in, # correct
  colNames['avg correct diff'], // missing avg diff played, avg vintage hit, avg vintage played
];

export const WATCHED_EXCLUSIVE_COLS: (keyof typeof ALL_COLUMNS)[] = [
  colNames['Rank'],
  colNames['Player name'],
  colNames['Onlist'],
  colNames['Offlist'],
  colNames['Rig %'],
  colNames['Rigs hit'],
  colNames['Rigs missed'],
  colNames['Rigs'],
  colNames['Solo rigs'],
  colNames['Missed solos'],
  colNames['0-X on rigs'],
  colNames['Offlist erigs'],
  colNames['avg/8 of your rigs'], // missing avg vintage rig
];

export const OMIT_FROM_SHEET: (keyof typeof ALL_COLUMNS)[] = [colNames['Rank']];
