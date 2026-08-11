import { type PlayerInfo, SONG_TYPES } from '../common/types.ts';
import { sum, zipWith } from 'lodash';

// about player

export function getPlayerName(playerInfo: PlayerInfo) {
  return playerInfo.playerName;
}

// glance

export function getGuessRate(playerInfo: PlayerInfo) {
  const totalCorrect = getTotalHit(playerInfo);
  const totalSongs = getTotalSongs(playerInfo);
  return totalCorrect / totalSongs;
}

export function getUsefulness(playerInfo: PlayerInfo) {
  return `idk, but I'm sure ${playerInfo.playerName} is sometimes useful.`;
}

// compared to lobby

export function getErigs(playerInfo: PlayerInfo) {
  return playerInfo.ofEightOnCorrect[1];
}

export function getZeroEights(playerInfo: PlayerInfo) {
  return playerInfo.ofEightOnCorrect[0];
}

export function getSevenEightedCount(playerInfo: PlayerInfo) {
  return sum(playerInfo.sevenEightedCount);
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
  const totalCorrect = getTotalHit(playerInfo);
  return (ofEightsSum / totalCorrect) * 8;
}

export function getThreeEightsOrBelow(playerInfo: PlayerInfo) {
  const correctCountsFor_0123_OfEight = playerInfo.correctCounts.slice(0, 5);
  return sum(correctCountsFor_0123_OfEight);
}

// guess rate details

export function getOpGuessRate(playerInfo: PlayerInfo) {
  return (
    playerInfo.correctCounts[SONG_TYPES.OP] /
    playerInfo.songCounts[SONG_TYPES.OP]
  );
}

export function getEdGuessRate(playerInfo: PlayerInfo) {
  return (
    playerInfo.correctCounts[SONG_TYPES.ED] /
    playerInfo.songCounts[SONG_TYPES.ED]
  );
}

export function getInGuessRate(playerInfo: PlayerInfo) {
  return (
    playerInfo.correctCounts[SONG_TYPES.IN] /
    playerInfo.songCounts[SONG_TYPES.IN]
  );
}

// compared to lobby pt 2

export function getTotalX0s(playerInfo: PlayerInfo) {
  return 'idk';
}

export function getTotal1Xs(playerInfo: PlayerInfo) {
  return 'idk';
}

// guess rate details part 2

export function getTotalHit(playerInfo: PlayerInfo) {
  return sum(playerInfo.correctCounts);
}

export function getTotalSongs(playerInfo: PlayerInfo) {
  return sum(playerInfo.songCounts);
}

// self correct song stats

export function getAvgCorrectDiff(playerInfo: PlayerInfo) {
  return sum(playerInfo.difficultyCorrectSum) / getTotalHit(playerInfo);
}

export function getMedianCorrectLockTime(playerInfo: PlayerInfo) {
  const meanLockTime =
    sum(playerInfo.lockSpeedCorrectSum) / getTotalHit(playerInfo);
  return `avg for now: ${meanLockTime}`;
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

export function getOnlist() {
  return 'dont have this data yet';
}

export function getOfflist() {
  return 'dont have this data yet';
}

// your rig, your performance

export function getRigPercentage(playerInfo: PlayerInfo) {
  return getRigs(playerInfo) / getTotalSongs(playerInfo);
}

export function getRigs(playerInfo: PlayerInfo) {
  return sum(playerInfo.rigCounts);
}

export function getSoloRigs(playerInfo: PlayerInfo) {
  return 'dont have this info yet';
}

export function getMissedSolos(playerInfo: PlayerInfo) {
  return 'dont have this info yet';
}

export function getRigsHit(playerInfo: PlayerInfo) {
  return 'dont have this info yet';
}

export function getRigsMissed(playerInfo: PlayerInfo) {
  return 'dont have this info yet';
}

export function getLivesLostOnRigs(playerInfo: PlayerInfo) {
  return 'dont have this info yet';
}

export function getOfflistErigs(playerInfo: PlayerInfo) {
  return 'dont have this info yet';
}

// your rig, others' performance

export function getAvgEightOfRigs(playerInfo: PlayerInfo) {
  return 'dont have this info yet';
}
