import * as calc from './rawDataParser.ts';
import type { PlayerInfo } from '../common/types.ts';

interface SheetColumnsType {
  [sheetHeaderRow: string]: { fn: (playerInfo: PlayerInfo) => number | string };
}

export const SHEET_COLUMNS: SheetColumnsType = {
  // about player
  'Player name': { fn: calc.getPlayerName },

  // glance
  'Guess rate': { fn: calc.getGuessRate },
  Usefulness: { fn: calc.getUsefulness },

  // compared to lobby
  erigs: { fn: calc.getErigs },
  '0/8s': { fn: calc.getZeroEights },
  '7/8s': { fn: calc.getSevenEightedCount },
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
  'Total hit': { fn: calc.getTotalHit },
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
