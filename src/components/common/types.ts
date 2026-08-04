export const SONG_TYPES = {
  OP: 1,
  ED: 2,
  IN: 3,
};
type SongType = (typeof SONG_TYPES)[keyof typeof SONG_TYPES];

interface Song {
  correctGuessPlayers: { name: string; answerTime: number }[];
  listStates: { name: string }[];
  songInfo: { animeDifficulty: number; type: SongType };
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
