import { type PlayerInfo, SONG_TYPES } from '../common/types.ts';
import { sum, zipWith } from 'lodash';
import type { ExtraCalcData } from './sheetColumns.ts';

// about player

export function getPlayerName(playerInfo: PlayerInfo) {
  return playerInfo.playerName;
}

export function getRank() {
  return 'dont have this yet, can extract from challonge';
}

// glance

export function getGuessRate(playerInfo: PlayerInfo) {
  const totalCorrect = getTotalCorrect(playerInfo);
  const totalSongs = getTotalSongs(playerInfo);
  return (totalCorrect / totalSongs) * 100;
}

export function getUsefulness(
  playerInfo: PlayerInfo,
  extraCalcData: ExtraCalcData,
) {
  return (
    (2 * playerInfo.playerUsefulnessSum * extraCalcData.avgPlayerRank) /
    sum(playerInfo.songCountsOEI)
  );
}

// compared to lobby

export function getErigs(playerInfo: PlayerInfo) {
  return playerInfo.ofEightOnCorrect[1];
}

export function getZeroEights(playerInfo: PlayerInfo) {
  return playerInfo.ofEightOnCorrect[0];
}

export function getSevenEightedCount() {
  return '';
}

export function getAvgEight(playerInfo: PlayerInfo) {
  const idx = [0, 1, 2, 3, 4, 5, 6, 7, 8];
  const ofEightsFractionSumPerOfEightKind = zipWith(
    idx,
    playerInfo.ofEightOnCorrect,
    (correctPlayerSize, instancesCorrectForSelf) => {
      const ofEightLabel = correctPlayerSize / 8;
      return ofEightLabel * instancesCorrectForSelf;
    },
  );
  const ofEightsSum = sum(ofEightsFractionSumPerOfEightKind);
  const totalCorrect = getTotalCorrect(playerInfo);
  return (ofEightsSum / totalCorrect) * 8;
}

export function getThreeEightsOrBelow(playerInfo: PlayerInfo) {
  const correctCountsFor_0123_OfEight = playerInfo.correctCountsOEI.slice(0, 5);
  return sum(correctCountsFor_0123_OfEight);
}

// guess rate details

export function getOpGuessRate(playerInfo: PlayerInfo) {
  return (
    playerInfo.correctCountsOEI[SONG_TYPES.OP] /
    playerInfo.songCountsOEI[SONG_TYPES.OP]
  );
}

export function getEdGuessRate(playerInfo: PlayerInfo) {
  return (
    playerInfo.correctCountsOEI[SONG_TYPES.ED] /
    playerInfo.songCountsOEI[SONG_TYPES.ED]
  );
}

export function getInGuessRate(playerInfo: PlayerInfo) {
  return (
    playerInfo.correctCountsOEI[SONG_TYPES.IN] /
    playerInfo.songCountsOEI[SONG_TYPES.IN]
  );
}

// compared to lobby pt 2

export function getTotalX0s() {
  return '';
}

export function getTotal1Xs() {
  return '';
}

// guess rate details part 2

export function getTotalCorrect(playerInfo: PlayerInfo) {
  return sum(playerInfo.correctCountsOEI);
}

export function getTotalSongs(playerInfo: PlayerInfo) {
  return sum(playerInfo.songCountsOEI);
}

// self correct song stats

export function getAvgCorrectDiff(playerInfo: PlayerInfo) {
  return sum(playerInfo.difficultyCorrectSumOEI) / getTotalCorrect(playerInfo);
}

export function getMedianCorrectLockTime(playerInfo: PlayerInfo) {
  // https://github.com/lodash/lodash/issues/4762#issue-615221897
  const median = (array: number[]) => {
    array.sort((a, b) => b - a);
    const length = array.length;
    if (length % 2 == 0) {
      return (array[length / 2] + array[length / 2 - 1]) / 2;
    } else {
      return array[Math.floor(length / 2)];
    }
  };
  return median(playerInfo.correctLockTimesList);
}

// team performance

export function getWins() {
  return 'have this info but not ready';
}

export function getLose() {
  return 'have this info but not ready';
}

export function getTie() {
  return 'have this info but not ready';
}

// sniper guessrate

export function getOnlist(playerInfo: PlayerInfo) {
  return (playerInfo.onlistCorrect / getRigs(playerInfo)) * 100;
}

export function getOfflist(playerInfo: PlayerInfo) {
  return (playerInfo.offlistCorrect / getRigs(playerInfo)) * 100;
}

// your rig, your performance

export function getRigPercentage(playerInfo: PlayerInfo) {
  return (getRigs(playerInfo) / getTotalSongs(playerInfo)) * 100;
}

export function getRigs(playerInfo: PlayerInfo) {
  return sum(playerInfo.rigCountsOEI);
}

export function getSoloRigs(playerInfo: PlayerInfo) {
  return playerInfo.soloRigs;
}

export function getMissedSolos(playerInfo: PlayerInfo) {
  return playerInfo.soloRigsMissed;
}

export function getRigsHit(playerInfo: PlayerInfo) {
  return playerInfo.onlistCorrect;
}

export function getRigsMissed(playerInfo: PlayerInfo) {
  return getRigs(playerInfo) - playerInfo.onlistCorrect;
}

export function getLivesLostOnRigs() {
  return 'dont have this info yet';
}

export function getOfflistErigs(playerInfo: PlayerInfo) {
  return playerInfo.offlistErig;
}

// your rig, others' performance

export function getAvgEightOfRigs(playerInfo: PlayerInfo) {
  const idx = [0, 1, 2, 3, 4, 5, 6, 7, 8];
  const ofEightsFractionSumPerOfEightKind = zipWith(
    idx,
    playerInfo.ofEightOnRig,
    (correctPlayerSize, instancesRigForSelf) => {
      const ofEightLabel = correctPlayerSize / 8;
      return ofEightLabel * instancesRigForSelf;
    },
  );
  const ofEightsSum = sum(ofEightsFractionSumPerOfEightKind);
  const totalRig = getRigs(playerInfo);
  return (ofEightsSum / totalRig) * 8;
}
