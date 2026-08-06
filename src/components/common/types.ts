export const SONG_TYPES = {
  OP: 1,
  ED: 2,
  IN: 3,
};
export type SongType = (typeof SONG_TYPES)[keyof typeof SONG_TYPES];

export interface CorrectGuessPlayer {
  name: string;
  answerTime: number;
}

export interface SongInfo {
  animeDifficulty: number;
  type: SongType;
}

interface Song {
  correctGuessPlayers: CorrectGuessPlayer[];
  listStates: { name: string }[];
  songInfo: SongInfo;
}

export interface JsonType {
  songs: Song[];
  roomName: string;
  startTime: string;
}

export interface SheetMetadataType {
  sheetId: string;
  apiKey: string;
}

export interface AliasType {
  [botName: string]: string[];
}

export interface PlayerInfo {
  // The following are arrays with length 4. idx 0 = nothing, 1 = op, 2 = ed, 3 = in
  songCounts: number[];
  rigCounts: number[];
  correctCounts: number[];
  difficultyCorrectSum: number[];
  lockSpeedCorrectSum: number[];
  // array of 9. For every song this player got correct, whether they were out of the (0), 1, 2, 3, 4, 5, 6, 7, or 8 players correct
  ofEightOnCorrect: number[];
  sevenEightsCount: number[]; // the only player that got this wrong
}

export interface PlayerInfos {
  [username: string]: PlayerInfo;
}
