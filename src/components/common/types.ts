import { SHEET_COLUMNS } from '../tables/tableDataTypes.ts';

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

export const API_KEY_FIELD = [
  'type',
  'project_id',
  'private_key_id',
  'private_key',
  'client_email',
  'client_id',
  'auth_uri',
  'token_uri',
  'auth_provider_x509_cert_url',
  'client_x509_cert_url',
  'universe_domain',
];

export type SheetApiKeyType = {
  [property: (typeof API_KEY_FIELD)[number]]: string;
};

export interface AliasType {
  [botName: string]: string[];
}

export interface PlayerInfo {
  playerName: string;

  // The following are arrays with length 4. idx 0 = nothing, 1 = op, 2 = ed, 3 = in. OEI = OP,ED,IN
  songCountsOEI: number[];
  rigCountsOEI: number[];
  correctCountsOEI: number[];
  difficultyCorrectSumOEI: number[];
  lockSpeedCorrectSumOEI: number[];

  // other arrays
  ofEightOnCorrect: number[]; // array of 9. For every song this player got correct, whether they were out of the (0), 1, 2, 3, 4, 5, 6, 7, or 8 players correct
  ofEightOnRig: number[]; // lobby of eight on your rigs
  correctLockTimesList: number[]; // array of variable length. for finding median.

  // numbers
  onlistCorrect: number;
  offlistCorrect: number;
  soloRigs: number; // solo rigs
  soloRigsMissed: number; // solo rigs that you missed (that others may have hit)
  offlistErig: number;
}

export type DerivedPlayerInfoType = {
  [key: keyof typeof SHEET_COLUMNS]: string | number;
};
